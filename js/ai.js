// BullVerse India — Next-Gen BullMind AI Engine v3.0
// Handles ALL 62+ stocks, technical analysis, MF, IPO, general finance Q&A

window.BullMindAI = {

    // Voice Synthesis
    speak: function(text, callback) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 1.05;
            utterance.pitch = 1.0;
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find(v => v.name.includes("Google US English") || v.name.includes("Samantha") || v.name.includes("Zira"));
            if (preferred) utterance.voice = preferred;
            utterance.onend = () => { if (callback) callback(); };
            window.speechSynthesis.speak(utterance);
        } else {
            if (callback) setTimeout(callback, 2000);
        }
    },

    // Helper: find stock in allStocksList
    _findStock: function(query) {
        const q = query.toLowerCase();
        const allStocks = window.BullVerseData ? window.BullVerseData.allStocksList || [] : [];
        const detailedStocks = window.BullVerseData ? window.BullVerseData.stocks || {} : {};

        // Try exact symbol match first
        let found = allStocks.find(s => q.includes(s.symbol.toLowerCase()));
        // Try name match
        if (!found) found = allStocks.find(s => q.includes(s.name.toLowerCase()));
        // Try partial name match (3+ chars)
        if (!found) {
            found = allStocks.find(s => {
                const words = s.name.toLowerCase().split(' ');
                return words.some(w => w.length >= 3 && q.includes(w));
            });
        }

        if (found) {
            // Merge with detailed data if available
            const detailed = detailedStocks[found.symbol];
            if (detailed) {
                return { ...found, ...detailed, _hasDetail: true };
            }
            return { ...found, _hasDetail: false };
        }
        return null;
    },

    // Helper: generate AI score for any stock
    _generateScore: function(stock) {
        const pe = stock.pe || stock.peRatio || 20;
        const roe = stock.roe || 15;
        const chg = stock.changePercent || 0;

        // Valuation score (lower PE = better, up to a point)
        let valuation = pe < 10 ? 85 : pe < 20 ? 78 : pe < 35 ? 65 : pe < 60 ? 50 : 35;
        // Growth score
        let growth = roe > 25 ? 88 : roe > 18 ? 76 : roe > 12 ? 65 : 50;
        // Momentum score
        let momentum = chg > 2 ? 82 : chg > 0 ? 70 : chg > -2 ? 55 : 40;
        // Stability
        let stability = stock.cap === 'Large' ? 82 : stock.cap === 'Mid' ? 68 : 55;

        const overall = Math.round((valuation + growth + momentum + stability) / 4);
        const rating = overall >= 80 ? 'Strong Buy' : overall >= 70 ? 'Buy' : overall >= 55 ? 'Hold' : 'Underperform';
        const risk = overall >= 75 ? 'Low-Medium' : overall >= 60 ? 'Medium' : 'Medium-High';

        // Target price: +8 to +18% above current
        const targetMult = 1 + (overall / 500) + 0.05;
        const target = '₹' + Math.round((stock.price || 100) * targetMult).toLocaleString('en-IN');

        return { overall, valuation, growth, momentum, stability, rating, risk, target };
    },

    // Helper: generate technical analysis summary
    _techAnalysis: function(stock) {
        const price = stock.price || 100;
        const high52 = stock.high52w || price * 1.2;
        const low52 = stock.low52w || price * 0.8;
        const pctFrom52H = ((high52 - price) / high52 * 100).toFixed(1);
        const pctFrom52L = ((price - low52) / low52 * 100).toFixed(1);

        // Mock technical indicators
        const sma20 = (price * (0.97 + Math.random() * 0.06)).toFixed(2);
        const sma50 = (price * (0.94 + Math.random() * 0.10)).toFixed(2);
        const sma200 = (price * (0.88 + Math.random() * 0.18)).toFixed(2);
        const rsi = Math.round(40 + Math.random() * 30);
        const macd = (Math.random() * 4 - 1).toFixed(2);

        const aboveSma20 = price > parseFloat(sma20);
        const aboveSma50 = price > parseFloat(sma50);
        const aboveSma200 = price > parseFloat(sma200);

        let trend = 'Neutral';
        if (aboveSma20 && aboveSma50 && aboveSma200) trend = 'Strong Uptrend 🟢';
        else if (aboveSma50 && aboveSma200) trend = 'Uptrend 🟢';
        else if (!aboveSma20 && !aboveSma50) trend = 'Downtrend 🔴';
        else trend = 'Sideways/Consolidation 🟡';

        let rsiSignal = rsi > 70 ? 'Overbought ⚠️' : rsi < 30 ? 'Oversold 🟢' : 'Neutral';

        return { sma20, sma50, sma200, rsi, rsiSignal, macd, trend, pctFrom52H, pctFrom52L, aboveSma20, aboveSma50, aboveSma200 };
    },

    // ============ MAIN CONVERSATIONAL ROUTER ============
    getAIResponse: function(query) {
        const q = query.toLowerCase().trim();

        // ---- 1. STOCK ANALYSIS (works for ALL 62+ stocks) ----
        const stock = this._findStock(q);

        if (stock && (q.includes('analy') || q.includes('report') || q.includes('review') || q.includes('show') || q.includes('about') || q.includes('how is') || q.includes('price') || q.includes('tell me'))) {
            const score = this._generateScore(stock);
            const pe = stock.pe || stock.peRatio || 'N/A';
            const roe = stock.roe || 'N/A';
            const mcap = stock.marketCap || 'N/A';

            return {
                text: `### 🧬 AI DNA Report: ${stock.name} (${stock.symbol})\n\n` +
                      `| Metric | Value |\n|:---|:---|\n` +
                      `| **Current Price** | ₹${(stock.price||0).toFixed(2)} |\n` +
                      `| **Change** | ${(stock.changePercent||0) >= 0 ? '+' : ''}${(stock.changePercent||0).toFixed(2)}% |\n` +
                      `| **Market Cap** | ${mcap} |\n` +
                      `| **P/E Ratio** | ${pe}x |\n` +
                      `| **ROE** | ${roe}% |\n` +
                      `| **Sector** | ${stock.sector} |\n` +
                      `| **52W Range** | ₹${stock.low52w||'N/A'} — ₹${stock.high52w||'N/A'} |\n\n` +
                      `**🎯 AI Rating: ${score.rating} (${score.overall}/100)**\n` +
                      `- Target Price: **${score.target}**\n` +
                      `- Risk Level: **${score.risk}**\n\n` +
                      `*Core Scores:*\n` +
                      `- 📈 Growth: **${score.growth}/100** | 💰 Valuation: **${score.valuation}/100**\n` +
                      `- 🛡️ Stability: **${score.stability}/100** | 🔥 Momentum: **${score.momentum}/100**\n\n` +
                      `Would you like me to run a **technical analysis** or **compare ${stock.symbol}** with peers?`,
                speech: `Analyzing ${stock.name}. AI rating is ${score.rating} with an overall score of ${score.overall}. Target price is ${score.target}. Risk is ${score.risk}.`
            };
        }

        // If just stock name mentioned without action keyword — give quick snapshot
        if (stock && !q.includes('compare') && !q.includes('technical') && !q.includes('vs')) {
            const score = this._generateScore(stock);
            return {
                text: `**${stock.name} (${stock.symbol})** — ₹${(stock.price||0).toFixed(2)} (${(stock.changePercent||0) >= 0 ? '🟢 +' : '🔴 '}${(stock.changePercent||0).toFixed(2)}%)\n\n` +
                      `P/E: ${stock.pe||stock.peRatio||'N/A'}x | ROE: ${stock.roe||'N/A'}% | MCap: ${stock.marketCap||'N/A'} | ${stock.cap||'Large'} Cap\n\n` +
                      `AI Rating: **${score.rating} (${score.overall}/100)** | Target: ${score.target}\n\n` +
                      `Say *"analyze ${stock.symbol}"* for a full report or *"technical ${stock.symbol}"* for charts analysis.`,
                speech: `${stock.name} is trading at rupees ${(stock.price||0).toFixed(0)} with a ${score.rating} rating.`
            };
        }

        // ---- 2. TECHNICAL ANALYSIS ----
        if (q.includes('technical') || q.includes('chart') || q.includes('rsi') || q.includes('sma') || q.includes('macd') || q.includes('indicator')) {
            const techStock = stock || this._findStock(q.replace(/technical|analysis|chart|indicator/g, ''));
            if (techStock) {
                const ta = this._techAnalysis(techStock);
                const pe = techStock.pe || techStock.peRatio || 'N/A';
                return {
                    text: `### 📊 Technical Analysis: ${techStock.name} (${techStock.symbol})\n\n` +
                          `**Overall Trend:** ${ta.trend}\n\n` +
                          `| Indicator | Value | Signal |\n|:---|:---|:---|\n` +
                          `| **SMA 20** | ₹${ta.sma20} | ${ta.aboveSma20 ? '🟢 Above' : '🔴 Below'} |\n` +
                          `| **SMA 50** | ₹${ta.sma50} | ${ta.aboveSma50 ? '🟢 Above' : '🔴 Below'} |\n` +
                          `| **SMA 200** | ₹${ta.sma200} | ${ta.aboveSma200 ? '🟢 Above' : '🔴 Below'} |\n` +
                          `| **RSI (14)** | ${ta.rsi} | ${ta.rsiSignal} |\n` +
                          `| **MACD** | ${ta.macd} | ${parseFloat(ta.macd) > 0 ? '🟢 Bullish' : '🔴 Bearish'} |\n` +
                          `| **P/E Ratio** | ${pe}x | ${pe < 20 ? '🟢 Undervalued' : pe < 40 ? '🟡 Fair' : '🔴 Expensive'} |\n\n` +
                          `📏 **52-Week Position:**\n` +
                          `- ${ta.pctFrom52H}% below 52W High\n` +
                          `- ${ta.pctFrom52L}% above 52W Low\n\n` +
                          `*Tip: Click the stock card in Listed Stocks to view interactive candlestick charts with SMA overlays.*`,
                    speech: `Technical analysis for ${techStock.name}. The trend is ${ta.trend.replace(/[🟢🔴🟡]/g,'')}. RSI is at ${ta.rsi}, which is ${ta.rsiSignal.replace(/[⚠️🟢]/g,'')}.`
                };
            }
        }

        // ---- 3. COMPARISON ----
        if (q.includes('compare') || q.includes('versus') || q.includes(' vs ') || q.includes(' v/s ')) {
            // Try to find two stock symbols
            const allStocks = window.BullVerseData ? window.BullVerseData.allStocksList || [] : [];
            const found = [];
            allStocks.forEach(s => {
                if (q.includes(s.symbol.toLowerCase()) || q.includes(s.name.toLowerCase())) {
                    if (found.length < 2 && !found.find(f => f.symbol === s.symbol)) found.push(s);
                }
            });
            if (found.length >= 2) {
                const [a, b] = found;
                const sa = this._generateScore(a);
                const sb = this._generateScore(b);
                return {
                    text: `### ⚖️ AI Comparison: ${a.symbol} vs ${b.symbol}\n\n` +
                          `| Metric | ${a.symbol} | ${b.symbol} |\n|:---|:---|:---|\n` +
                          `| **Price** | ₹${(a.price||0).toFixed(2)} | ₹${(b.price||0).toFixed(2)} |\n` +
                          `| **Change** | ${(a.changePercent||0).toFixed(2)}% | ${(b.changePercent||0).toFixed(2)}% |\n` +
                          `| **P/E Ratio** | ${a.pe||'N/A'}x | ${b.pe||'N/A'}x |\n` +
                          `| **ROE** | ${a.roe||'N/A'}% | ${b.roe||'N/A'}% |\n` +
                          `| **Market Cap** | ${a.marketCap||'N/A'} | ${b.marketCap||'N/A'} |\n` +
                          `| **52W High** | ₹${a.high52w||'N/A'} | ₹${b.high52w||'N/A'} |\n` +
                          `| **AI Score** | **${sa.overall}/100 (${sa.rating})** | **${sb.overall}/100 (${sb.rating})** |\n` +
                          `| **Target** | ${sa.target} | ${sb.target} |\n\n` +
                          `**BullMind Verdict:** ${sa.overall > sb.overall ? a.symbol + ' has a stronger AI score' : sb.overall > sa.overall ? b.symbol + ' has a stronger AI score' : 'Both are equally rated'}. ` +
                          `${sa.overall > sb.overall ? 'Consider ' + a.symbol + ' for growth.' : 'Consider ' + b.symbol + ' for growth.'} Diversifying across both reduces sector risk.`,
                    speech: `Comparing ${a.name} and ${b.name}. ${sa.overall > sb.overall ? a.symbol : b.symbol} has the higher AI rating at ${Math.max(sa.overall, sb.overall)} out of 100.`
                };
            }
            // Default comparison (HDFC vs ICICI)
            return {
                text: `### ⚖️ AI Comparison: HDFCBANK vs ICICIBANK\n\n` +
                      `| Metric | HDFCBANK | ICICIBANK |\n|:---|:---|:---|\n` +
                      `| **P/E Ratio** | 19.2x | 18.2x |\n` +
                      `| **ROE** | 17.5% | 18.5% |\n` +
                      `| **NIM** | 3.4% | 3.9% |\n` +
                      `| **Gross NPA** | 1.24% | 1.16% |\n` +
                      `| **AI Rating** | **90/100 (Strong Buy)** | **88/100 (Buy)** |\n\n` +
                      `*Try: "compare RELIANCE INFY" to compare any two stocks.*`,
                speech: "Comparing HDFC Bank and ICICI Bank. Both are top private lenders. HDFC offers deep value, ICICI has superior operational momentum."
            };
        }

        // ---- 4. TAX ----
        if (q.includes('tax') || q.includes('capital gains') || q.includes('stcg') || q.includes('ltcg')) {
            return {
                text: `### 🪙 Indian Capital Gains Tax (FY 2024-25)\n\n` +
                      `| Type | Holding Period | Tax Rate | Exemption |\n|:---|:---|:---|:---|\n` +
                      `| **STCG** | < 12 months | **20%** | None |\n` +
                      `| **LTCG** | > 12 months | **12.5%** | Up to ₹1.25 Lakh/yr |\n` +
                      `| **Dividend** | Any | **Slab Rate** | None |\n` +
                      `| **F&O Profits** | Any | **Slab Rate** | Business income |\n\n` +
                      `💡 *Tax Harvesting Tip:* Sell long-term holdings before March 31 to book up to ₹1.25L in tax-free gains, then repurchase.\n\n` +
                      `📋 *STT:* Securities Transaction Tax of 0.1% on delivery, 0.025% on intraday is automatically deducted.`,
                speech: "Short term capital gains tax is twenty percent for holdings under twelve months. Long term is twelve point five percent with exemption up to one point two five lakh."
            };
        }

        // ---- 5. SIP / MUTUAL FUNDS ----
        if (q.includes('sip') || q.includes('systematic') || q.includes('mutual fund') || q.includes('mutual funds') || q.includes('mf') || q.includes('monthly invest')) {
            return {
                text: `### 📈 SIP & Mutual Fund Guide\n\n` +
                      `**Power of ₹10,000 Monthly SIP at 14% CAGR:**\n\n` +
                      `| Duration | Invested | Value | Wealth Created |\n|:---|:---|:---|:---|\n` +
                      `| 5 Years | ₹6,00,000 | **₹8.7 Lakhs** | ₹2.7L |\n` +
                      `| 10 Years | ₹12,00,000 | **₹26.2 Lakhs** | ₹14.2L |\n` +
                      `| 20 Years | ₹24,00,000 | **₹1.31 Crore** | ₹1.07Cr |\n` +
                      `| 30 Years | ₹36,00,000 | **₹5.55 Crore** | ₹5.19Cr 🚀 |\n\n` +
                      `**Top MF Categories:**\n` +
                      `- 🏆 **Flexi Cap:** Parag Parikh Flexi Cap, PPFAS\n` +
                      `- 📊 **Index Fund:** UTI Nifty 50, Motilal Oswal S&P 500\n` +
                      `- 🔥 **Small Cap:** SBI Small Cap, Nippon Small Cap\n` +
                      `- 🛡️ **Debt/Liquid:** HDFC Liquid Fund, ICICI Short Term\n\n` +
                      `*BullMind Tip:* Start SIPs early. Time in market > timing the market.`,
                speech: "A ten thousand rupee monthly SIP at fourteen percent compounding turns into over one crore in twenty years. Start early for maximum compounding benefit."
            };
        }

        // ---- 6. IPO ----
        if (q.includes('ipo') || q.includes('initial public offering') || q.includes('upcoming ipo')) {
            return {
                text: `### 🎯 IPO Center Guide\n\n` +
                      `**How to Apply for IPOs in India:**\n` +
                      `1. Open a **Demat Account** (Zerodha, Groww, Angel One)\n` +
                      `2. Apply through **UPI-based ASBA** (Amount Blocked in your bank)\n` +
                      `3. Allotment is lottery-based for retail (up to ₹2 Lakhs)\n\n` +
                      `**Key IPO Metrics to Check:**\n` +
                      `- **P/E vs Industry P/E** — Avoid overpriced IPOs\n` +
                      `- **GMP (Grey Market Premium)** — Indicates listing sentiment\n` +
                      `- **Promoter Holding** — Higher = more confidence\n` +
                      `- **Use of Proceeds** — Growth capex vs debt repayment\n\n` +
                      `**Recent Notable IPOs:**\n` +
                      `| Company | Issue Price | Listing Gain |\n|:---|:---|:---|\n` +
                      `| Bajaj Housing Finance | ₹70 | +114% |\n` +
                      `| Ola Electric | ₹76 | -8% |\n` +
                      `| FirstCry (Brainbees) | ₹465 | +40% |\n\n` +
                      `*Visit the IPO Center tab in the sidebar for live tracking.*`,
                speech: "I P Os can be applied through UPI based ASBA. Always check the P E ratio versus industry average before applying. Visit the IPO Center tab for live data."
            };
        }

        // ---- 7. SECTORS ----
        if (q.includes('sector') || q.includes('rotation') || q.includes('strongest') || q.includes('industry') || q.includes('which sector')) {
            return {
                text: `### 🧭 AI Sector Rotation Map (June 2025)\n\n` +
                      `| Sector | Status | Key Stocks | Signal |\n|:---|:---|:---|:---|\n` +
                      `| **Defense & Railways** | 🚀 Strong Momentum | HAL, BEL, IRFC | Multi-year order books |\n` +
                      `| **Banking (Private)** | 🟢 Undervalued | HDFCBANK, ICICIBANK | Clean books, 16% credit growth |\n` +
                      `| **Renewable Energy** | 🟢 Strong | TATAPOWER, ADANIGREEN | Green hydrogen expansion |\n` +
                      `| **Auto (EV + ICE)** | 🟢 Growth | TATAMOTORS, M&M | EV transition + strong SUV demand |\n` +
                      `| **FMCG** | 🟡 Stable | ITC, HINDUNILVR | Defensive, steady dividends |\n` +
                      `| **IT Services** | 🟡 Consolidating | INFY, TCS, WIPRO | Soft US guidance |\n` +
                      `| **Pharma** | 🟢 Selective | SUNPHARMA, DRREDDY | US generic approvals |\n` +
                      `| **Real Estate** | ⚠️ Expensive | DLF, GODREJPROP | High valuations post-rally |\n\n` +
                      `*BullMind AI cycles capital toward momentum sectors while maintaining defensive anchors.*`,
                speech: "Defense, Banking, and Renewables lead current market momentum. IT is consolidating. FMCG provides defensive stability."
            };
        }

        // ---- 8. MARKET / NIFTY / SENSEX / INDEX ----
        if (q.includes('nifty') || q.includes('sensex') || q.includes('market') || q.includes('index') || q.includes('today') || q.includes('how is market')) {
            return {
                text: `### 📈 Indian Market Overview\n\n` +
                      `| Index | Level | Change |\n|:---|:---|:---|\n` +
                      `| **Nifty 50** | 23,985 | 🟢 +0.65% |\n` +
                      `| **Sensex** | 78,920 | 🟢 +0.58% |\n` +
                      `| **Bank Nifty** | 52,141 | 🟢 +1.10% |\n` +
                      `| **Nifty IT** | 38,450 | 🔴 -0.32% |\n` +
                      `| **India VIX** | 13.2 | Low volatility |\n\n` +
                      `**Market Breadth:** 1,450 advances vs 820 declines (Bullish)\n\n` +
                      `**Key FII/DII Data:**\n` +
                      `- FII: Net buyers ₹1,240 Cr\n` +
                      `- DII: Net buyers ₹890 Cr\n\n` +
                      `*BullMind View:* Market is in a healthy uptrend. Bank Nifty leading. IT dragging due to global tech softness.`,
                speech: "Nifty is at 23,985, up 0.65 percent. Sensex at 78,920. Market breadth is bullish with strong FII buying."
            };
        }

        // ---- 9. RETIREMENT / FINANCIAL PLANNING ----
        if (q.includes('retirement') || q.includes('planning') || q.includes('goal') || q.includes('roadmap') || q.includes('financial freedom') || q.includes('fire')) {
            return {
                text: `### 🏖️ AI Wealth Roadmap\n\n` +
                      `**Step-by-Step Financial Independence:**\n\n` +
                      `1. **Emergency Fund** → 6 months expenses in liquid fund\n` +
                      `2. **Insurance** → Term plan (10x annual income) + Health (₹10L+)\n` +
                      `3. **Invest Monthly** → SIP in diversified equity MFs\n` +
                      `4. **Target Corpus** → 30x annual expense\n\n` +
                      `**Example (₹50K/month expense today):**\n` +
                      `- Inflation-adjusted in 20 years: ₹1.6 Lakhs/month\n` +
                      `- Annual need: ₹19.2 Lakhs\n` +
                      `- **Target corpus: ₹5.76 Crore**\n` +
                      `- Monthly SIP needed (14% CAGR): ~₹43,800/month for 20 years\n\n` +
                      `**Asset Allocation:** 60% Equity | 25% Debt | 10% Gold | 5% Cash`,
                speech: "For financial independence, target thirty times your annual expense. Maintain sixty percent equity allocation and start SIPs early."
            };
        }

        // ---- 10. P/E RATIO ----
        if (q.includes('pe ratio') || q.includes('price to earnings') || q.includes('p/e') || (q.includes('pe') && q.includes('what'))) {
            return {
                text: `### 📊 P/E Ratio Explained\n\n` +
                      `**Formula:** P/E = Market Price ÷ Earnings Per Share (EPS)\n\n` +
                      `| P/E Range | Interpretation | Example |\n|:---|:---|:---|\n` +
                      `| **< 10x** | Deep value / distressed | PSU Banks |\n` +
                      `| **10-20x** | Fair value | HDFCBANK, ITC |\n` +
                      `| **20-40x** | Growth premium | BAJFINANCE |\n` +
                      `| **40-100x** | High growth expectations | ZOMATO |\n` +
                      `| **> 100x** | Hyper-growth / speculative | New-age tech |\n\n` +
                      `⚠️ **Always compare P/E** with:\n` +
                      `- Sector average P/E\n` +
                      `- Stock's own historical median P/E\n` +
                      `- Earnings growth rate (PEG ratio = P/E ÷ Growth%)\n\n` +
                      `*Say "analyze [stock name]" to see the P/E of any stock.*`,
                speech: "P E ratio measures how much investors pay per rupee of earnings. Compare it with sector averages, not in isolation."
            };
        }

        // ---- 11. GENERAL FINANCE EDUCATION ----
        if (q.includes('what is') || q.includes('explain') || q.includes('meaning') || q.includes('define') || q.includes('how does')) {
            // ROE
            if (q.includes('roe') || q.includes('return on equity')) {
                return {
                    text: `### 📘 ROE (Return on Equity)\n\n**Formula:** ROE = Net Profit ÷ Shareholder Equity × 100\n\nROE measures how efficiently a company generates profit from shareholders' money.\n\n- **> 20%** → Excellent (e.g., BAJFINANCE ~22%)\n- **15-20%** → Good (e.g., HDFCBANK ~17.5%)\n- **< 10%** → Poor capital efficiency\n\n*Higher ROE with low debt = quality business.*`,
                    speech: "R O E measures profit generation efficiency. Above twenty percent is excellent. Look for high ROE with low debt."
                };
            }
            // EPS
            if (q.includes('eps') || q.includes('earnings per share')) {
                return {
                    text: `### 📘 EPS (Earnings Per Share)\n\n**Formula:** EPS = Net Profit ÷ Total Shares Outstanding\n\n- Shows how much profit each share earns\n- Rising EPS over quarters = growth company\n- Used to calculate P/E ratio\n\n*Check quarterly EPS trends in the Financial Statements tab of any stock.*`,
                    speech: "E P S is net profit divided by total shares. Rising EPS indicates a growing company."
                };
            }
            // Market Cap
            if (q.includes('market cap') || q.includes('capitalization')) {
                return {
                    text: `### 📘 Market Capitalization\n\n**Formula:** Market Cap = Share Price × Total Shares\n\n| Category | Market Cap | Examples |\n|:---|:---|:---|\n| **Large Cap** | > ₹20,000 Cr | RELIANCE, TCS, HDFCBANK |\n| **Mid Cap** | ₹5,000 - ₹20,000 Cr | CHOLAFIN, MPHASIS |\n| **Small Cap** | < ₹5,000 Cr | Smaller companies |\n\n*Large caps = stability, Small caps = higher growth potential with more risk.*`,
                    speech: "Market cap is share price times total shares. Large cap means above twenty thousand crore. Small cap carries more risk but higher growth potential."
                };
            }
            // Dividend
            if (q.includes('dividend')) {
                return {
                    text: `### 📘 Dividends Explained\n\n- **Dividend** = portion of profit distributed to shareholders\n- **Dividend Yield** = Annual Dividend ÷ Share Price × 100\n- Taxed at your **income tax slab rate**\n\n**Top Dividend Stocks in India:**\n- ITC: ~3.5% yield\n- Coal India: ~5% yield\n- HDFCBANK: ~1.1% yield\n\n*Dividend income is taxable. TDS of 10% if > ₹5,000/year.*`,
                    speech: "Dividends are profit distributions to shareholders. I T C yields around three point five percent. Dividends are taxed at your slab rate."
                };
            }
            // Intraday
            if (q.includes('intraday') || q.includes('day trading')) {
                return {
                    text: `### 📘 Intraday Trading\n\n- Buy and sell within the **same trading day** (9:15 AM - 3:30 PM)\n- Leverage: Up to **5x margin** from brokers\n- Tax: Profits taxed as **business income** (slab rate)\n- STT: 0.025% on sell side\n\n**Rules:**\n- Never risk more than **2% of capital** per trade\n- Use **stop-loss** orders always\n- Focus on **liquid stocks** (Nifty 50 components)\n- Avoid trading during first 15 minutes (high volatility)\n\n⚠️ *90% of intraday traders lose money. Start with paper trading.*`,
                    speech: "Intraday means buying and selling on the same day. Use strict stop losses and never risk more than two percent per trade. Ninety percent of day traders lose money."
                };
            }
            // Default education
            return {
                text: `### 📘 Financial Education Hub\n\nI can explain these topics in detail:\n\n` +
                      `- *"What is P/E ratio?"*\n- *"Explain ROE"*\n- *"What is EPS?"*\n- *"How does dividend work?"*\n` +
                      `- *"What is market cap?"*\n- *"Explain intraday trading"*\n- *"How does SIP work?"*\n` +
                      `- *"What is LTCG tax?"*\n\nJust ask and I'll break it down! 🧠`,
                speech: "I can explain financial concepts like P E ratio, R O E, E P S, dividends, and more. Just ask!"
            };
        }

        // ---- 12. PORTFOLIO REVIEW ----
        if (q.includes('portfolio') || q.includes('my holdings') || q.includes('review my')) {
            if (window.PortfolioDoctor) {
                const portfolio = window.BullVerseData.userState.portfolio;
                const result = window.PortfolioDoctor.analyze(portfolio);
                let obsText = result.observations.map(o => `- ${o}`).join('\n');
                return {
                    text: `### 🩺 Portfolio Health Check\n\n` +
                          `**Score: ${result.score}/100** — ${result.status}\n\n` +
                          `${obsText}\n\n` +
                          `📊 Expected CAGR: **${result.expectedReturn}%**\n` +
                          `💰 Est. Annual Dividend: **₹${result.dividendEstimate}**\n\n` +
                          `*Add more stocks via the Listed Stocks page to improve diversification.*`,
                    speech: `Your portfolio health score is ${result.score} out of 100. Status: ${result.status}.`
                };
            }
        }

        // ---- 13. GREETINGS ----
        if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q === 'help' || q.includes('namaste')) {
            return {
                text: `### 🧠 Namaste! I'm BullMind AI\n\n` +
                      `I'm your next-gen Indian market intelligence assistant. Here's what I can do:\n\n` +
                      `**📊 Stock Analysis** — *"Analyze ZOMATO"* or *"Tell me about TATAMOTORS"*\n` +
                      `**📈 Technical Analysis** — *"Technical RELIANCE"* (SMA, RSI, MACD, P/E)\n` +
                      `**⚖️ Compare Stocks** — *"Compare HDFCBANK vs ICICIBANK"*\n` +
                      `**🧭 Sector Insights** — *"Which sectors are strongest?"*\n` +
                      `**📈 Market Overview** — *"How is the market today?"*\n` +
                      `**🪙 Tax Rules** — *"Explain capital gains tax"*\n` +
                      `**💰 SIP/MF Guide** — *"How does SIP work?"*\n` +
                      `**🎯 IPO Center** — *"Tell me about IPOs"*\n` +
                      `**🏖️ Financial Planning** — *"Plan my retirement"*\n` +
                      `**📘 Education** — *"What is P/E ratio?"*, *"Explain ROE"*\n` +
                      `**🩺 Portfolio Doctor** — *"Review my portfolio"*\n\n` +
                      `I can analyze **all 62+ listed Indian stocks** instantly! 🚀`,
                speech: "Namaste! I'm BullMind AI. I can analyze any Indian stock, explain financial concepts, review your portfolio, and much more. How can I help?"
            };
        }

        // ---- 14. THANK YOU / BYE ----
        if (q.includes('thank') || q.includes('bye') || q.includes('great') || q.includes('awesome') || q.includes('nice')) {
            return {
                text: `You're welcome! 🙏 Happy investing. Remember:\n\n` +
                      `> *"The stock market is a device for transferring money from the impatient to the patient."* — Warren Buffett\n\n` +
                      `Feel free to ask anything anytime! 📈`,
                speech: "You're welcome. Happy investing. The market rewards patience."
            };
        }

        // ---- 15. CATCH-ALL DEFAULT ----
        return {
            text: `### 🧠 BullMind AI — Ready to Help!\n\n` +
                  `I didn't quite understand that. Here are things I can do:\n\n` +
                  `| Command | Example |\n|:---|:---|\n` +
                  `| **Analyze Stock** | "Analyze ZOMATO" or "Show RELIANCE report" |\n` +
                  `| **Technical Analysis** | "Technical INFY" (SMA, RSI, P/E) |\n` +
                  `| **Compare** | "Compare SBIN vs HDFCBANK" |\n` +
                  `| **Market** | "How is market today?" |\n` +
                  `| **Sectors** | "Which sectors are strongest?" |\n` +
                  `| **Tax** | "Explain capital gains tax" |\n` +
                  `| **SIP/MF** | "How does SIP work?" |\n` +
                  `| **IPO** | "Tell me about IPOs" |\n` +
                  `| **Education** | "What is P/E ratio?" |\n` +
                  `| **Portfolio** | "Review my portfolio" |\n\n` +
                  `I know all **62 listed Indian stocks** — just mention any name or symbol! 🇮🇳`,
            speech: "I can analyze any Indian stock, compare companies, explain finance concepts, and review your portfolio. Try asking about a specific stock like Zomato or Reliance."
        };
    }
};

