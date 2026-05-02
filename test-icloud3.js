const { getImages } = require('icloud-shared-album');
getImages('B2B5nhQSTGcA6cy').then(data => console.log(data.photos[0].derivatives)).catch(e => console.error(e));
