const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'file.txt');



fs.open('file.txt', 'w', (err) => {
    if(err) throw err;
    console.log('File created');

    const writableStream = fs.createWriteStream(filePath);
    const { stdin, stdout } = process;
    process.exitCode = 'exit';
    stdout.write("Enter your text: ");

    stdin.on('data', data => {
        const text = data.toString();
        if (text.trim() === process.exitCode) {
            console.log('Thank you. Good luck');
            process.exit();
        } else {
            writableStream.write(text);
        }

        process.on('SIGINT', function() {
            console.log('Thank you. Good luck');
            process.exit();
        });
    })
})
