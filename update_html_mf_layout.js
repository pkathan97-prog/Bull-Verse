const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const mfListStartStr = '<!-- MF List -->';
const mfListEndStr = '</div>\n\n                    <!-- Calculator Widgets Container -->';
const calcStartStr = '<!-- Calculator Widgets Container -->';
const calcEndStr = '</div>\n                </section>';

let mfStartIdx = html.indexOf(mfListStartStr);
let calcStartIdx = html.indexOf(calcStartStr);
let calcEndIdx = html.indexOf(calcEndStr);

if (mfStartIdx !== -1 && calcStartIdx !== -1 && calcEndIdx !== -1) {
    // Extract the MF List div
    const mfListHtml = html.substring(mfStartIdx, calcStartIdx);
    
    // Extract the Calculators div
    const calcHtml = html.substring(calcStartIdx, calcEndIdx + 6); // +6 for </div>
    
    // Create the new layout
    const newLayout = calcHtml + '\n\n                    ' + mfListHtml;
    
    // Replace the entire old section with the new one
    const oldLayout = mfListHtml + calcHtml;
    
    if (html.includes(oldLayout)) {
        html = html.replace(oldLayout, newLayout);
        fs.writeFileSync('index.html', html);
        console.log("Reordered Mutual Funds page layout.");
    } else {
        console.log("Could not find the exact old layout to replace.");
    }
} else {
    console.log("Could not find layout markers.");
}
