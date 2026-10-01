const fs = require('fs');
let code = fs.readFileSync('src/context/StudioContext.tsx', 'utf8');

const regex = /setClients\(\(prev\) =>\s*prev\.map\(\(c\) =>\s*c\.id === 'cl-1' \|\| c\.name\.toLowerCase\(\)\.includes\('elena'\)\s*\?\s*\{\s*\.\.\.c,\s*pointsBalance: Math\.max\(0, \(c\.pointsBalance \|\| 0\) \+ points\),\s*\}\s*:\s*c\s*\)\s*\);/m;

const newStr = `    if (currentClient) {
      const updatedClient = {
        ...currentClient,
        pointsBalance: Math.max(0, (currentClient.pointsBalance || 0) + points),
      };
      setCurrentClient(updatedClient);
      setClients((prev) => prev.map((cl) => (cl.id === currentClient.id ? updatedClient : cl)));
    }`;

code = code.replace(regex, newStr);
fs.writeFileSync('src/context/StudioContext.tsx', code, 'utf8');
