const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Match all imports from '@/data/...'
    const regex = /import\s+({[^}]+}|\w+)\s+from\s+['"]@\/data\/.*['"];?/g;
    
    content = content.replace(regex, (match, importsStr) => {
      // Create empty variables for everything imported
      // e.g. { foo, bar } -> const foo = [] as any; const bar = [] as any;
      let vars = importsStr.replace(/[{}]/g, '').split(',').map(s => s.trim()).filter(s => s);
      return vars.map(v => `const ${v}: any = [];`).join('\n');
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed data imports in:', filePath);
    }
  }
});
