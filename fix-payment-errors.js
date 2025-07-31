const fs = require('fs');
const path = require('path');

const filePath = 'src/components/payment/company-database/new-edit.tsx';

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix error props that don't use !!
  content = content.replace(
    /error=\{\s*errors\.[^}]*\?\.[^}]*\}/g,
    (match) => {
      if (!match.includes('!!')) {
        return match.replace('error={', 'error={!!');
      }
      return match;
    }
  );
  
  // Fix helperText props that don't use 'as string'
  content = content.replace(
    /helperText=\{\s*errors\.[^}]*\?\.[^}]*\}/g,
    (match) => {
      if (!match.includes('as string')) {
        return match.replace(/\?\.[^}]*/, '?.message as string');
      }
      return match;
    }
  );
  
  fs.writeFileSync(filePath, content);
  console.log('Fixed all error and helperText TypeScript issues in payment company-database file');
} else {
  console.log('File not found:', filePath);
}