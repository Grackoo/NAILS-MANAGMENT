const fs = require('fs');
let code = fs.readFileSync('src/context/StudioContext.tsx', 'utf8');

const regex = /if \(data\.services\?\.length > 0\) setServices\(data\.services\);/m;
const newStr = `if (data.services?.length > 0) setServices(data.services);
          if (data.studioConfig) setStudioConfig(data.studioConfig);
          if (data.loyaltyProfile) setLoyaltyProfile(data.loyaltyProfile);`;

code = code.replace(regex, newStr);
fs.writeFileSync('src/context/StudioContext.tsx', code, 'utf8');
