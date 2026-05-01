const { getImages } = require('icloud-shared-album');
const fs = require('fs');
const path = require('path');

const ALBUM_TOKEN = 'B2B5nhQSTGcA6cy';
const OUTPUT_FILE = path.join(__dirname, 'photos.json'); // save locally so development works without build loop
const DIST_OUTPUT_FILE = path.join(__dirname, 'dist', 'photos.json');

async function fetchPhotos() {
    try {
        console.log(`Fetching iCloud shared album: ${ALBUM_TOKEN}`);
        const data = await getImages(ALBUM_TOKEN);
        
        // Extract the best resolution image URLs and maybe captions
        const photos = data.photos.map(photo => {
            const derivativesArray = Object.values(photo.derivatives);
            
            // Find the highest resolution derivative
            let bestDerivative = derivativesArray[0];
            let maxArea = parseInt(bestDerivative.width, 10) * parseInt(bestDerivative.height, 10);
            
            for (let i = 1; i < derivativesArray.length; i++) {
                const derivative = derivativesArray[i];
                const area = parseInt(derivative.width, 10) * parseInt(derivative.height, 10);
                if (area > maxArea) {
                    maxArea = area;
                    bestDerivative = derivative;
                }
            }
            
            return {
                url: bestDerivative.url,
                width: bestDerivative.width,
                height: bestDerivative.height,
                caption: photo.caption || ''
            };
        });

        const jsonStr = JSON.stringify(photos, null, 2);
        
        // Write to root so npm run start/dev can use it directly
        fs.writeFileSync(OUTPUT_FILE, jsonStr);
        console.log(`Saved ${photos.length} photos to ${OUTPUT_FILE}`);
        
        // Also write to dist if it exists
        if (fs.existsSync(path.join(__dirname, 'dist'))) {
            fs.writeFileSync(DIST_OUTPUT_FILE, jsonStr);
            console.log(`Saved ${photos.length} photos to ${DIST_OUTPUT_FILE}`);
        }
        
    } catch (error) {
        console.error('Error fetching iCloud photos:', error);
        process.exit(1);
    }
}

fetchPhotos();
