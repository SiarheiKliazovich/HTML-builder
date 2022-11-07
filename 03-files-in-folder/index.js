const fs = require('fs');
const path = require('path');
const directory = path.join(__dirname, './secret-folder');

fs.readdir(directory, {withFileTypes: true }, (_, files) => {
  files.forEach((elem) => {
    if (elem.isFile()) {
      const filesPath = path.join(directory, elem.name);
      fs.stat(filesPath, (_, stats) => {
        const kb = 1024;
        const filesName = path.parse(filesPath).name;
        const filesExtens = path.extname(filesPath).slice(1);
        const filesSize = stats.size / kb;
        console.log(`${filesName} - ${filesExtens} - ${filesSize} KB`);
      })
    }
  })
});
