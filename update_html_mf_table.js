const fs = require('fs');

let html = fs.readFileSync('index.html', 'utf8');

const tableInsertPoint = '                                </table>\n                            </div>';
const newTableHtml = `                                </table>
                            </div>
                            
                            <div class="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
                                <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-2">
                                    <i data-lucide="layers" class="w-4 h-4 text-emerald-400"></i> Mutual Fund Assets
                                </h3>
                            </div>
                            <div class="overflow-x-auto max-h-[380px] overflow-y-auto pr-1">
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
                                        </tr>
                                    </thead>
                                    <tbody class="divide-y divide-white/5 text-gray-300" id="port-mf-holdings-tbody">
                                        <!-- Injected dynamically -->
                                    </tbody>
                                </table>
                            </div>`;

if (html.includes(tableInsertPoint)) {
    // Only replace the first occurrence (which is the stock table)
    html = html.replace(tableInsertPoint, newTableHtml);
    fs.writeFileSync('index.html', html);
    console.log("Updated HTML with mutual funds table.");
} else {
    console.log("Could not find insert point in HTML.");
}
