const fs = require('fs');

let text = fs.readFileSync('database/seed.sql', 'utf8');

const replacements = [
  [/Ã©/g, 'é'],
  [/Ã§/g, 'ç'],
  [/Ã£/g, 'ã'],
  [/Ã¡/g, 'á'],
  [/Ã³/g, 'ó'],
  [/Ãº/g, 'ú'],
  [/Ã\xad/g, 'í'],
  [/Ã­/g, 'í'],
  [/â€”/g, '—'],
  [/â€“/g, '–'],
  [/Ãª/g, 'ê'],
  [/Ã¢/g, 'â'],
  [/Ã‚/g, 'Â'],
  [/Ã”/g, 'Ô'],
  [/Ãµ/g, 'õ'],
  [/Ã‡/g, 'Ç'],
  [/Ã‰/g, 'É'],
  [/Ã /g, 'À'],
  [/Ã /g, 'Á'],
  [/Ã”/g, 'Ô'],
  [/Ã /g, 'Ã'],
  [/Ã•/g, 'Õ']
];

for (const [regex, replacement] of replacements) {
  text = text.replace(regex, replacement);
}

fs.writeFileSync('database/seed.sql', text, 'utf8');
console.log('Fixed encoding issues in seed.sql');
