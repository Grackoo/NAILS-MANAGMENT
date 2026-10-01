const fs = require('fs');
let code = fs.readFileSync('src/context/StudioContext.tsx', 'utf8');

const replacement1 = `    localStorage.setItem('latelier_config', JSON.stringify(studioConfig));
    syncToDb('syncStudioConfig', [studioConfig]);`;
code = code.replace(/localStorage\.setItem\('latelier_config', JSON\.stringify\(studioConfig\)\);\s*syncToDb\('syncStudioConfig', studioConfig\);/, replacement1);

const replacement2 = `    localStorage.setItem('latelier_loyalty_profile', JSON.stringify(loyaltyProfile));
    syncToDb('syncLoyaltyProfile', [loyaltyProfile]);`;
code = code.replace(/localStorage\.setItem\('latelier_loyalty_profile', JSON\.stringify\(loyaltyProfile\)\);\s*syncToDb\('syncLoyaltyProfile', loyaltyProfile\);/, replacement2);

fs.writeFileSync('src/context/StudioContext.tsx', code, 'utf8');
