// BullVerse India Portfolio & Advanced Calculators Engine

window.FinanceCalculators = {
    // 1. SIP (Systematic Investment Plan) Calculator
    calculateSIP: function(monthlyInvest, ratePercent, years) {
        const P = parseFloat(monthlyInvest);
        const i = parseFloat(ratePercent) / 12 / 100;
        const n = parseFloat(years) * 12;
        
        // Formula: M = P * [((1 + i)^n - 1) / i] * (1 + i)
        const futureValue = P * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
        const totalInvested = P * n;
        const wealthGained = futureValue - totalInvested;

        return {
            invested: Math.round(totalInvested),
            futureValue: Math.round(futureValue),
            gain: Math.round(wealthGained)
        };
    },

    // 2. SWP (Systematic Withdrawal Plan) Calculator
    calculateSWP: function(initialAmount, monthlyWithdrawal, ratePercent, years) {
        let balance = parseFloat(initialAmount);
        const W = parseFloat(monthlyWithdrawal);
        const r = parseFloat(ratePercent) / 12 / 100;
        const totalMonths = parseFloat(years) * 12;
        
        let totalWithdrawn = 0;
        
        for (let m = 0; m < totalMonths; m++) {
            if (balance < W) {
                totalWithdrawn += balance;
                balance = 0;
                break;
            }
            balance -= W;
            balance += (balance * r);
            totalWithdrawn += W;
        }

        return {
            invested: Math.round(initialAmount),
            totalWithdrawn: Math.round(totalWithdrawn),
            finalBalance: Math.round(balance)
        };
    },

    // 3. CAGR (Compound Annual Growth Rate) Calculator
    calculateCAGR: function(initialValue, finalValue, years) {
        const init = parseFloat(initialValue);
        const fin = parseFloat(finalValue);
        const t = parseFloat(years);
        
        // Formula: CAGR = (Final / Initial) ^ (1 / t) - 1
        const cagr = (Math.pow((fin / init), (1 / t)) - 1) * 100;
        
        return {
            cagr: parseFloat(cagr.toFixed(2))
        };
    },

    // 4. Brokerage & SEBI Charges Calculator (NSE/BSE Delivery vs Intraday)
    calculateBrokerage: function(buyPrice, sellPrice, shares, isIntraday = false) {
        const buyVal = parseFloat(buyPrice) * parseFloat(shares);
        const sellVal = parseFloat(sellPrice) * parseFloat(shares);
        const turnover = buyVal + sellVal;
        
        // Delivery Brokerage is flat ₹20 or 0.03% (whichever is lower). Intraday is ₹20 or 0.03%
        const rate = isIntraday ? 0.0003 : 0.001; // Intraday vs Delivery rate
        const rawBrokerage = Math.min(20, buyVal * rate) + Math.min(20, sellVal * rate);
        
        // Government Taxes
        // STT (Securities Transaction Tax): 0.1% on delivery (both buy & sell), 0.025% on sell for intraday
        const stt = isIntraday ? (sellVal * 0.00025) : (turnover * 0.001);
        
        // Exchange Transaction Charge: ~0.00322% on NSE
        const exchangeCharge = turnover * 0.0000322;
        
        // SEBI turnover fee: 0.0001% (₹10 / Crore)
        const sebiFee = turnover * 0.000001;
        
        // Stamp Duty: 0.015% on buy (delivery), 0.003% on buy (intraday)
        const stampDuty = buyVal * (isIntraday ? 0.00003 : 0.00015);
        
        // GST: 18% on (Brokerage + Exchange Charge + SEBI Fee)
        const gst = (rawBrokerage + exchangeCharge + sebiFee) * 0.18;
        
        const totalCharges = rawBrokerage + stt + exchangeCharge + sebiFee + stampDuty + gst;
        const netProfitLoss = (sellVal - buyVal) - totalCharges;

        return {
            turnover: Math.round(turnover),
            brokerage: parseFloat(rawBrokerage.toFixed(2)),
            stt: parseFloat(stt.toFixed(2)),
            exchangeCharges: parseFloat(exchangeCharge.toFixed(2)),
            gst: parseFloat(gst.toFixed(2)),
            stampDuty: parseFloat(stampDuty.toFixed(2)),
            sebiFee: parseFloat(sebiFee.toFixed(2)),
            totalCharges: parseFloat(totalCharges.toFixed(2)),
            netProfit: parseFloat(netProfitLoss.toFixed(2))
        };
    },

    // 5. Tax (Capital Gains) Calculator
    calculateTax: function(buyValue, sellValue, monthsHeld) {
        const buyVal = parseFloat(buyValue);
        const sellVal = parseFloat(sellValue);
        const profit = sellVal - buyVal;
        
        if (profit <= 0) {
            return {
                profit: Math.round(profit),
                taxType: "No Gains",
                taxRate: 0,
                taxLiability: 0
            };
        }

        let taxType = "";
        let rate = 0;
        let taxLiability = 0;

        if (monthsHeld <= 12) {
            taxType = "Short Term Capital Gains (STCG)";
            rate = 20; // 20% STCG
            taxLiability = profit * 0.20;
        } else {
            taxType = "Long Term Capital Gains (LTCG)";
            rate = 12.5; // 12.5% LTCG
            // LTCG has a yearly exemption of 1.25 Lakhs, we simulate simple liability
            const taxableProfit = Math.max(0, profit - 125000);
            taxLiability = taxableProfit * 0.125;
        }

        return {
            profit: Math.round(profit),
            taxType: taxType,
            taxRate: rate,
            taxLiability: Math.round(taxLiability)
        };
    }
};

