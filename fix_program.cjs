const fs = require('fs');
let code = fs.readFileSync('src/components/client/ClientLoyaltyProgram.tsx', 'utf8');

code = code.replace(/const currentTierPoints = currentClient\?\.pointsBalance \|\| currentTierPoints;/g, 
  "const currentTierPoints = currentClient?.pointsBalance || 0;");

fs.writeFileSync('src/components/client/ClientLoyaltyProgram.tsx', code, 'utf8');
