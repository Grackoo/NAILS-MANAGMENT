const fs = require('fs');
let code = fs.readFileSync('src/components/client/ClientLoyaltyProgram.tsx', 'utf8');

code = code.replace(/\{loyaltyProfile\.totalPointsEarned\} pts/g, "{(currentClient?.pointsBalance || 0)} pts");

fs.writeFileSync('src/components/client/ClientLoyaltyProgram.tsx', code, 'utf8');
