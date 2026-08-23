ASSIGNMENT ONE- INDEPENDENT APP
Agricultural Decision Support System
LIVE WORKING PROTOTYPE (WEB APP):
https://script.google.com/macros/s/AKfycbyU1dFyzlFJIQGoGaIZdIZJbo89aR56Dpe5Nw3EyRfbQXYtwt2Ya3q_VRdHYplOSzk/exec

ASSIGNMENT TWO # SOLSTICE-EVENT
Project Summary: QR Code Scanner & Check-In System
LIVE WORKING PROTOTYPE (WEB APP): 
https://script.google.com/macros/s/AKfycbyrcgiKIuHnk3-uvQHH7Rg19f24xgmt7xcU6Qyp3Ysprb0UiZ4JSPMc34Z0N9FRsU_PhA/exec

1. Project Overview
This project is a fully functional, web-based event check-in and badge printing system built entirely on Google Apps Script (GAS). It allows event staff to manually enter or scan an attendee's QR code (ID), verify their registration against a Google Sheets database, prevent duplicate badge prints, and generate a formatted physical badge.
Upon printing, the system automatically updates the database to mark the attendee as "Checked-In" and redirects the staff member back to the scanner to process the next person.
2. Architecture & Tech Stack
Backend / Server: Google Apps Script (JavaScript)
Database: Google Sheets (Stores attendee data, check-in status, and timestamps)
Frontend / UI: HTML5, CSS3, Vanilla JavaScript
Hosting: Google Apps Script Web App (Deployed via doGet)
3. Key Features Implemented
Manual Entry Interface: Replaced camera scanning with a streamlined manual text input (optimized for external barcode scanners and low-light environments).
Duplicate Prevention: Checks the database before allowing a print. If a badge was already printed, it triggers a warning and blocks the action.
Automated Check-In: Clicking "Print & Check-In" updates the Google Sheet column to TRUE and logs the exact timestamp.
Visual Feedback: Displays a prominent, animated "✅ CHECKED-IN!" success message upon printing.
Iframe Navigation Fixes: Solved native Google Apps Script iframe routing issues using window.top.location.href and server-side URL fetching.
Parameter Passing Fixes: Solved blank page issues by passing the Attendee ID via server-side scriptlets (<?!= JSON.stringify(attendeeId) ?>) rather than relying on client-side URL parsing.
4. File Structure
Code.gs: Handles web app routing (doGet), database CRUD operations, and server-side helper functions.
Index.html: The homepage UI for manual ID entry and attendee verification.
Badge.html: The badge preview UI, handles the print trigger, database update, and check-in messaging.
Style.html: Shared CSS for a modern, responsive, and mobile-friendly UI.
Script.html: Shared JavaScript utilities.
5. Working Flowchart

[ START: Staff Opens Web App URL ]
               │
               ▼
┌──────────────────────────────┐
│   HOMEPAGE (Index.html)      │
│  - Auto-focuses ID input     │
│  - Staff enters/scans ID     │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│   VERIFY ID (Code.gs)        │
│  - Queries Google Sheet      │
└──────────────┬───────────────┘
               │
         ┌─────┴─────┐
         │           │
    [NOT FOUND]   [FOUND]
         │           │
         ▼           ▼
   Show "Invalid   ┌────────────────────────┐
   ID" Error       │ Check 'Badge Printed'  │
   & Reset         │ Column in Sheet        │
                   └──────────┬─────────────┘
                        ┌─────┴─────┐
                        │           │
                      [YES]       [NO]
                        │           │
                        ▼           ▼
                Show "Duplicate   ┌──────────────────────────┐
                Scan" Warning     │  BADGE PAGE (Badge.html) │
                & Reset           │  - Injects ID via GAS    │
                                  │  - Fetches & Renders UI  │
                                  └────────────┬─────────────┘
                                               │
                                               ▼
                                  ┌──────────────────────────┐
                                  │ Staff clicks             │
                                  │ "Print & Check-In"       │
                                  └────────────┬─────────────┘
                                               │
                                               ▼
                                  ┌──────────────────────────┐
                                  │ 1. Button disabled       │
                                  │ 2. Updates Sheet to TRUE │
                                  │ 3. Logs Timestamp        │
                                  │ 4. Shows "CHECKED-IN!"   │
                                  │ 5. Triggers Print Dialog │
                                  │ 6. Auto-redirects Home   │
                                  └────────────┬─────────────┘
                                               │
                                               └──────────> [ END / LOOP BACK TO START ]


6. Step-by-Step User Journey
Initialization: The staff member opens the deployed Web App URL on a tablet or laptop. The homepage loads, and the cursor automatically focuses on the ID input field.
Scanning/Entry: The staff member scans the attendee's physical ticket (using a USB barcode scanner) or manually types the ID and hits "Verify".
Verification: The system queries the Google Sheet.
If the ID is invalid, it shows a red error message and resets.
If the ID is valid but already checked in, it shows a yellow "Duplicate Scan" warning and resets.
If the ID is valid and new, it displays the attendee's details (Name, Company, Ticket Type) and reveals the "Proceed to Print Badge" button.
Badge Generation: The staff member clicks the button. The system securely navigates to the Badge page, passing the ID via server-side injection to prevent blank pages.
Check-In & Print: The staff member reviews the visual badge preview and clicks "Print & Check-In".
Database Update: The backend instantly updates the Google Sheet (Column F = TRUE, Column G = Timestamp).
Physical Output: The screen flashes a green "✅ CHECKED-IN!" message, and the browser's native print dialog opens. The staff member prints the badge and hands it to the attendee.
Reset: After 1.5 seconds, the system automatically redirects back to the homepage, ready for the next attendee.


Limitation: While highly effective for small to medium-sized events, this system is constrained by its reliance on Google Sheets and Google Apps Script, which introduces limitations in scalability, offline capability, and security. It requires a continuous internet connection to function, lacks built-in staff authentication, and may experience latency with massive attendee databases due to spreadsheet search limitations and server "cold starts." Furthermore, the system depends entirely on the browser's native print dialog, preventing direct, silent printing to specialized thermal label printers without manual user interaction.



