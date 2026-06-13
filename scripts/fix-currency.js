const fs = require('fs');
const path = require('path');

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
  
  // Remove the local formatCurrency function definition
  // function formatCurrency(amount: number): string { ... }
  // or const formatCurrency = ...
  
  const functionRegex = /function\s+formatCurrency\s*\([^)]*\)\s*:\s*string\s*{[^}]*}/g;
  content = content.replace(functionRegex, '');
  
  const constRegex = /const\s+formatCurrency\s*=\s*\([^)]*\)\s*=>\s*{[^}]*}/g;
  content = content.replace(constRegex, '');

  // Add the import at the top (after the first import)
  if (!content.includes("import { formatCurrency }")) {
    content = content.replace(/import ([^\n]+)\n/, "import $1\nimport { formatCurrency } from '@/utils/formatters'\n");
  }

  fs.writeFileSync(file, content, 'utf8');
  console.log(`Fixed formatCurrency in ${path.basename(file)}`);
});
