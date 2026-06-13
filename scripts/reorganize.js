const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '../frontend/src');

// Define the mapping rules
// key: old path prefix relative to src
// value: new path prefix relative to src
const mappings = [
  { old: 'pages/DashboardPage', new: 'modules/dashboard/pages/DashboardPage' },
  { old: 'components/dashboard', new: 'modules/dashboard/components' },
  
  { old: 'pages/SalesOrdersPage', new: 'modules/sales/pages/SalesOrdersPage' },
  { old: 'pages/SalesOrderDetailPage', new: 'modules/sales/pages/SalesOrderDetailPage' },
  { old: 'components/sales', new: 'modules/sales/components' },
  
  { old: 'pages/PurchasePage', new: 'modules/purchase/pages/PurchasePage' },
  { old: 'pages/PurchaseOrderDetailPage', new: 'modules/purchase/pages/PurchaseOrderDetailPage' },
  { old: 'components/purchase', new: 'modules/purchase/components' },
  
  { old: 'pages/ManufacturingPage', new: 'modules/manufacturing/pages/ManufacturingPage' },
  { old: 'pages/BomPage', new: 'modules/manufacturing/pages/BomPage' },
  { old: 'components/manufacturing', new: 'modules/manufacturing/components' },
  { old: 'components/bom', new: 'modules/manufacturing/components/bom' },
  
  { old: 'pages/InventoryPage', new: 'modules/inventory/pages/InventoryPage' },
  { old: 'pages/StockLedgerPage', new: 'modules/inventory/pages/StockLedgerPage' },
  { old: 'components/inventory', new: 'modules/inventory/components' },
  
  { old: 'pages/ProductsPage', new: 'modules/products/pages/ProductsPage' },
  { old: 'components/products', new: 'modules/products/components' },
  
  { old: 'pages/AuditLogsPage', new: 'modules/audit/pages/AuditLogsPage' },
  { old: 'components/audit', new: 'modules/audit/components' },

  { old: 'pages/LoginPage', new: 'modules/auth/pages/LoginPage' },
];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, fileList);
    } else {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

function moveFiles() {
  const allFiles = getAllFiles(srcDir);
  const moves = [];

  for (const file of allFiles) {
    const relPath = path.relative(srcDir, file).replace(/\\/g, '/');
    
    // Find matching rule
    for (const rule of mappings) {
      if (relPath.startsWith(rule.old)) {
        const newRelPath = relPath.replace(rule.old, rule.new);
        const targetPath = path.join(srcDir, newRelPath);
        moves.push({ src: file, dest: targetPath, oldRel: relPath, newRel: newRelPath });
        break; // Only apply first matching rule
      }
    }
  }

  // Execute moves
  for (const move of moves) {
    ensureDir(path.dirname(move.dest));
    fs.renameSync(move.src, move.dest);
    console.log(`Moved: ${move.oldRel} -> ${move.newRel}`);
  }

  return moves;
}

function updateImports(moves) {
  const allFiles = getAllFiles(srcDir).filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
  let changed = 0;

  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;

    for (const move of moves) {
      // Create import patterns
      // e.g. @/pages/DashboardPage -> @/modules/dashboard/pages/DashboardPage
      // Need to handle extensions and lack of extensions
      const oldImportBase = `@/${move.oldRel}`.replace(/\.tsx?$/, '');
      const newImportBase = `@/${move.newRel}`.replace(/\.tsx?$/, '');

      // Replace old import path with new one
      const regex = new RegExp(`(['"])${oldImportBase}(['"])`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `$1${newImportBase}$2`);
        modified = true;
      }
      
      // Also handle index files in directories
      if (move.oldRel.endsWith('index.ts') || move.oldRel.endsWith('index.tsx')) {
         const oldDir = `@/${path.dirname(move.oldRel).replace(/\\/g, '/')}`;
         const newDir = `@/${path.dirname(move.newRel).replace(/\\/g, '/')}`;
         const dirRegex = new RegExp(`(['"])${oldDir}(['"])`, 'g');
         if (dirRegex.test(content)) {
           content = content.replace(dirRegex, `$1${newDir}$2`);
           modified = true;
         }
      }
    }

    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      changed++;
    }
  }
  
  // Custom directory replacements for non-file specific imports (like importing a whole directory)
  for (const file of allFiles) {
    let content = fs.readFileSync(file, 'utf8');
    let modified = false;
    
    for(const rule of mappings) {
      const regex = new RegExp(`(['"])@/${rule.old}(/|['"])`, 'g');
      if(regex.test(content)) {
         content = content.replace(regex, `$1@/${rule.new}$2`);
         modified = true;
      }
    }
    
    if (modified) {
      fs.writeFileSync(file, content, 'utf8');
      changed++;
    }
  }

  console.log(`Updated imports in ${changed} files.`);
}

const executedMoves = moveFiles();
updateImports(executedMoves);
