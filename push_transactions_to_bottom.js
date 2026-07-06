const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const goalsStart = html.indexOf('<!-- Goals & Transactions Row -->');
const footerStart = html.indexOf('<!-- Top Demanding Stocks Recommendation Widget -->');
const modalsStart = html.indexOf('<!-- Modal for manual transaction adding -->');

if (goalsStart !== -1 && footerStart !== -1 && modalsStart !== -1) {
    const chunkE_Goals = html.substring(goalsStart, footerStart);
    const chunkF_Footer = html.substring(footerStart, modalsStart);
    
    // We want to swap them so Footer is ABOVE Goals
    // But first, let's remove the scrollbar from Transactions inside chunkE_Goals
    let modifiedGoals = chunkE_Goals.replace('max-h-[300px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar', 'space-y-2.5 pr-1');
    
    const beforeGoals = html.substring(0, goalsStart);
    const afterModals = html.substring(modalsStart);
    
    // New arrangement
    const newHtml = beforeGoals + chunkF_Footer + modifiedGoals + afterModals;
    
    fs.writeFileSync('index.html', newHtml);
    console.log("Successfully moved Top Demanding Stocks above Goals & Transactions, and removed inner scrollbar.");
} else {
    console.log("Markers not found.");
}
