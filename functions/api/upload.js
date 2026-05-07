export async function onRequestPost(context) {
  try {
    const formData = await context.request.formData();
    const password = formData.get('password');
    
    if (password !== context.env.ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const file = formData.get('file');
    const title = formData.get('title');
    const artist = formData.get('artist');
    const duration = parseInt(formData.get('duration'), 10);

    if (!file || !title || !artist || isNaN(duration)) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { 
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Clean filename and add timestamp to prevent overwrites
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const filename = `${Date.now()}-${cleanFileName}`;
    
    // Save the audio file to R2
    await context.env.TRACKS_BUCKET.put(filename, file.stream(), {
      httpMetadata: { contentType: file.type }
    });

    // Fetch existing tracks metadata
    let tracks = [];
    const existingTracksObj = await context.env.TRACKS_BUCKET.get('tracks.json');
    
    if (existingTracksObj) {
      try {
        tracks = await existingTracksObj.json();
      } catch (e) {
        console.error("Failed to parse existing tracks.json", e);
        // Default to empty array if corrupted
      }
    }

    // Add new track
    tracks.push({
      title,
      artist,
      url: `/api/audio/${filename}`,
      duration
    });

    // Save updated tracks.json back to R2
    await context.env.TRACKS_BUCKET.put('tracks.json', JSON.stringify(tracks), {
      httpMetadata: { contentType: 'application/json' }
    });

    return new Response(JSON.stringify({ success: true, tracks }), {
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
