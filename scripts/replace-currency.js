const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../frontend/src');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
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

function replaceCurrency() {
  const files = getAllFiles(srcDir);
  let changed = 0;

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    // Replace literal $ when it is followed by a number or space and number
    // But NOT when it's part of a template string variable ${
    // Also handle cases like `$ {` or `$` inside spans
    
    // Replace $ followed by number e.g., $100 -> ₹100
    const regexNum = /\$(\d+)/g;
    if (regexNum.test(content)) {
      content = content.replace(regexNum, '₹$1');
      modified = true;
    }

    // Replace $ followed by space and number e.g., $ 100 -> ₹ 100
    const regexSpaceNum = /\$ (\d+)/g;
    if (regexSpaceNum.test(content)) {
      content = content.replace(regexSpaceNum, '₹ $1');
      modified = true;
    }

    // Replace standalone $ in text strings in JSX e.g., >$< -> >₹<
    const regexJSX = />(\s*)\$(\s*)</g;
    if (regexJSX.test(content)) {
      content = content.replace(regexJSX, '>$1₹$2<');
      modified = true;
    }

    // Replace $ followed by template string var like $ {value} -> ₹ {value}
    // Wait, regex might be tricky. Let's do a simple replace of literal '$' where appropriate.
    // e.g., `\$${` inside template strings is used for $100 -> ₹100
    const regexTemplate = /\$\$\{/g;
    if (regexTemplate.test(content)) {
      content = content.replace(regexTemplate, '₹${');
      modified = true;
    }
    
    const regexTemplate2 = />\$\$\{/g;
    if (regexTemplate2.test(content)) {
      content = content.replace(regexTemplate2, '>₹${');
      modified = true;
    }

    // specific exact match for 'Currency: $' or similar
    const regexLabel = /(Currency|Price|Cost|Amount|Value)(:?\s*)\$/gi;
    if (regexLabel.test(content)) {
      content = content.replace(regexLabel, '$1$2₹');
      modified = true;
    }
    
    // Replace `'$'` with `'₹'`
    const regexQuote = /'\$'/g;
    if (regexQuote.test(content)) {
      content = content.replace(regexQuote, "'₹'");
      modified = true;
    }
    
    // Replace `"$" ` with `"₹" `
    const regexDoubleQuote = /"\$"/g;
    if (regexDoubleQuote.test(content)) {
      content = content.replace(regexDoubleQuote, '"₹"');
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      changed++;
    }
  });

  console.log(`Updated currency symbols in ${changed} files.`);
}

replaceCurrency();
