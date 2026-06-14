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

    content = content.replace(/import\s*\{\s*erpNavItems\s*(,\s*erpFooterNavItems)?\s*\}\s*from\s*['"]@\/data\/salesData['"]/g, 
      "import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'");

    content = content.replace(/import\s*\{\s*erpNavItems\s*,\s*erpFooterNavItems\s*\}\s*from\s*['"]@\/data\/salesData['"]/g, 
      "import { erpNavItems, erpFooterNavItems } from '@/constants/navigation'");

    content = content.replace(/import\s*\{\s*statusOptions\s*,\s*dateRangeOptions\s*\}\s*from\s*['"]@\/data\/salesData['"]/g, 
      "import { statusOptions, dateRangeOptions } from '@/constants/options'");

    if (content !== original) {
      fs.writeFileSync(filePath, content);
      console.log('Fixed:', filePath);
    }
  }
});