// 6. User Portfolio Transaction & Rebalancing Logic
window.PortfolioManager = {
    addTransaction: function(type, symbol, shares, price) {
        const uState = window.BullVerseData.userState.portfolio;
        const totalCost = shares * price;
        
        if (type === "BUY") {
            let availableMargin = uState.cash + 285000;
            const dashAvailEl = document.getElementById("lim-avail-margin");
            if (dashAvailEl) {
                availableMargin = parseFloat(dashAvailEl.textContent.replace(/[₹,]/g, "")) || availableMargin;
            }

            if (availableMargin < totalCost) {
                return { success: false, msg: `Insufficient cash balance. You need ₹${totalCost.toLocaleString('en-IN')} but only have ₹${availableMargin.toLocaleString('en-IN')}.` };
            }
            
            // Deduct cash
            uState.cash -= totalCost;
            
            // Sync Dashboard Elements
            if (dashAvailEl) {
                dashAvailEl.textContent = "₹" + (availableMargin - totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            
            const dashCashEl = document.getElementById("lim-cash-bal");
            if (dashCashEl) {
                const currentCash = parseFloat(dashCashEl.textContent.replace(/[₹,]/g, "")) || (uState.cash + totalCost);
                const newCash = currentCash - totalCost;
                dashCashEl.textContent = "₹" + newCash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                const dashMarginUsedEl = document.getElementById("lim-margin-used");
                if (dashMarginUsedEl) {
                     const marginUsed = newCash < 0 ? Math.abs(newCash) : 0;
                     dashMarginUsedEl.innerHTML = `₹${marginUsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="text-[10px] text-gray-500 font-normal">(${(marginUsed/285000*100).toFixed(1)}%)</span>`;
                }
            }
            
            // Add/Update Holdings
            const existing = uState.holdings.find(h => h.symbol === symbol);
            if (existing) {
                const oldTotalVal = existing.shares * existing.avgCost;
                const newTotalVal = oldTotalVal + totalCost;
                existing.shares += shares;
                existing.avgCost = parseFloat((newTotalVal / existing.shares).toFixed(2));
            } else {
                uState.holdings.push({
                    symbol: symbol,
                    shares: shares,
                    avgCost: parseFloat(price.toFixed(2))
                });
            }
            
            // Log Transaction
            uState.transactions.unshift({
                date: new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}),
                type: "BUY",
                symbol: symbol,
                shares: shares,
                price: price
            });
            
            return { success: true, msg: `Successfully bought ${shares} shares of ${symbol} at ₹${price}.` };
            
        } else if (type === "SELL") {
            const existing = uState.holdings.find(h => h.symbol === symbol);
            if (!existing || existing.shares < shares) {
                return { success: false, msg: `Insufficient holdings. You only hold ${existing ? existing.shares : 0} shares of ${symbol}.` };
            }
            
            // Add Cash
            uState.cash += totalCost;
            
            // Sync Dashboard Elements
            const dashAvailEl = document.getElementById("lim-avail-margin");
            if (dashAvailEl) {
                const currentAvail = parseFloat(dashAvailEl.textContent.replace(/[₹,]/g, "")) || 0;
                dashAvailEl.textContent = "₹" + (currentAvail + totalCost).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
            }
            const dashCashEl = document.getElementById("lim-cash-bal");
            if (dashCashEl) {
                const currentCash = parseFloat(dashCashEl.textContent.replace(/[₹,]/g, "")) || (uState.cash - totalCost);
                const newCash = currentCash + totalCost;
                dashCashEl.textContent = "₹" + newCash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                const dashMarginUsedEl = document.getElementById("lim-margin-used");
                if (dashMarginUsedEl) {
                     const marginUsed = newCash < 0 ? Math.abs(newCash) : 0;
                     dashMarginUsedEl.innerHTML = `₹${marginUsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="text-[10px] text-gray-500 font-normal">(${(marginUsed/285000*100).toFixed(1)}%)</span>`;
                }
            }
            
            // Reduce/Remove Holding
            existing.shares -= shares;
            if (existing.shares === 0) {
                uState.holdings = uState.holdings.filter(h => h.symbol !== symbol);
            }
            
            // Log Transaction
            uState.transactions.unshift({
                date: new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'}),
                type: "SELL",
                symbol: symbol,
                shares: shares,
                price: price
            });
            
            return { success: true, msg: `Successfully sold ${shares} shares of ${symbol} at ₹${price}.` };
        }
        
        return { success: false, msg: "Invalid Transaction Type" };
    },

    // Refresh overall numbers
    getSummary: function() {
        const uState = window.BullVerseData.userState.portfolio;
        const stocks = window.BullVerseData.stocks;
        
        let totalInvested = 0;
        let currentValue = 0;
        
        uState.holdings.forEach(hold => {
            const fromList = window.BullVerseData.allStocksList.find(s => s.symbol === hold.symbol);
            const fromCrypto = window.BullVerseData.cryptos ? window.BullVerseData.cryptos.find(c => c.symbol === hold.symbol) : null;
            const fromMF = window.BullVerseData.mutualFunds ? window.BullVerseData.mutualFunds.find(m => m.id === hold.symbol) : null;
            const fromETF = window.BullVerseData.etfs ? window.BullVerseData.etfs.find(e => e.symbol === hold.symbol) : null;
            
            let price = hold.avgCost;
            if (stocks[hold.symbol]) price = stocks[hold.symbol].price;
            else if (fromList) price = fromList.price;
            else if (fromCrypto) price = fromCrypto.price;
            else if (fromMF) price = fromMF.nav;
            else if (fromETF) price = fromETF.price;

            totalInvested += hold.shares * hold.avgCost;
            currentValue += hold.shares * price;
        });
        
        const profit = currentValue - totalInvested;
        const profitPercent = totalInvested > 0 ? (profit / totalInvested) * 100 : 0;
        const totalPortfolioValue = currentValue + uState.cash;
        
        return {
            cash: uState.cash,
            investedValue: totalInvested,
            holdingsValue: currentValue,
            totalValue: totalPortfolioValue,
            profit: profit,
            profitPercent: profitPercent
        };
    }
};

console.log("BullVerse calculators and transactions registered successfully.");
