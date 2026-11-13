/**
 * Google Apps Script for the leads sheet. api/lead.ts posts every lead here.
 *
 * Setup (once):
 * 1. Open the leads spreadsheet → Extensions → Apps Script.
 * 2. Replace everything in Code.gs with this file and save.
 * 3. Deploy → New deployment → type "Web app".
 *    Execute as: Me. Who has access: Anyone.  ← "Anyone" is what broke the old Contact sheet
 * 4. Copy the Web app URL into Vercel as LEAD_SHEET_URL, then redeploy the site.
 *
 * Updating the code later: Deploy → Manage deployments → edit (pencil) → Version: New version.
 * That keeps the same URL. "New deployment" makes a new URL you'd have to copy again.
 *
 * Columns are matched by header name, so any new field api/lead.ts sends gets its own
 * column automatically, and you can reorder columns in the sheet freely.
 */

var SHEET_NAME = 'Leads';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);

    var lastCol = sheet.getLastColumn();
    var headers = lastCol ? sheet.getRange(1, 1, 1, lastCol).getValues()[0] : [];
    Object.keys(data).forEach(function (key) {
      if (headers.indexOf(key) === -1) headers.push(key);
    });
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]).setFontWeight('bold');
    sheet.setFrozenRows(1);

    var row = headers.map(function (h) {
      var v = data[h];
      // Stop a lead typing "=FORMULA" from running it in the sheet
      if (typeof v === 'string' && /^[=+\-@]/.test(v)) v = "'" + v;
      return v === undefined || v === null ? '' : v;
    });
    sheet.appendRow(row);

    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
