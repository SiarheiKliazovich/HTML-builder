const fs = require('fs');
const path = require('path');

const pathFilesDirect = path.join(__dirname, 'files');
const pathFilesCopyDirect = path.join(__dirname, 'files-copy');

if (!fs.existsSync(path.resolve(pathFilesCopyDirect))) {
    fs.mkdir(path.resolve(pathFilesCopyDirect), (err) => {
        if (err) {
         return err.message 
        };
    });
};

fs.readdir(path.resolve(pathFilesDirect), (err, files) => {
    if (err){
      return err.message;
    } 
    const filesFolder = (file) => path.join('files', file);
    const filesCopy = (file) => path.join('files-copy', file);

    files.map(file => {
        fs.copyFile(path.resolve(__dirname, filesFolder(file)), path.resolve(__dirname, filesCopy(file)), (err) => {
            if (err) {
              return err.message;
            } 
        });
    });
});
