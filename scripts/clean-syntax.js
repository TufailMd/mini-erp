const fs = require('fs');

const filesToFix = [
  'c:\\Users\\anura\\Downloads\\final work\\frontend\\src\\modules\\products\\components\\ProductTable.tsx',
  'c:\\Users\\anura\\Downloads\\final work\\frontend\\src\\modules\\sales\\components\\LineItemsTable.tsx',
  'c:\\Users\\anura\\Downloads\\final work\\frontend\\src\\modules\\sales\\components\\OrderSummary.tsx',
  'c:\\Users\\anura\\Downloads\\final work\\frontend\\src\\modules\\sales\\components\\OrderTable.tsx',
  'c:\\Users\\anura\\Downloads\\final work\\frontend\\src\\modules\\sales\\components\\SalesLineItems.tsx'
];

filesToFix.forEach(file => {
  if (!fs.existsSync(file)) return;
  
  let content = fs.readFileSync(file, 'utf8');
  
  // The leftover string is exactly `\n)}\`\n}` or `)}\`\n}`
  content = content.replace(/\n\s*\)\}\`\n\}/g, '');
  
  fs.writeFileSync(file, content, 'utf8');
});
