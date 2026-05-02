const { getImages } = require('icloud-shared-album');
console.log(getImages);
getImages('B2B5nhQSTGcA6cy').then(images => console.log(images)).catch(e => console.error(e));
