const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const footerStart = html.indexOf('<!-- Top Demanding Stocks Recommendation Widget -->');
const goalsStart = html.indexOf('<!-- Goals & Transactions Row -->');
const modalsStart = html.indexOf('<!-- Modal for manual transaction adding -->');

if (footerStart !== -1 && goalsStart !== -1 && modalsStart !== -1) {
    const chunkF_Footer = html.substring(footerStart, goalsStart);
    const chunkE_Goals = html.substring(goalsStart, modalsStart);
    
    const beforeFooter = html.substring(0, footerStart);
    const afterModals = html.substring(modalsStart);
    
    // New arrangement: Goals & Transactions ABOVE Top Demanding Stocks
    const newHtml = beforeFooter + chunkE_Goals + chunkF_Footer + afterModals;
    
    fs.writeFileSync('index.html', newHtml);
    console.log("Successfully moved Top Demanding Stocks to the absolute bottom, below Goals & Transactions.");
} else {
    console.log("Markers not found.");
}
