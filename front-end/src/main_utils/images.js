const fs = require('fs');
const path = require("node:path");

function _getAllImages(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            getAllImages(filePath, fileList); // Recursively search subdirectories
        } else if (stat.isFile() && (file.endsWith('.jpg') || file.endsWith('.png'))) {
            fileList.push(filePath); // Add the .jpg or .png file to the list
        }
    });
}

function getAllImages() {
    let images = [];
    const rendererRoot = path.resolve(__dirname, '..', 'renderer');
    _getAllImages(rendererRoot, images);
    return images;
}
