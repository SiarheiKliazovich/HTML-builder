const fs = require('fs');
const path = require('path');

const pathStyle = path.join(__dirname, 'styles');
const pathBundle = ( path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(pathStyle, (err, files) => {
  if (err) throw err;

  let array = [];
   files.forEach((_, index) => {
    const isParsedFile = path.parse(files[index]).ext === '.css';

    if (isParsedFile) {
      const fileRead = fs.createReadStream(path.join(__dirname, 'styles', files[index]), 'utf-8');

      fileRead.on('data', (symb) => array.push(symb));
      fileRead.on('end', () => {
        const fileWrite = fs.createWriteStream(pathBundle);
        
        fileWrite.write(array.join('\n'));
      });
    }
  })
});