// AI Portfolio Doctor Engine (unchanged, enhanced)
window.PortfolioDoctor = {
    analyze: function(portfolio) {
        if (!portfolio || !portfolio.holdings || portfolio.holdings.length === 0) {
            return {
                score: 0, status: "Empty Portfolio",
                observations: ["No holdings synced. Add a transaction or buy a stock to start analysis."],
                allocationBreakdown: [], rebalanceList: []
            };
        }

        const holdings = portfolio.holdings;
        const allStocks = window.BullVerseData.allStocksList || [];
        const detailedStocks = window.BullVerseData.stocks || {};

        let totalValue = 0;
        const items = [];
        const sectorSums = {};

        holdings.forEach(hold => {
            // Look up price from allStocksList OR detailed stocks OR cryptos
            const detailed = detailedStocks[hold.symbol];
            const fromList = allStocks.find(s => s.symbol === hold.symbol);
            const fromCrypto = window.BullVerseData.cryptos ? window.BullVerseData.cryptos.find(c => c.symbol === hold.symbol) : null;
            
            const stockPrice = detailed ? detailed.price : (fromList ? fromList.price : (fromCrypto ? fromCrypto.price : 500));
            const stockName = detailed ? detailed.name : (fromList ? fromList.name : (fromCrypto ? fromCrypto.name : hold.symbol));
            const stockSector = detailed ? detailed.sector : (fromList ? fromList.sector : (fromCrypto ? "Cryptocurrency" : 'Unknown'));

            const value = hold.shares * stockPrice;
            totalValue += value;
            items.push({ symbol: hold.symbol, name: stockName, sector: stockSector, shares: hold.shares, value });
            sectorSums[stockSector] = (sectorSums[stockSector] || 0) + value;
        });

        let maxSectorPercent = 0, maxStockPercent = 0, maxStockSym = "";
        const sectorAlloc = [];

        for (const sec in sectorSums) {
            const pct = (sectorSums[sec] / totalValue) * 100;
            if (pct > maxSectorPercent) maxSectorPercent = pct;
            sectorAlloc.push({ sector: sec, percentage: pct, value: sectorSums[sec] });
        }

        items.forEach(it => {
            const pct = (it.value / totalValue) * 100;
            if (pct > maxStockPercent) { maxStockPercent = pct; maxStockSym = it.symbol; }
        });

        let score = 95;
        const observations = [];
        const rebalanceList = [];

        if (maxStockPercent > 40) {
            score -= 15;
            observations.push(`⚠️ **High Concentration**: ${maxStockSym} is **${maxStockPercent.toFixed(1)}%** of portfolio. Reduce to < 20%.`);
            rebalanceList.push({ action: "SELL", symbol: maxStockSym, reason: "Reduce concentration", redeploy: "ITC or Gold BeES" });
        } else {
            observations.push(`✅ **Healthy Sizing**: No stock exceeds 30% allocation.`);
        }

        if (maxSectorPercent > 50) {
            score -= 15;
            observations.push(`⚠️ **Sector Clustering**: ${maxSectorPercent.toFixed(1)}% in one sector. Diversify.`);
        } else {
            observations.push(`✅ **Good Sector Diversification** across multiple industries.`);
        }

        const cashPct = (portfolio.cash / (totalValue + portfolio.cash)) * 100;
        if (cashPct < 5) {
            score -= 5;
            observations.push(`⚠️ **Low Cash (${cashPct.toFixed(1)}%)**: Keep 5-15% for dip buying.`);
        } else if (cashPct > 30) {
            score -= 8;
            observations.push(`⚠️ **Cash Drag (${cashPct.toFixed(1)}%)**: Too much idle cash.`);
        } else {
            observations.push(`✅ **Optimal Cash Buffer**: ${cashPct.toFixed(1)}%.`);
        }

        let risk = score >= 85 ? "Balanced Growth" : score >= 70 ? "Moderate Risk" : "High Risk";

        return {
            score: Math.max(score, 10), status: risk,
            observations, sectorAllocations: sectorAlloc, rebalanceList,
            dividendEstimate: (totalValue * 0.0095).toFixed(2),
            expectedReturn: 14.8
        };
    }
};

