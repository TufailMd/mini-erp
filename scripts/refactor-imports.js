const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../frontend/src');

function getAllFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function refactorImports() {
  const files = getAllFiles(srcDir);
  let changedFiles = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    const fileDir = path.dirname(file);
    
    // Regex to match imports: import ... from '...'
    const importRegex = /from\s+['"]([^'"]+)['"]/g;
    let modified = false;

    const newContent = content.replace(importRegex, (match, importPath) => {
      // We only care about relative imports that step out or stay within src
      if (importPath.startsWith('.')) {
        const resolvedPath = path.resolve(fileDir, importPath);
        
        // Ensure the resolved path is within the src directory
        if (resolvedPath.startsWith(srcDir)) {
          // Calculate the relative path from the src directory
          let relativeToSrc = path.relative(srcDir, resolvedPath);
          
          // Convert Windows backslashes to forward slashes
          relativeToSrc = relativeToSrc.replace(/\\/g, '/');
          
          // Rewrite the import using the alias
          modified = true;
          return `from '@/${relativeToSrc}'`;
        }
      }
      return match;
    });

    if (modified) {
      fs.writeFileSync(file, newContent, 'utf8');
      changedFiles++;
    }
  });

  console.log(`Successfully rewrote imports in ${changedFiles} files to use @/ alias.`);
}

refactorImports();
