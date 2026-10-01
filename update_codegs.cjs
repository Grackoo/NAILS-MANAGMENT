const fs = require('fs');
let code = fs.readFileSync('C:\\Users\\GRACKO\\.gemini\\antigravity\\brain\\d0910338-e2fb-4c5c-90de-0500bfd51556\\CodeGS.md', 'utf8');

const regex = /\} else if \(action === 'syncServices'\) \{\s*result = syncTable\('Services', data\);/m;
const newStr = `} else if (action === 'syncServices') {
      result = syncTable('Services', data);
    } else if (action === 'syncStudioConfig') {
      result = syncTable('StudioConfig', data);
    } else if (action === 'syncLoyaltyProfile') {
      result = syncTable('LoyaltyProfile', data);`;

code = code.replace(regex, newStr);

const getAllRegex = /services: getRows\('Services'\)\s*\};\s*/m;
const newGetAllStr = `services: getRows('Services'),
        studioConfig: getRows('StudioConfig')[0] || null,
        loyaltyProfile: getRows('LoyaltyProfile')[0] || null
      };
      `;

code = code.replace(getAllRegex, newGetAllStr);
fs.writeFileSync('C:\\Users\\GRACKO\\.gemini\\antigravity\\brain\\d0910338-e2fb-4c5c-90de-0500bfd51556\\CodeGS.md', code, 'utf8');