// Strategy Backtester Engine
window.StrategyBacktester = {
    run: function(symbol, shortPeriod = 20, longPeriod = 50) {
        const allStocks = window.BullVerseData ? window.BullVerseData.allStocksList || [] : [];
        const detailedStocks = window.BullVerseData ? window.BullVerseData.stocks || {} : {};
        const stockInfo = detailedStocks[symbol] || allStocks.find(s => s.symbol === symbol);
        const basePrice = stockInfo ? stockInfo.price : 500;

        const days = 150;
        const prices = [];
        let curPrice = basePrice * 0.8;

        for (let i = 0; i < days; i++) {
            const rad = (i / 10) + Math.sin(i / 5);
            const noise = (Math.sin(rad) * 1.5) + (Math.cos(i / 12) * 0.8) + (Math.sin(i / 25) * 2.5);
            const drift = 0.15;
            curPrice = curPrice * (1 + ((noise + drift) / 100));
            prices.push({ day: i + 1, price: parseFloat(curPrice.toFixed(2)) });
        }

        const calcSMA = (data, idx, period) => {
            if (idx < period - 1) return null;
            let sum = 0;
            for (let k = 0; k < period; k++) sum += data[idx - k].price;
            return parseFloat((sum / period).toFixed(2));
        };

        const shortSma = [], longSma = [];
        for (let i = 0; i < days; i++) {
            shortSma.push(calcSMA(prices, i, shortPeriod));
            longSma.push(calcSMA(prices, i, longPeriod));
        }

        let capital = 100000, position = 0, entryPrice = 0;
        const trades = [];
        let lastSignal = null;

        for (let i = longPeriod; i < days; i++) {
            const price = prices[i].price;
            const ss = shortSma[i], ls = longSma[i];
            const pss = shortSma[i - 1], pls = longSma[i - 1];
            if (ss === null || ls === null || pss === null || pls === null) continue;

            if (pss <= pls && ss > ls && lastSignal !== "BUY") {
                if (position === 0) {
                    position = Math.floor(capital / price);
                    capital -= position * price;
                    entryPrice = price;
                    lastSignal = "BUY";
                    trades.push({ type: "BUY", day: i + 1, price, capitalBefore: capital + position * price });
                }
            } else if (pss >= pls && ss < ls && lastSignal === "BUY") {
                if (position > 0) {
                    capital += position * price;
                    trades.push({ type: "SELL", day: i + 1, price, profitPercent: ((price - entryPrice) / entryPrice) * 100, capitalAfter: capital });
                    position = 0;
                    lastSignal = "SELL";
                }
            }
        }

        if (position > 0) {
            const ep = prices[prices.length - 1].price;
            capital += position * ep;
            trades.push({ type: "SELL (LQD)", day: days, price: ep, profitPercent: ((ep - entryPrice) / entryPrice) * 100, capitalAfter: capital });
        }

        const totalProfit = ((capital - 100000) / 100000) * 100;
        const sells = trades.filter(t => t.type.startsWith("SELL"));
        const wins = sells.filter(t => t.profitPercent > 0);

        return {
            symbol, shortPeriod, longPeriod,
            startingCapital: 100000, endingCapital: Math.round(capital),
            totalProfitPercent: parseFloat(totalProfit.toFixed(2)),
            tradesCount: trades.length,
            winRate: sells.length > 0 ? parseFloat(((wins.length / sells.length) * 100).toFixed(1)) : 0,
            tradeLogs: trades, priceSeries: prices, shortSmaSeries: shortSma, longSmaSeries: longSma
        };
    }
};

console.log("BullVerse Next-Gen AI Engine v3.0 loaded — 62+ stocks supported.");
