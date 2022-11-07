const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'file.txt');

fs.open(filePath, 'r+', (err) => {
    if(err) throw err;
    const writableStream = fs.createWriteStream(filePath);
    const { stdin, stdout } = process;
    process.exitCode = 'exit';
    stdout.write("Enter your text: ");

    stdin.on('data', data => {
        const text = data.toString();
        writableStream.write(text);
        if (text.trim() === process.exitCode) {
            console.log('Thank you. Good luck');
            process.exit();
        }

        process.on('SIGINT', function() {
            console.log('Thank you. Good luck');
            process.exit();
        });
    })
})
