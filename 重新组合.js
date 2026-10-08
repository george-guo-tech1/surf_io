const fs = require('fs');
const path = require('path');

const inputPath = path.join(__dirname, '开包game.js后的文件');
let rawdata = fs.readFileSync(inputPath, 'utf8');
let source = JSON.parse(rawdata);

const outDir = path.join(__dirname, 'extracted_modules');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

source.forEach(s_file => {
    const idPart = typeof s_file.id === 'number' ? 'module_' + s_file.id : String(s_file.id);
    const filename = idPart + '.js';
    const outPath = path.join(outDir, filename);
    fs.writeFileSync(outPath, s_file.source, 'utf8');
    if (s_file.entry === true) console.log(filename + ' 是启动项！！！！！！！！！！！！');
});

console.log('已提取', source.length, '个模块到', outDir);