const fs = require('fs');

let appJs = fs.readFileSync('js/app.js', 'utf8');

const targetStr = `        // Populate holdings table
        const tbody = document.getElementById("port-holdings-tbody");
        if (tbody) {
            if (data.userState.portfolio.holdings.length === 0) {
                tbody.innerHTML = \`<tr><td colspan="8" class="py-10 text-center text-gray-500">Your portfolio is empty. Add a transaction order to begin.</td></tr>\`;
            } else {
                tbody.innerHTML = data.userState.portfolio.holdings.map(hold => {
                    const fromList = data.allStocksList.find(s => s.symbol === hold.symbol);
                    const fromCrypto = data.cryptos ? data.cryptos.find(c => c.symbol === hold.symbol) : null;
                    const fromMF = data.mutualFunds ? data.mutualFunds.find(m => m.id === hold.symbol) : null;
                    if (fromMF) {
                        fromMF.price = fromMF.nav; // normalize pricing property for portfolio maths
                        fromMF.symbol = fromMF.name; // normalize name display
                    }
                    const stock = data.stocks[hold.symbol] || fromList || fromCrypto || fromMF || { price: hold.avgCost, changePercent: 0 };
                    
                    const investedVal = hold.shares * hold.avgCost;
                    const currentVal = hold.shares * stock.price;
                    const profit = currentVal - investedVal;
                    const profitPct = investedVal > 0 ? (profit / investedVal) * 100 : 0;
                    
                    const holdsPos = profit >= 0;
                    
                    const isCrypto = data.cryptos ? data.cryptos.some(c => c.symbol === hold.symbol) : false;
                    const hashTarget = isCrypto ? '#crypto' : \`#company-details/\${hold.symbol}\`;

                    return \`<tr class="hover:bg-white/2 cursor-pointer transition" onclick="window.location.hash='\${hashTarget}'">
                        <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full \${isCrypto ? 'bg-amber-400' : 'bg-emerald-500'}"></span> \${hold.symbol}
                        </td>
                        <td class="py-3.5">\${hold.shares}</td>
                        <td class="py-3.5 font-mono">₹\${hold.avgCost.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹\${stock.price.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹\${Math.round(investedVal).toLocaleString()}</td>
                        <td class="py-3.5 font-mono">₹\${Math.round(currentVal).toLocaleString()}</td>
                        <td class="py-3.5 text-right font-mono font-bold \${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                            \${holdsPos ? '+' : ''}\${profitPct.toFixed(1)}%
                        </td>
                        <td class="py-3.5 text-right pr-4">
                            <button class="glass-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all" onclick="window.location.hash='\${hashTarget}'; event.stopPropagation();">
                                Details
                            </button>
                        </td>
                    </tr>\`;
                }).join("");
            }
        }`;

