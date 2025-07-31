const fs = require('fs');
const glob = require('glob');

// Find all .tsx and .ts files in src directory
const files = glob.sync('src/**/*.{ts,tsx}');

let totalFixed = 0;

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;
    
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
    
    if (content !== originalContent) {
      fs.writeFileSync(file, content);
      console.log('Fixed error props in:', file);
      totalFixed++;
    }
  }
});

console.log(`\nFixed error prop TypeScript errors in ${totalFixed} files!`);