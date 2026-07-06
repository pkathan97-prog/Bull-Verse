const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

const startMarker = '        // ===== Add Funds Modal Logic =====';
const endMarkerStr = `                });
            }
        }
    }`;

// Find the exact block
const startIndex = appJs.indexOf(startMarker);
if (startIndex === -1) {
    console.log("Start marker not found");
    process.exit(1);
}

// Find the end of setupHomeView which contains the logic
// Since the block ends with closing braces for the addFundsBtn if statement, 
// and then the closing brace for setupHomeView().
// Let's just extract using substring.
const funcStr = '    function setupHomeView() {';
const nextFuncStr = '    // --- MARKETS VIEW ---'; // Or something after it
const setupMarketsIndex = appJs.indexOf('    function setupMarketsView() {');

if (setupMarketsIndex === -1) {
    console.log("setupMarketsView not found");
    process.exit(1);
}

// Extract setupHomeView body
let beforeSetup = appJs.substring(0, startIndex);

// Find the end of the Add Funds Logic block. It ends right before the closing brace of setupHomeView
// The closing brace of setupHomeView is the last brace before setupMarketsView
let substringToSearch = appJs.substring(startIndex, setupMarketsIndex);
// Let's find the closing brace of setupHomeView. 
// It looks like:
//                 });
//             }
//         }
//     }
//
//     function setupMarketsView() {

const endBlockStr = `                });
            }
        }`;

const endOfLogicIndex = appJs.indexOf(endBlockStr, startIndex) + endBlockStr.length;

let addFundsLogic = appJs.substring(startIndex, endOfLogicIndex);

// Remove the Add Funds logic from setupHomeView
let afterLogic = appJs.substring(endOfLogicIndex);

// We need to inject the Add Funds logic outside of setupHomeView, globally inside DOMContentLoaded.
// The best place is right before setupHomeView is defined.
const viewSetupsMarker = '    // 4. VIEW SETUPS & TEMPLATES';
const injectionIndex = appJs.indexOf(viewSetupsMarker);

if (injectionIndex === -1) {
    console.log("injectionIndex not found");
    process.exit(1);
}

let part1 = appJs.substring(0, injectionIndex);
let part2 = appJs.substring(injectionIndex, startIndex);
let part3 = appJs.substring(endOfLogicIndex);

// new app.js: part1 + addFundsLogic + \n\n + part2 + part3
let newAppJs = part1 + addFundsLogic + "\n\n" + part2 + part3;

fs.writeFileSync('js/app.js', newAppJs);
console.log("Successfully extracted Add Funds logic and made it global.");
