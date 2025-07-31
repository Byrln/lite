const fs = require('fs');
const path = require('path');

// Fix multiline helperText patterns in reservation component
const filePath = path.join(__dirname, 'src/components/reservation/new-edit.tsx');

let content = fs.readFileSync(filePath, 'utf8');

// Pattern to match multiline helperText without 'as string'
const multilineHelperTextPattern = /helperText=\{\s*\n\s*errors\s*\n\s*\.([\w]+)\s*\n\s*\?\.message\s*\n\s*\}/g;

// Replace with proper string casting
content = content.replace(multilineHelperTextPattern, (match, fieldName) => {
  return `helperText={
                              errors
                                .${fieldName}
                                ?.message as string
                            }`;
});

// Also handle the specific patterns found
const patterns = [
  {
    old: /helperText=\{\s*\n\s*errors\.ArrivalDate\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.ArrivalDate?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.DepartureDate\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.DepartureDate?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.Nights\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.Nights?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.Surname\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.Surname?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.Email\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.Email?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.Mobile\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.Mobile?.message as string}'
  },
  {
    old: /helperText=\{\s*\n\s*errors\.PayAmount\s*\n\s*\?\.message\s*\}/g,
    new: 'helperText={errors.PayAmount?.message as string}'
  }
];

patterns.forEach(pattern => {
  content = content.replace(pattern.old, pattern.new);
});

fs.writeFileSync(filePath, content);
console.log('Fixed multiline helperText patterns in reservation component');