const fs = require('fs');
const content = fs.readFileSync('src/lib/content-calendar.ts', 'utf8');
console.log(content.split('\n').slice(300, 315).join('\n'));
