export async function onRequestGet(context) {
    // The exact same token used in the pooleside old fetch script
    const streamId = 'B2B5nhQSTGcA6cy'; 
    
    try {
        let url = `https://p01-sharedstreams.icloud.com/${streamId}/sharedstreams/webstream`;
        let res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ streamCtag: null }),
            headers: { 'Content-Type': 'text/plain' },
        });

        if (!res.ok && res.status !== 330) {
            throw new Error('Failed to fetch iCloud partition');
        }

        let data = await res.json();
        let host = data['X-Apple-MMe-Host'];

        if (host) {
            url = `https://${host}/${streamId}/sharedstreams/webstream`;
            res = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ streamCtag: null }),
                headers: { 'Content-Type': 'text/plain' },
            });
            if (!res.ok) {
                throw new Error('Failed to fetch iCloud photos stream');
            }
            data = await res.json();
        }

        const photos = data.photos || [];
        if (photos.length === 0) {
            return new Response(JSON.stringify([]), { 
                headers: { 
                    'Content-Type': 'application/json',
                    'Cache-Control': 'public, max-age=3600'
                } 
            });
        }

        const photoGuids = photos.map((p) => p.photoGuid);

        // Step 2: get asset urls
        const assetUrl = `https://${host}/${streamId}/sharedstreams/webasseturls`;
        const assetRes = await fetch(assetUrl, {
            method: 'POST',
            body: JSON.stringify({ photoGuids }),
            headers: { 'Content-Type': 'text/plain' },
        });
        
        if (!assetRes.ok) throw new Error('Failed to fetch iCloud asset URLs');

        const assetData = await assetRes.json();
        const parsedPhotos = [];

        for (const p of photos) {
            // find max derivative
            const dKeys = Object.keys(p.derivatives);
            if (dKeys.length === 0) continue;

            const derivativesList = dKeys.map(k => p.derivatives[k]);
            derivativesList.sort((a, b) => {
                const areaA = parseInt(a.width, 10) * parseInt(a.height, 10);
                const areaB = parseInt(b.width, 10) * parseInt(b.height, 10);
                return areaA - areaB;
            });

            const maxD = derivativesList[derivativesList.length - 1];
            const checksum = maxD.checksum;
            const item = assetData.items[checksum];

            if (!item) continue;

            const location = assetData.locations[item.url_location];
            const scheme = location.scheme;
            const hostUrl = location.hosts[0];
            const downloadUrl = `${scheme}://${hostUrl}${item.url_path}`;

            parsedPhotos.push({
                id: p.photoGuid,
                url: downloadUrl,
                date: new Date(p.dateCreated).getTime(),
                width: parseInt(maxD.width),
                height: parseInt(maxD.height),
                caption: p.caption || ''
            });
        }

        // Sort photos conceptually from oldest to newest
        parsedPhotos.sort((a, b) => a.date - b.date);

        // Cache the response at the edge for 1 hour to prevent hitting iCloud rate limits
        return new Response(JSON.stringify(parsedPhotos), {
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'public, max-age=3600, s-maxage=3600'
            }
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), { 
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
