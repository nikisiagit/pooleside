const { getImages } = require('icloud-shared-album');
const fs = require('fs');
const path = require('path');
const https = require('https');

const ALBUM_TOKEN = 'B2B5nhQSTGcA6cy';
const OUTPUT_FILE = path.join(__dirname, 'photos.json');
const DIST_OUTPUT_FILE = path.join(__dirname, 'dist', 'photos.json');
const GALLERY_DIR = path.join(__dirname, 'assets', 'gallery');

// Helper to download image
function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode !== 200) {
                return reject(new Error(`Failed to get '${url}' (${res.statusCode})`));
            }
            const fileStream = fs.createWriteStream(filepath);
            res.pipe(fileStream);
            fileStream.on('finish', () => {
                fileStream.close();
                resolve();
            });
            fileStream.on('error', (err) => {
                fs.unlink(filepath, () => reject(err));
            });
        }).on('error', reject);
    });
}

async function fetchPhotos() {
    try {
        console.log(`Fetching iCloud shared album: ${ALBUM_TOKEN}`);
        const data = await getImages(ALBUM_TOKEN);
        
        // Ensure gallery directory exists
        if (!fs.existsSync(GALLERY_DIR)) {
            fs.mkdirSync(GALLERY_DIR, { recursive: true });
        }
        
        const photos = [];
        
        for (let idx = 0; idx < data.photos.length; idx++) {
            const photo = data.photos[idx];
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
            
            const filename = `photo-${idx}.jpg`;
            const filepath = path.join(GALLERY_DIR, filename);
            const localUrl = `assets/gallery/${filename}`;
            
            console.log(`Downloading ${filename}...`);
            await downloadImage(bestDerivative.url, filepath);
            
            photos.push({
                url: localUrl,
                width: bestDerivative.width,
                height: bestDerivative.height,
                caption: photo.caption || ''
            });
        }

        const jsonStr = JSON.stringify(photos, null, 2);
        
        fs.writeFileSync(OUTPUT_FILE, jsonStr);
        console.log(`Saved ${photos.length} photos metadata to ${OUTPUT_FILE}`);
        
        if (fs.existsSync(path.join(__dirname, 'dist'))) {
            fs.writeFileSync(DIST_OUTPUT_FILE, jsonStr);
        }
        
    } catch (error) {
        console.error('Error fetching iCloud photos:', error);
        process.exit(1);
    }
}

fetchPhotos();
