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
      return json.data;
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
