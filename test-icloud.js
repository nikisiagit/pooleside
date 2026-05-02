const icloud = require('icloud-shared-album');
icloud.getImages('B2B5nhQSTGcA6cy').then(images => console.log(images.length));
