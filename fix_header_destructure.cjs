const fs = require('fs');
let code = fs.readFileSync('src/components/Header.tsx', 'utf8');

const regex = /setIsAuthenticated,\s*setCurrentClient,/m;
const newStr = `setIsAuthenticated,
    currentClient,
    setCurrentClient,`;

code = code.replace(regex, newStr);
fs.writeFileSync('src/components/Header.tsx', code, 'utf8');
