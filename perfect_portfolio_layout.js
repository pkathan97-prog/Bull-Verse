const fs = require('fs');

function buildPerfectLayout() {
    let html = fs.readFileSync('index.html', 'utf8');

    const limitsStart = html.indexOf('<!-- Portfolio Limits (Cloned from Home) -->');
    const mfStart = html.indexOf('<!-- Mutual Funds Block -->');
    const coreMetricsStart = html.indexOf('<!-- Core metrics grid -->');
    const stocksStart = html.indexOf('<!-- Portfolio allocation visualization & Holdings -->');
    const goalsStart = html.indexOf('<!-- Goals & Transactions Row -->');
    const footerStart = html.indexOf('<!-- Top Demanding Stocks Recommendation Widget -->');
    const modalsStart = html.indexOf('<!-- Modal for manual transaction adding -->');

    if (limitsStart === -1 || mfStart === -1 || coreMetricsStart === -1 || stocksStart === -1 || goalsStart === -1 || footerStart === -1) {
        console.error("Could not find one or more markers");
        return;
    }

    // Extract chunks based on the current order which is: Limits -> MF -> Core Metrics -> Stocks -> Goals -> Footer -> Modals
    const chunkA_Limits = html.substring(limitsStart, mfStart);
    const chunkD_MF = html.substring(mfStart, coreMetricsStart);
    const chunkB_CoreMetrics = html.substring(coreMetricsStart, stocksStart);
    const chunkC_Stocks = html.substring(stocksStart, goalsStart);
    const chunkE_Goals = html.substring(goalsStart, footerStart);
    const chunkF_Footer = html.substring(footerStart, modalsStart);

    // Build the PERFECT order:
    // 1. Core Metrics (High level portfolio value)
    // 2. Limits (Margin context)
    // 3. Stocks (Primary assets)
    // 4. Mutual Funds (Secondary assets)
    // 5. Goals & Transactions (Planning & Ledger)
    // 6. Top Demanding Stocks (Footer discovery)
    
    const beforeLimits = html.substring(0, limitsStart); // The header
    const afterFooter = html.substring(modalsStart); // The modals and end divs

    const perfectHtml = beforeLimits + 
                        chunkB_CoreMetrics + 
                        chunkA_Limits + 
                        chunkC_Stocks + 
                        chunkD_MF + 
                        chunkE_Goals + 
                        chunkF_Footer + 
                        afterFooter;

    fs.writeFileSync('index.html', perfectHtml);
    console.log("Successfully arranged Portfolio Manager into the perfect logical layout.");
}

buildPerfectLayout();
