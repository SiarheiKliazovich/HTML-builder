const fs = require('fs');
const path = require('path');
const fsP = require('fs/promises');

const pathStyle = path.join(__dirname, 'styles');
const pathAssets = path.join(__dirname, 'assets');
const pathPrDist = path.join(__dirname, 'project-dist')
const pathComponents = path.join(__dirname, 'components');
const pathTemplate = path.join(__dirname, 'template.html');
const pathAssetsDir = path.join(__dirname, 'project-dist', 'assets');
const pathDistStyle = path.join(__dirname, 'project-dist', 'style.css');
const pathDistIndex = path.join(__dirname, 'project-dist', 'index.html');

const errorHandler = (pathFile) => {
  fs.mkdir(pathFile, { recursive: true }, (error) => {
    if (error) throw error;
  });
}

errorHandler(pathPrDist);
errorHandler(pathAssetsDir);

const copyDirectory = async () => {
  const assets = await fsP.readdir(pathAssets, {withFileTypes: true });
 
  for (let i = 0; i < assets.length; i++) {
    console.log(assets[i].name);
    const pathAssetDist = path.join(__dirname, 'project-dist', 'assets', assets[i].name);
    errorHandler(pathAssetDist);

    const arrBuild = await fsP.readdir(pathAssetDist, { withFileTypes: true });

    for (let j = 0; j < arrBuild.length; j++) {
      fs.unlink(path.join(__dirname, 'project-dist', 'assets', assets[i].name, arrBuild[j].name), (error) => {
        if (error) throw error;
      });
    }

    const arrCopy = await fsP.readdir(path.join(__dirname, 'assets', assets[i].name), {withFileTypes: true});

    for (let j = 0; j < arrCopy.length; j++) {
      fs.copyFile(
        path.join(__dirname, 'assets', assets[i].name, arrCopy[j].name),
        path.join(__dirname, 'project-dist', 'assets', assets[i].name, arrCopy[j].name),
        (error) => {
          if (error) throw error;
        },
      );
    }
    console.log(`Files ${assets[i].name} copied`);
  }
}
  
copyDirectory();

const fileCss = async () => {
  fs.readdir(pathStyle, function (error, files) {
    if (error) throw error;

    let result = [];
    for (let i = 0; i < files.length; i++) {
      if (path.parse(files[i]).ext === '.css') {
        let readFile = fs.createReadStream(path.join(__dirname, 'styles', files[i]), 'utf-8');
        readFile.on('data', (symb) => result.push(symb));
        readFile.on('end', () => {
          let writeFile = fs.createWriteStream(pathDistStyle);
          writeFile.write(result.join('\n'));
        });
      }
    }
    console.log('CSS file created');
  });
};

fileCss();

const fileHtml = async () => {
  const templatefile = await fsP.readFile(pathTemplate, 'utf-8');
  const templateComponents = await fsP.readdir(pathComponents, {withFileTypes: true});

  let s = templatefile.toString();
  for (let i = 0; i < templateComponents.length; i++) {
    if (templateComponents[i].isFile() && path.extname(templateComponents[i].name) === '.html') {
      const readFile = fs.createReadStream(path.join(__dirname, 'components', templateComponents[i].name), 'utf-8',);

      readFile.on('data', (data) => {
        s = s.replace(`{{${templateComponents[i].name.replace('.html', '')}}}`, data);
      });

      readFile.on('end', () => {
        const writeFile = fs.createWriteStream(pathDistIndex);
        writeFile.write(s);
      });
    }
  }

  console.log('HTML template created');
};

fileHtml();
