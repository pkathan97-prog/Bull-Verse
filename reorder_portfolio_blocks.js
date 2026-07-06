const fs = require('fs');

function reorderPortfolio() {
    let html = fs.readFileSync('index.html', 'utf8');

    const limitsStart = html.indexOf('<!-- Portfolio Limits (Cloned from Home) -->');
    const coreMetricsStart = html.indexOf('<!-- Core metrics grid -->');
    const stocksStart = html.indexOf('<!-- Portfolio allocation visualization & Holdings -->');
    const mfStart = html.indexOf('<!-- Mutual Funds Block -->');
    const goalsStart = html.indexOf('<!-- Goals & Transactions Row -->');

    if (limitsStart === -1 || coreMetricsStart === -1 || stocksStart === -1 || mfStart === -1 || goalsStart === -1) {
        console.error("Could not find one or more markers");
        return;
    }

    // Extract chunks
    const chunkA_Limits = html.substring(limitsStart, coreMetricsStart);
    const chunkB_CoreMetrics = html.substring(coreMetricsStart, stocksStart);
    const chunkC_Stocks = html.substring(stocksStart, mfStart);
    const chunkD_MF = html.substring(mfStart, goalsStart);

    // Build the new order:
    // A (Limits) -> D (MF) -> B (Core Metrics) -> C (Stocks) -> E (Goals)
    
    // Everything before limitsStart is the header and tabs
    const beforeLimits = html.substring(0, limitsStart);
    // Everything from goalsStart to the end is the rest of the page
    const afterMF_which_is_Goals_onwards = html.substring(goalsStart);

    const newHtml = beforeLimits + chunkA_Limits + chunkD_MF + chunkB_CoreMetrics + chunkC_Stocks + afterMF_which_is_Goals_onwards;

    fs.writeFileSync('index.html', newHtml);
    console.log("Successfully reordered chunks: Limits -> Mutual Funds -> Core Metrics -> Stocks");
}

reorderPortfolio();
