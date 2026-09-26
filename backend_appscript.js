# Guía de Integración con Google Sheets y Apps Script

Este archivo contiene el código necesario para convertir tu Google Sheet en una base de datos mediante Google Apps Script.

## Instrucciones

1. Ve a tu archivo de Google Sheets.
2. En el menú superior, haz clic en **Extensiones > Apps Script**.
3. Reemplaza cualquier código que haya en el editor con el siguiente bloque de código.
4. Guarda el proyecto (icono del disquete).
5. Haz clic en el menú superior y selecciona la función `initDB`, luego haz clic en **Ejecutar** (esto creará las hojas necesarias en tu archivo).
6. Haz clic en **Implementar > Nueva implementación**.
7. Selecciona el tipo **Aplicación web**.
8. Ejecutar como: **Yo**
9. Quién tiene acceso: **Cualquier persona**
10. Copia la URL de la aplicación web que te dará al final.
11. Pega esa URL en tu archivo `.env.local` en la variable `VITE_APPSCRIPT_URL`.

---

```javascript
/**
 * Backend para L'Atelier Vernis
 * Permite usar Google Sheets como Base de Datos REST.
 */

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const action = payload.action;
    const data = payload.data;
    
    let result = null;
    
    if (action === 'syncAppointments') {
      result = syncTable('Appointments', data);
    } else if (action === 'syncClients') {
      result = syncTable('Clients', data);
    } else if (action === 'syncWaitlist') {
      result = syncTable('Waitlist', data);
    } else if (action === 'syncReviews') {
      result = syncTable('Reviews', data);
    } else if (action === 'syncServices') {
      result = syncTable('Services', data);
    } else if (action === 'fullSync') {
      // Syncs all tables from frontend to DB
      if (data.appointments) syncTable('Appointments', data.appointments);
      if (data.clients) syncTable('Clients', data.clients);
      if (data.waitlist) syncTable('Waitlist', data.waitlist);
      if (data.reviews) syncTable('Reviews', data.reviews);
      if (data.services) syncTable('Services', data.services);
      result = 'Sincronización completa exitosa';
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, result: result }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const action = e.parameter.action || 'getAll';
    
    if (action === 'getAll') {
      const db = {
        appointments: getRows('Appointments'),
        waitlist: getRows('Waitlist'),
        clients: getRows('Clients'),
        reviews: getRows('Reviews'),
        services: getRows('Services')
      };
      
      return ContentService.createTextOutput(JSON.stringify({ success: true, data: db }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: false, message: 'Invalid action' }))
        .setMimeType(ContentService.MimeType.JSON);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getRows(sheetName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  const data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];
  
  const headers = data[0];
  const rows = [];
  
  for (let i = 1; i < data.length; i++) {
    let row = data[i];
    let obj = {};
    for (let j = 0; j < headers.length; j++) {
      let value = row[j];
      // Try parsing JSON values
      try {
        if (typeof value === 'string' && (value.startsWith('{') || value.startsWith('['))) {
          value = JSON.parse(value);
        }
      } catch (e) {}
      obj[headers[j]] = value;
    }
    rows.push(obj);
  }
  return rows;
}

function syncTable(sheetName, items) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  sheet.clear();
  if (!items || items.length === 0) return 'Vaciada';
  
  const headers = Object.keys(items[0]);
  sheet.appendRow(headers);
  
  const rows = items.map(item => {
    return headers.map(header => {
      let val = item[header];
      if (typeof val === 'object') {
        return JSON.stringify(val);
      }
      return val;
    });
  });
  
  if (rows.length > 0) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
  
  return 'Sincronizados ' + items.length + ' registros en ' + sheetName;
}

// Función que debe ejecutarse manualmente la primera vez para preparar las tablas
function initDB() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ['Appointments', 'Waitlist', 'Clients', 'Reviews', 'Services'];
  sheets.forEach(name => {
    if (!ss.getSheetByName(name)) {
      ss.insertSheet(name);
    }
  });
}
```
