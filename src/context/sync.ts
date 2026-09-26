/**
 * Backend Sync Service para Google Sheets (Vía Apps Script)
 */

const getApiUrl = () => {
  // Use import.meta.env for Vite
  return import.meta.env.VITE_APPSCRIPT_URL || "";
};

export const fetchFromDb = async () => {
  const url = getApiUrl();
  if (!url) return null;
  
  try {
    const res = await fetch(`${url}?action=getAll`);
    const json = await res.json();
    if (json.success) {
      // Traverse data and convert stringified numbers to real numbers
      const traverseAndParse = (obj: any): any => {
        if (Array.isArray(obj)) return obj.map(traverseAndParse);
        if (obj !== null && typeof obj === 'object') {
          for (const key in obj) {
            obj[key] = traverseAndParse(obj[key]);
          }
          return obj;
        }
        if (typeof obj === 'string') {
          // Check if string is a valid number, but skip purely numeric identifiers if you want 
          // (Actually, price/deposit are clearly numbers. Let's cast strict numeric formats).
          const num = Number(obj);
          if (!isNaN(num) && obj.trim() !== '') {
            // Be careful not to convert phone numbers like "+1555" to numbers. 
            // Only purely numerical values that aren't zero-padded strings or phones.
            if (!obj.startsWith('0') && !obj.startsWith('+') && !obj.includes('-') && !obj.includes(' ') && !isNaN(parseFloat(obj))) {
              return num;
            }
          }
        }
        return obj;
      };
      
      return traverseAndParse(json.data);
    }
  } catch (error) {
    console.error("Error fetching from DB:", error);
  }
  return null;
};

export const syncToDb = async (action: string, data: any) => {
  const url = getApiUrl();
  if (!url) return;
  
  try {
    fetch(url, {
      method: "POST",
      body: JSON.stringify({ action, data }),
      headers: {
        "Content-Type": "text/plain;charset=utf-8", 
      },
    }).catch((e) => console.error("Background sync error:", e));
  } catch (error) {
    console.error("Sync error:", error);
  }
};
