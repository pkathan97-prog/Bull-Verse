const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const goalsStart = html.indexOf('<!-- Goals Track list -->');
const modalStart = html.indexOf('<!-- Modal for manual transaction adding -->');

if (goalsStart !== -1 && modalStart !== -1) {
    const bottomSection = html.substring(goalsStart, modalStart);
    
    // We need to extract the three widgets from bottomSection
    
    // 1. Goals
    let goalsStr = '';
    const gStart = bottomSection.indexOf('<div class="glass-card p-5 rounded-2xl space-y-4 h-full"');
    if (gStart !== -1) {
        // Since it's inside a grid, it's just the div. We need to find its end.
        const gStartStr = bottomSection.substring(gStart);
        // It ends before <!-- Historical Transactions Log -->
        const txLogStart = gStartStr.indexOf('<!-- Historical Transactions Log -->');
        if (txLogStart !== -1) {
            goalsStr = gStartStr.substring(0, txLogStart).trim();
            // Remove h-full since it's no longer side-by-side
            goalsStr = goalsStr.replace('h-full', '');
            // Actually, let's just rewrite Goals
            goalsStr = `                    <!-- Goals Track list -->
                    <div class="glass-card p-5 rounded-2xl space-y-4">
                        <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                            <i data-lucide="target" class="w-4.5 h-4.5 text-amber-500"></i>
                            Goal-Based Financial roadmaps
                        </h3>
                        <div class="space-y-4" id="port-goals-list">
                            <!-- populated dynamic -->
                        </div>
                    </div>`;
        }
    }
    
    // 2. Top Demanding Stocks
    let demandingStr = '';
    const dStart = bottomSection.indexOf('<!-- Top Demanding Stocks Recommendation Widget -->');
    if (dStart !== -1) {
        // It goes until the end of the widget
        demandingStr = `                    <!-- Top Demanding Stocks Recommendation Widget -->
                    <div class="glass-card p-5 rounded-2xl space-y-4">
                        <div class="flex justify-between items-center">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                <i data-lucide="zap" class="w-4 h-4 text-amber-400"></i>
                                Top Demanding Stocks
                            </h3>
                            <span class="text-[10px] text-gray-400 font-bold block uppercase tracking-wider bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded">RECOMMENDED</span>
                        </div>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4" id="trending-stocks-list">
                            <!-- populated dynamically in app.js -->
                        </div>
                    </div>`;
    }

    // 3. Transactions
    let txStr = `                    <!-- Historical Transactions Log -->
                    <div class="glass-card p-5 rounded-2xl space-y-4">
                        <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                            <i data-lucide="list" class="w-4.5 h-4.5 text-emerald-500"></i>
                            Transaction History logs
                        </h3>
                        <div class="space-y-2.5 pr-1" id="port-transactions-list">
                            <!-- dynamic transactions -->
                        </div>
                    </div>`;
                    
    const newBottom = goalsStr + '\n\n' + demandingStr + '\n\n' + txStr + '\n\n                    ';
    html = html.substring(0, goalsStart) + newBottom + html.substring(modalStart);
    fs.writeFileSync('index.html', html);
    console.log("Successfully rebuilt the bottom layout!");
} else {
    console.log("Could not find start and end markers.");
}
