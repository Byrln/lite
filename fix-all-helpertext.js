const fs = require('fs');
const glob = require('glob');

// Find all .tsx and .ts files in src directory
const files = glob.sync('src/**/*.{ts,tsx}');

let totalFixed = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
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
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log('Fixed helperText in:', file);
      totalFixed++;
    }
  }
});

console.log(`\nFixed helperText TypeScript errors in ${totalFixed} files!`);