const replacementStr = `        // Populate holdings tables
        const tbody = document.getElementById("port-holdings-tbody");
        const mfTbody = document.getElementById("port-mf-holdings-tbody");
        
        if (tbody) {
            const stockHolds = [];
            const mfHolds = [];
            
            data.userState.portfolio.holdings.forEach(hold => {
                const isMF = data.mutualFunds ? data.mutualFunds.some(m => m.id === hold.symbol) : false;
                if (isMF) mfHolds.push(hold);
                else stockHolds.push(hold);
            });

            // 1. Render Stocks/Crypto
            if (stockHolds.length === 0) {
                tbody.innerHTML = \`<tr><td colspan="8" class="py-10 text-center text-gray-500">No stock or crypto positions found.</td></tr>\`;
            } else {
                tbody.innerHTML = stockHolds.map(hold => {
                    const fromList = data.allStocksList.find(s => s.symbol === hold.symbol);
                    const fromCrypto = data.cryptos ? data.cryptos.find(c => c.symbol === hold.symbol) : null;
                    const stock = data.stocks[hold.symbol] || fromList || fromCrypto || { price: hold.avgCost, changePercent: 0 };
                    
                    const investedVal = hold.shares * hold.avgCost;
                    const currentVal = hold.shares * stock.price;
                    const profit = currentVal - investedVal;
                    const profitPct = investedVal > 0 ? (profit / investedVal) * 100 : 0;
                    
                    const holdsPos = profit >= 0;
                    
                    const isCrypto = data.cryptos ? data.cryptos.some(c => c.symbol === hold.symbol) : false;
                    const hashTarget = isCrypto ? '#crypto' : \`#company-details/\${hold.symbol}\`;

                    return \`<tr class="hover:bg-white/2 cursor-pointer transition" onclick="window.location.hash='\${hashTarget}'">
                        <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full \${isCrypto ? 'bg-amber-400' : 'bg-emerald-500'}"></span> \${hold.symbol}
                        </td>
                        <td class="py-3.5">\${hold.shares}</td>
                        <td class="py-3.5 font-mono">₹\${hold.avgCost.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹\${stock.price.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹\${Math.round(investedVal).toLocaleString()}</td>
                        <td class="py-3.5 font-mono">₹\${Math.round(currentVal).toLocaleString()}</td>
                        <td class="py-3.5 text-right font-mono font-bold \${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                            \${holdsPos ? '+' : ''}\${profitPct.toFixed(1)}%
                        </td>
                        <td class="py-3.5 text-right pr-4">
                            <button class="glass-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all" onclick="window.location.hash='\${hashTarget}'; event.stopPropagation();">
                                Details
                            </button>
                        </td>
                    </tr>\`;
                }).join("");
            }
            
            // 2. Render Mutual Funds
            if (mfTbody) {
                if (mfHolds.length === 0) {
                    mfTbody.innerHTML = \`<tr><td colspan="7" class="py-10 text-center text-gray-500">No mutual fund investments found.</td></tr>\`;
                } else {
                    mfTbody.innerHTML = mfHolds.map(hold => {
                        const fromMF = data.mutualFunds.find(m => m.id === hold.symbol);
                        const currentNav = fromMF ? fromMF.nav : hold.avgCost;
                        const name = fromMF ? fromMF.name : hold.symbol;
                        
                        const investedVal = hold.shares * hold.avgCost;
                        const currentVal = hold.shares * currentNav;
                        const profit = currentVal - investedVal;
                        const profitPct = investedVal > 0 ? (profit / investedVal) * 100 : 0;
                        const holdsPos = profit >= 0;

                        return \`<tr class="hover:bg-white/2 transition">
                            <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> \${name}
                            </td>
                            <td class="py-3.5">\${hold.shares}</td>
                            <td class="py-3.5 font-mono">₹\${hold.avgCost.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹\${currentNav.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹\${Math.round(investedVal).toLocaleString()}</td>
                            <td class="py-3.5 font-mono">₹\${Math.round(currentVal).toLocaleString()}</td>
                            <td class="py-3.5 text-right font-mono font-bold \${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                                \${holdsPos ? '+' : ''}\${profitPct.toFixed(1)}%
                            </td>
                        </tr>\`;
                    }).join("");
                }
            }
        }`;

if (appJs.includes('const tbody = document.getElementById("port-holdings-tbody");')) {
    // using basic index replacement since formatting might differ slightly
    const startIdx = appJs.indexOf('        // Populate holdings table');
    const endIdx = appJs.indexOf('        // Render Trending Stocks Recommendations dynamically', startIdx);
    
    if (startIdx !== -1 && endIdx !== -1) {
        appJs = appJs.substring(0, startIdx) + replacementStr + "\n\n" + appJs.substring(endIdx);
        fs.writeFileSync('js/app.js', appJs);
        console.log("Replaced app.js portfolio rendering logic.");
    } else {
        console.log("Could not find start/end indices");
    }
} else {
    console.log("Could not find target string.");
}
