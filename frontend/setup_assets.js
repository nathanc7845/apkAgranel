const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'assets');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
}

const imgData = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
const buffer = Buffer.from(imgData, 'base64');

['icon.png', 'splash.png', 'adaptive-icon.png', 'favicon.png'].forEach(file => {
    fs.writeFileSync(path.join(dir, file), buffer);
});

console.log('Assets criados com sucesso!');
