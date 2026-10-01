const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const regex = /<span>\{loyaltyProfile\.pointsBalance\.toLocaleString\(\)\} pts<\/span>/g;
const newStr = `<span>{(currentClient?.pointsBalance || 0).toLocaleString()} pts</span>`;

code = code.replace(regex, newStr);
fs.writeFileSync('src/components/Header.tsx', code, 'utf8');
