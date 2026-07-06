const fs = require('fs');

const mfCategories = ["Small Cap", "Mid Cap", "Large Cap", "Flexi Cap", "Multi Cap", "Index Fund", "ELSS", "Sectoral"];
const mfRisks = ["Low", "Moderate", "High", "Very High"];

const amcs = ["SBI", "HDFC", "ICICI Prudential", "Axis", "Kotak", "Nippon India", "Parag Parikh", "Quant", "Mirae Asset", "UTI", "Tata", "DSP"];

function getRandom(min, max, dec) {
    return parseFloat((Math.random() * (max - min) + min).toFixed(dec));
}

let mfs = [];

// Adding base real ones first just to keep them
mfs.push({ id: "sbi-small-cap", name: "SBI Small Cap Fund - Growth", nav: 168.42, expenseRatio: 0.68, return3y: 26.4, return5y: 22.8, risk: "Very High", category: "Small Cap", minSip: 500 });
mfs.push({ id: "axis-bluechip", name: "Axis Bluechip Fund - Direct Growth", nav: 54.10, expenseRatio: 0.45, return3y: 14.2, return5y: 16.5, risk: "Low to Moderate", category: "Large Cap", minSip: 1000 });
mfs.push({ id: "parag-parikh-flexi", name: "Parag Parikh Flexi Cap Fund", nav: 72.85, expenseRatio: 0.55, return3y: 21.8, return5y: 23.4, risk: "High", category: "Flexi Cap", minSip: 1000 });
mfs.push({ id: "hdfc-midcap-opp", name: "HDFC Mid-Cap Opportunities Fund", nav: 154.20, expenseRatio: 0.72, return3y: 24.5, return5y: 20.1, risk: "Very High", category: "Mid Cap", minSip: 500 });
mfs.push({ id: "quant-active", name: "Quant Active Fund - Direct Growth", nav: 620.15, expenseRatio: 0.75, return3y: 28.2, return5y: 27.8, risk: "Very High", category: "Multi Cap", minSip: 500 });
mfs.push({ id: "icici-prudential-nasdaq", name: "ICICI Prudential NASDAQ 100 Index", nav: 28.50, expenseRatio: 0.50, return3y: 12.8, return5y: 18.2, risk: "High", category: "Index Fund", minSip: 1000 });

// Generate remaining to make it at least 52
for (let i = 0; i < 46; i++) {
    const amc = amcs[Math.floor(Math.random() * amcs.length)];
    const cat = mfCategories[Math.floor(Math.random() * mfCategories.length)];
    const name = `${amc} ${cat} Fund - Direct Growth`;
    const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const risk = mfRisks[Math.floor(Math.random() * mfRisks.length)];
    const r3 = getRandom(8, 35, 1);
    
    mfs.push({
        id: id + "-" + i,
        name: name,
        nav: getRandom(10, 800, 2),
        expenseRatio: getRandom(0.1, 1.2, 2),
        return3y: r3,
        return5y: getRandom(r3 - 5, r3 + 5, 1),
        risk: risk,
        category: cat,
        minSip: Math.random() > 0.5 ? 500 : 1000
    });
}

// Write to data.js
let dataJs = fs.readFileSync('js/data.js', 'utf8');

// The mutualFunds array is defined like `mutualFunds: [ ... ],`
// Find start and end of mutualFunds array
let startIndex = dataJs.indexOf('mutualFunds: [');
let endIndex = dataJs.indexOf('],', startIndex);

if (startIndex !== -1 && endIndex !== -1) {
    let newMFStr = 'mutualFunds: [\n';
    mfs.forEach((mf, index) => {
        newMFStr += `        ${JSON.stringify(mf)}${index < mfs.length - 1 ? ',' : ''}\n`;
    });
    
    dataJs = dataJs.substring(0, startIndex) + newMFStr + dataJs.substring(endIndex);
    fs.writeFileSync('js/data.js', dataJs);
    console.log("Updated data.js with 52 mutual funds.");
} else {
    console.log("Could not find mutualFunds in data.js");
}
