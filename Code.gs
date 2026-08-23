
/**
 * Helper function to get the Web App URL for client-side navigation
 */
function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}

/**
 * ============================================================
 *  QR BADGE SCANNER — Google Apps Script Backend
 *  Updated for explicit "Checked-In" Database Update
 * ============================================================
 */

// ⚙️ CONFIGURATION — Replace with your actual Google Sheet ID
const SHEET_ID = '1Ta1piosmre0A8_2z4NVVQN75tBOOhD_YsnHebLD6MI4'; 
const SHEET_NAME = 'Attendees'; 

// ─── Web App Entry Points ───────────────────────────────────

/*function doGet(e) {
  const page = e.parameter.page || 'index';
  
  if (page === 'badge') {
    return HtmlService.createTemplateFromFile('Badge')
      .evaluate()
      .setTitle('Print Badge')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('QR Badge Scanner')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}
*/

function doGet(e) {
  const page = e.parameter.page || 'index';
  const idParam = e.parameter.id || ''; // 1. Capture the ID from the URL
  
  if (page === 'badge') {
    // 2. Use createTemplateFromFile instead of createHtmlOutputFromFile
    const template = HtmlService.createTemplateFromFile('Badge');
    
    // 3. Inject the ID into the template so the HTML can read it
    template.attendeeId = idParam; 
    
    return template.evaluate()
      .setTitle('Print Badge')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  
  return HtmlService.createTemplateFromFile('Index')
    .evaluate()
    .setTitle('QR Badge Scanner')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// ─── CRUD OPERATIONS ────────────────────────────────────────

/**
 * READ — Find attendee by QR code ID
 */
function findAttendee(qrCode) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length < 2) {
      return { success: false, message: 'Database is empty.' };
    }
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(qrCode).trim()) {
        return {
          success: true,
          data: {
            id: data[i][0],
            name: data[i][1],
            email: data[i][2],
            company: data[i][3],
            ticketType: data[i][4],
            // Check if column F is TRUE
            badgePrinted: data[i][5] === true || String(data[i][5]).toUpperCase() === 'TRUE' 
          },
          rowIndex: i + 1 
        };
      }
    }
    
    return { success: false, message: 'Attendee not found. Invalid QR code.' };
    
  } catch (error) {
    return { success: false, message: 'Server error: ' + error.message };
  }
}

/**
 * UPDATE — Mark badge as printed (Checked-In)
 * Explicitly updates Column F to TRUE
 */
function markBadgePrinted(rowIndex) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    
    // 1. Update "Badge Printed" column (Column F) to boolean TRUE
    sheet.getRange(rowIndex, 6).setValue(true); 
    
    // 2. Update "Print Timestamp" column (Column G) with current date/time
    sheet.getRange(rowIndex, 7).setValue(new Date()); 
    
    // Flush to ensure changes are written immediately
    SpreadsheetApp.flush(); 
    
    return { success: true, message: 'Checked-in successfully.' };
  } catch (error) {
    return { success: false, message: 'Update failed: ' + error.message };
  }
}

/**
 * CREATE — Add new attendee (Optional)
 */
function addAttendee(attendee) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    sheet.appendRow([
      attendee.id, attendee.name, attendee.email, 
      attendee.company, attendee.ticketType, false, null
    ]);
    return { success: true, message: 'Attendee added.' };
  } catch (error) {
    return { success: false, message: 'Add failed: ' + error.message };
  }
}

/**
 * DELETE — Remove attendee by ID (Optional)
 */
function deleteAttendee(attendeeId) {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    for (let i = 1; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(attendeeId).trim()) {
        sheet.deleteRow(i + 1);
        return { success: true, message: 'Attendee deleted.' };
      }
    }
    return { success: false, message: 'Attendee not found.' };
  } catch (error) {
    return { success: false, message: 'Delete failed: ' + error.message };
  }
}
