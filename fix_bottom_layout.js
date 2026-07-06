const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const goalsStart = html.indexOf('<!-- Goals Track list -->');
const modalStart = html.indexOf('<!-- Modal for manual transaction adding -->');

if (goalsStart !== -1 && modalStart !== -1) {
    // We will replace everything from goalsStart to modalStart with the proper layout
    const newBottom = `                    <!-- Goals & Transactions Row -->
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <!-- Goals Track list -->
                        <div class="glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                <i data-lucide="target" class="w-4.5 h-4.5 text-amber-500"></i>
                                Goal-Based Financial roadmaps
                            </h3>
                            <div class="space-y-4" id="port-goals-list">
                                <!-- populated dynamic -->
                            </div>
                        </div>

                        <!-- Historical Transactions Log -->
                        <div class="glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                <i data-lucide="list" class="w-4.5 h-4.5 text-emerald-500"></i>
                                Transaction History logs
                            </h3>
                            <div class="max-h-[300px] overflow-y-auto space-y-2.5 pr-1 custom-scrollbar" id="port-transactions-list">
                                <!-- dynamic transactions -->
                            </div>
                        </div>
                    </div>

                    <!-- Top Demanding Stocks Recommendation Widget -->
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
                    </div>\n\n                    `;

    html = html.substring(0, goalsStart) + newBottom + html.substring(modalStart);
    fs.writeFileSync('index.html', html);
    console.log("Reverted and fixed the bottom layout to the user's exact specification.");
} else {
    console.log("Could not find start and end markers.");
}
