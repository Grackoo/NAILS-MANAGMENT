const fs = require('fs');
let code = fs.readFileSync('src/context/StudioContext.tsx', 'utf8');

const replacement = `    localStorage.setItem('latelier_config', JSON.stringify(studioConfig));
    syncToDb('syncStudioConfig', studioConfig);`;
code = code.replace(/localStorage\.setItem\('latelier_config', JSON\.stringify\(studioConfig\)\);/, replacement);

const replacementLoyalty = `    localStorage.setItem('latelier_loyalty_profile', JSON.stringify(loyaltyProfile));
    syncToDb('syncLoyaltyProfile', loyaltyProfile);`;
code = code.replace(/localStorage\.setItem\('latelier_loyalty_profile', JSON\.stringify\(loyaltyProfile\)\);/, replacementLoyalty);

fs.writeFileSync('src/context/StudioContext.tsx', code, 'utf8');
