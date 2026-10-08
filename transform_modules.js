const fs = require('fs');
const path = require('path');

const inDir = path.join(__dirname, 'extracted_modules');
const outDir = path.join(__dirname, 'src');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const mapping = {
  '0': 'system.js',
  '1': 'player.js',
  '3': 'sprites.js',
  '5': 'gameObject.js',
  '6': 'spawn.js',
  '7': 'interface.js',
  '11': 'collisions.js',
  '12': 'islandSpawn.js',
  '13': 'record.js',
  '21': 'entry.js',
  '22': 'gameSetup.js',
  '23': 'surfer.js',
  '24': 'enemy.js',
  '25': 'objects.js',
  '26': 'cleanup.js',
  '27': 'background.js',
  '28': 'input.js'
};

function transformRequire(content) {
  return content.replace(/require\((\d+)\)/g, function(m, id) {
    if (mapping[id]) return "require('./" + mapping[id].replace(/\\.js$/, '') + "')";
    return m;
  });
}

fs.readdirSync(inDir).forEach(file => {
  const full = path.join(inDir, file);
  const id = file.match(/module_(\d+)\.js/)[1];
  const outName = mapping[id] || ('module_' + id + '.js');
  const content = fs.readFileSync(full, 'utf8');
  const transformed = transformRequire(content);
  fs.writeFileSync(path.join(outDir, outName), transformed, 'utf8');
  console.log('wrote', outName);
});

console.log('done');
