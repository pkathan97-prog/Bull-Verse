const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const demandingWidget = `                    <!-- Top Demanding Stocks Recommendation Widget -->
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

const goalsWidget = `                    <!-- Goals Track list -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="glass-card p-5 rounded-2xl space-y-4 h-full">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                <i data-lucide="target" class="w-4.5 h-4.5 text-amber-500"></i>
                                Goal-Based Financial roadmaps
                            </h3>
                            <div class="space-y-4" id="port-goals-list">
                                <!-- populated dynamic -->
                            </div>
                        </div>

                        <!-- Historical Transactions Log -->
                        <div class="glass-card p-5 rounded-2xl space-y-4 h-full">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                <i data-lucide="list" class="w-4.5 h-4.5 text-emerald-500"></i>
                                Transaction History logs
                            </h3>
                            <div class="max-h-[250px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar" id="port-transactions-list">
                                <!-- dynamic transactions -->
                            </div>
                        </div>
                    </div>`;

// Look for the exact block from the HTML starting at "Top Demanding Stocks" down to the end of the Goals widget.
// A simpler way is to find the indices.

const topDemandingStart = html.indexOf('<!-- Top Demanding Stocks Recommendation Widget -->');
const topDemandingEnd = html.indexOf('<!-- Goals Track list -->');
const goalsEnd = html.indexOf('<!-- Modal for manual transaction adding -->');

if (topDemandingStart !== -1 && topDemandingEnd !== -1 && goalsEnd !== -1) {
    // We swap them!
    const newSection = goalsWidget + "\n\n" + demandingWidget + "\n\n                    ";
    
    html = html.substring(0, topDemandingStart) + newSection + html.substring(goalsEnd);
    fs.writeFileSync('index.html', html);
    console.log('Swapped Top Demanding and Goals widgets!');
} else {
    console.log('Failed to find indices', topDemandingStart, topDemandingEnd, goalsEnd);
}
