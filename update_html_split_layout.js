const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const mfStartMarker = '                            <div class="flex justify-between items-center mt-8 pt-6 border-t border-white/5">';
const mfEndMarker = '                                </table>\n                            </div>\n                        </div>\n\n                        <!-- Allocation distributions pie charts -->';

let startIdx = html.indexOf(mfStartMarker);
let endIdx = html.indexOf(mfEndMarker);

if (startIdx !== -1 && endIdx !== -1) {
    // Extract the MF table code
    const mfTableHtml = html.substring(startIdx, endIdx + '                                </table>\n                            </div>'.length);
    
    // The new HTML structure to replace it with
    const newStructure = `                        </div>
                        
                        <!-- Stock Allocation distributions pie charts -->
                        <div class="glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                            <div>
                                <h3 class="font-poppins font-bold text-sm text-white mb-4">Sector Distribution</h3>
                                <div class="relative w-40 h-40 mx-auto">
                                    <canvas id="port-sector-pie-canvas" class="mx-auto w-full h-full"></canvas>
                                </div>
                            </div>
                            <div class="space-y-1.5 text-xs text-gray-400" id="port-sector-legends">
                                <!-- legends list -->
                            </div>
                        </div>
                    </div>

                    <!-- Mutual Funds Block -->
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <!-- MF Holdings table -->
                        <div class="lg:col-span-2 glass-card p-5 rounded-2xl space-y-4">
                            <div class="flex justify-between items-center">
                                <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                    <i data-lucide="layers" class="w-4 h-4 text-emerald-400"></i> Mutual Fund Assets
                                </h3>
                            </div>
                            <div class="overflow-x-auto max-h-[380px] overflow-y-scroll pr-1 custom-scrollbar">
                                <table class="w-full text-xs text-left">
                                    <thead class="text-gray-400 border-b border-white/5 font-semibold sticky top-0 bg-[#0d0f17] z-10">
                                        <tr>
                                            <th class="pb-3">Fund Name</th>
                                            <th class="pb-3">Units</th>
                                            <th class="pb-3">Avg NAV</th>
                                            <th class="pb-3">Current NAV</th>
                                            <th class="pb-3">Invested</th>
                                            <th class="pb-3">Current Val</th>
                                            <th class="pb-3 text-right">P&L (%)</th>
                                            <th class="pb-3 text-right pr-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-white/5 text-gray-300" id="port-mf-holdings-tbody">
                                        <!-- Injected dynamically -->
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        
                        <!-- MF Allocation pie chart -->
                        <div class="glass-card p-5 rounded-2xl space-y-4 flex flex-col justify-between">
                            <div>
                                <h3 class="font-poppins font-bold text-sm text-white mb-4">MF Category Spread</h3>
                                <div class="relative w-40 h-40 mx-auto">
                                    <canvas id="port-mf-pie-canvas" class="mx-auto w-full h-full"></canvas>
                                </div>
                            </div>
                            <div class="space-y-1.5 text-xs text-gray-400" id="port-mf-legends">
                                <!-- legends list -->
                            </div>`;
                            
    // We need to replace from mfStartMarker all the way to the end of the original pie chart container
    const originalPieEndMarker = '                            </div>\n                        </div>';
    let pieEndIdx = html.indexOf(originalPieEndMarker, endIdx);
    
    if (pieEndIdx !== -1) {
        pieEndIdx += originalPieEndMarker.length;
        const toReplace = html.substring(startIdx, pieEndIdx);
        html = html.replace(toReplace, newStructure);
        
        // Add custom scrollbar css just for the mutual fund table as requested
        if (!html.includes('.custom-scrollbar::-webkit-scrollbar')) {
            html = html.replace('</style>', `
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.3); border-radius: 10px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(16, 185, 129, 0.6); }
        </style>`);
        }
        
        fs.writeFileSync('index.html', html);
        console.log("Updated HTML with split MF layout and custom scrollbar.");
    } else {
        console.log("Could not find pie chart end marker");
    }
} else {
    console.log("Could not find start/end markers");
}
