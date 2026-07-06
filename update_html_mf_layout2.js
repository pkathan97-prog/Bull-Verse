const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const mfListStartStr = '                    <!-- MF List -->';
const mfListEndStr = '                    <!-- Calculator Widgets Container -->';
const calcEndStr = '                </section>';

let mfStartIdx = html.indexOf(mfListStartStr);
let calcStartIdx = html.indexOf(mfListEndStr);
let calcEndIdx = html.indexOf(calcEndStr, calcStartIdx);

if (mfStartIdx !== -1 && calcStartIdx !== -1 && calcEndIdx !== -1) {
    // Extract the MF List div
    const mfListHtml = html.substring(mfStartIdx, calcStartIdx);
    
    // Extract the Calculators div
    const calcHtml = html.substring(calcStartIdx, calcEndIdx); 
    
    // Stitch it all together: Start of file -> Calc Html -> MF List -> End of file
    const newHtml = html.substring(0, mfStartIdx) + calcHtml + "\n\n" + mfListHtml + html.substring(calcEndIdx);
    
    fs.writeFileSync('index.html', newHtml);
    console.log("Reordered layout successfully.");
} else {
    console.log("Could not find layout markers.");
}
