const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all TypeScript/TSX files
const files = glob.sync('src/**/*.{ts,tsx}', { cwd: process.cwd() });

files.forEach(file => {
  const filePath = path.join(process.cwd(), file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace all helperText={errors.*.message} with helperText={errors.*.message as string}
  const regex = /helperText={errors\.[^}]+\.message}/g;
  const updatedContent = content.replace(regex, (match) => {
    return match.replace('}', ' as string}');
  });
  
  if (content !== updatedContent) {
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Fixed: ${file}`);
  }
});

console.log('All helperText TypeScript errors have been fixed!');