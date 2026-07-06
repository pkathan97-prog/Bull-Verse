// BullVerse India Custom Canvas Chart Engine & TradingView Embed

window.BullVerseCharts = {
    // 1. Generate realistic chart data points based on time range
    generatePriceData: function(symbol, range) {
        const stocks = window.BullVerseData.stocks;
        const baseStock = stocks[symbol] || { price: 500, prevClose: 495 };
        const currentPrice = baseStock.price;

        let pointsCount = 30; // default 1 Month
        let drift = 0.02; // general growth bias
        let volatility = 1.5;

        switch(range) {
            case "1D":
                pointsCount = 48; // 15-min intervals during trading day
                volatility = 0.4;
                drift = 0.005;
                break;
            case "5D":
                pointsCount = 35;
                volatility = 0.8;
                drift = 0.01;
                break;
            case "1M":
                pointsCount = 30;
                volatility = 1.5;
                drift = 0.05;
                break;
            case "6M":
                pointsCount = 120;
                volatility = 2.5;
                drift = 0.15;
                break;
            case "1Y":
                pointsCount = 180;
                volatility = 3.5;
                drift = 0.3;
                break;
            case "5Y":
                pointsCount = 260; // weekly for 5 years
                volatility = 8.0;
                drift = 1.2;
                break;
            case "MAX":
                pointsCount = 350;
                volatility = 12.0;
                drift = 2.5;
                break;
        }

        const data = [];
        let price = currentPrice * 0.9; // start slightly lower

        // Seed date
        let currentDate = new Date();
        currentDate.setDate(currentDate.getDate() - pointsCount);

        for (let i = 0; i < pointsCount; i++) {
            const dateStr = currentDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
            
            // Generate standard candlestick values
            const noise = (Math.random() - 0.45) * volatility;
            const change = price * (noise / 100) + drift;
            
            const open = price;
            const close = price + change;
            const high = Math.max(open, close) + (Math.random() * (price * 0.008));
            const low = Math.min(open, close) - (Math.random() * (price * 0.008));
            const volume = Math.round(50000 + Math.random() * 200000);
            
            data.push({
                date: dateStr,
                open: parseFloat(open.toFixed(2)),
                high: parseFloat(high.toFixed(2)),
                low: parseFloat(low.toFixed(2)),
                close: parseFloat(close.toFixed(2)),
                volume: volume
            });
            
            price = close;
            currentDate.setDate(currentDate.getDate() + 1);
        }

        // Make the final element exactly equal the current market price for consistency
        data[data.length - 1].close = currentPrice;
        return data;
    },

    // 2. Main HTML5 Canvas Chart Drawing Method
    renderChart: function(canvasId, symbol, chartType = "area", range = "1M", activeIndicators = {}, onHoverCallback) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        
        // Handle high DPI retina screens
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const width = rect.width;
        const height = rect.height;

        // Load or generate prices
        const prices = this.generatePriceData(symbol, range);
        if (prices.length === 0) return;

        // Reserve bottom height if RSI or MACD are checked
        let mainChartHeight = height - 40; // reserve space for dates
        let subChartHeight = 0;
        let subChartTop = height;

        if (activeIndicators.RSI || activeIndicators.MACD) {
            subChartHeight = 70;
            mainChartHeight = height - subChartHeight - 50;
            subChartTop = mainChartHeight + 15;
        }

        // Calculate extremes
        let minPrice = Infinity;
        let maxPrice = -Infinity;
        let maxVolume = 0;

        prices.forEach(p => {
            if (p.low < minPrice) minPrice = p.low;
            if (p.high > maxPrice) maxPrice = p.high;
            if (p.volume > maxVolume) maxVolume = p.volume;
        });

        // Add 5% padding to top & bottom of chart margins
        const padding = (maxPrice - minPrice) * 0.05 || 10;
        maxPrice += padding;
        minPrice -= padding;

        const priceRange = maxPrice - minPrice;

        // Clear canvas with a premium dark gradient
        const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bgGrad.addColorStop(0, "#08080a");
        bgGrad.addColorStop(1, "#121216");
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, width, height);

        // Draw horizontal gridlines & prices (dashed for elegance)
        ctx.strokeStyle = "rgba(255, 255, 255, 0.04)";
        ctx.lineWidth = 1;
        ctx.fillStyle = "#a1a1aa"; // lighter gray font for premium readability
        ctx.font = "500 10px Inter, sans-serif";
        ctx.textAlign = "right";

        const gridLinesCount = 5;
        ctx.setLineDash([4, 4]); // dashed grid lines
        for (let i = 0; i <= gridLinesCount; i++) {
            const val = minPrice + (priceRange * (i / gridLinesCount));
            const y = mainChartHeight - (mainChartHeight * (i / gridLinesCount)) + 10;
            
            // Grid Line
            ctx.beginPath();
            ctx.moveTo(10, y);
            ctx.lineTo(width - 60, y);
            ctx.stroke();

            // Label
            ctx.setLineDash([]); // temporarily clear dash to draw text cleanly
            ctx.fillText(Math.round(val).toLocaleString('en-IN'), width - 10, y + 3);
            ctx.setLineDash([4, 4]); // reset back
        }
        ctx.setLineDash([]); // clear dash

        // Calculate coordinates for points
        const count = prices.length;
        const xStep = (width - 75) / (count - 1);
        const getX = (idx) => 15 + idx * xStep;
        const getY = (priceVal) => mainChartHeight - ((priceVal - minPrice) / priceRange) * mainChartHeight + 10;

        // Determine stock trend (Up = Bullish Green, Down = Bearish Red)
        const isTrendUp = prices[prices.length - 1].close >= prices[0].close;
        const trendColor = isTrendUp ? "#10b981" : "#ef4444";
        const trendGlow = isTrendUp ? "rgba(16, 185, 129, 0.35)" : "rgba(239, 68, 68, 0.35)";
        const trendFillStart = isTrendUp ? "rgba(16, 185, 129, 0.22)" : "rgba(239, 68, 68, 0.22)";

        // Draw Latest Price reference line (dotted)
        const latestPrice = prices[prices.length - 1].close;
        const latestY = getY(latestPrice);
        ctx.strokeStyle = isTrendUp ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.15)";
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 4]);
        ctx.beginPath();
        ctx.moveTo(15, latestY);
        ctx.lineTo(width - 60, latestY);
        ctx.stroke();
        ctx.setLineDash([]); // reset

        // Calculate technical indicators (SMA, EMA, VWAP, Bollinger Bands)
        const getSMA = (idx, period) => {
            if (idx < period - 1) return null;
            let sum = 0;
            for (let j = 0; j < period; j++) sum += prices[idx - j].close;
            return sum / period;
        };

        const getEMA = (idx, period) => {
            if (idx === 0) return prices[0].close;
            const k = 2 / (period + 1);
            let ema = prices[0].close;
            for (let j = 1; j <= idx; j++) {
                ema = prices[j].close * k + ema * (1 - k);
            }
            return ema;
        };

        // Draw Bollinger Bands (underlay)
        if (activeIndicators.BollingerBands) {
            ctx.fillStyle = "rgba(59, 130, 246, 0.04)";
            ctx.strokeStyle = "rgba(59, 130, 246, 0.20)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            // Upper line
            for (let i = 0; i < count; i++) {
                const basis = getSMA(i, 20) || prices[i].close;
                const dev = prices[i].close * 0.03;
                const upper = basis + dev * 2;
                if (i === 0) ctx.moveTo(getX(i), getY(upper));
                else ctx.lineTo(getX(i), getY(upper));
            }
            // Lower line going backward for fill
            for (let i = count - 1; i >= 0; i--) {
                const basis = getSMA(i, 20) || prices[i].close;
                const dev = prices[i].close * 0.03;
                const lower = basis - dev * 2;
                ctx.lineTo(getX(i), getY(lower));
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        }

        // Draw volume bars (faded at bottom of main chart)
        prices.forEach((p, idx) => {
            const x = getX(idx);
            const vHeight = (p.volume / maxVolume) * (mainChartHeight * 0.16);
            const y = mainChartHeight + 10 - vHeight;
            
            ctx.fillStyle = p.close >= p.open ? "rgba(16, 185, 129, 0.12)" : "rgba(239, 68, 68, 0.12)";
            ctx.fillRect(x - xStep/3, y, Math.max(2, xStep * 0.55), vHeight);
        });

        // 3. Render Price graph (Line / Area / Candlesticks)
        if (chartType === "line" || chartType === "area") {
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(prices[0].close));
            for (let i = 1; i < count; i++) {
                ctx.lineTo(getX(i), getY(prices[i].close));
            }
            
            ctx.strokeStyle = trendColor; // Dynamic Accent color
            ctx.lineWidth = 2.5;
            ctx.shadowColor = trendGlow;
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0; // reset

            if (chartType === "area") {
                ctx.lineTo(getX(count - 1), mainChartHeight + 10);
                ctx.lineTo(getX(0), mainChartHeight + 10);
                ctx.closePath();
                
                const grad = ctx.createLinearGradient(0, 0, 0, mainChartHeight + 10);
                grad.addColorStop(0, trendFillStart);
                grad.addColorStop(1, "rgba(0, 0, 0, 0)");
                ctx.fillStyle = grad;
                ctx.fill();
            }
        } 
        else if (chartType === "candlestick") {
            prices.forEach((p, idx) => {
                const x = getX(idx);
                const yOpen = getY(p.open);
                const yClose = getY(p.close);
                const yHigh = getY(p.high);
                const yLow = getY(p.low);

                const isBullish = p.close >= p.open;
                ctx.strokeStyle = isBullish ? "#10b981" : "#ef4444";
                ctx.fillStyle = isBullish ? "#10b981" : "#ef4444";
                ctx.lineWidth = 1.2;

                // Draw Wick
                ctx.beginPath();
                ctx.moveTo(x, yHigh);
                ctx.lineTo(x, yLow);
                ctx.stroke();

                // Draw body with slight shadow glow for bullish candles
                const bodyW = Math.max(3, xStep * 0.55);
                const bodyH = Math.max(1.5, Math.abs(yClose - yOpen));
                ctx.fillRect(x - bodyW/2, Math.min(yOpen, yClose), bodyW, bodyH);
            });
        }

        // Draw Indicators Overlays
        if (activeIndicators.SMA) {
            ctx.beginPath();
            let started = false;
            for (let i = 0; i < count; i++) {
                const val = getSMA(i, 20);
                if (val !== null) {
                    if (!started) { ctx.moveTo(getX(i), getY(val)); started = true; }
                    else ctx.lineTo(getX(i), getY(val));
                }
            }
            ctx.strokeStyle = "#f59e0b"; // Orange SMA
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        if (activeIndicators.EMA) {
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(prices[0].close));
            for (let i = 1; i < count; i++) {
                const val = getEMA(i, 20);
                ctx.lineTo(getX(i), getY(val));
            }
            ctx.strokeStyle = "#ec4899"; // Pink EMA
            ctx.lineWidth = 1.5;
            ctx.stroke();
        }

        if (activeIndicators.VWAP) {
            ctx.beginPath();
            ctx.moveTo(getX(0), getY(prices[0].close));
            for (let i = 1; i < count; i++) {
                // VWAP simulated logic
                const sumPV = prices.slice(0, i+1).reduce((acc, curr) => acc + (curr.close * curr.volume), 0);
                const sumV = prices.slice(0, i+1).reduce((acc, curr) => acc + curr.volume, 0);
                const vwap = sumPV / sumV;
                ctx.lineTo(getX(i), getY(vwap));
            }
            ctx.strokeStyle = "#8b5cf6"; // Purple VWAP
            ctx.lineWidth = 1.2;
            ctx.setLineDash([3, 3]);
            ctx.stroke();
            ctx.setLineDash([]); // Reset dash
        }

        // 4. Render Dates on X-axis
        ctx.fillStyle = "#52525b";
        ctx.font = "9px Inter";
        ctx.textAlign = "center";
        const dateInterval = Math.max(1, Math.round(count / 6));
        prices.forEach((p, idx) => {
            if (idx % dateInterval === 0) {
                ctx.fillText(p.date, getX(idx), mainChartHeight + 25);
            }
        });

        // 5. Draw Sub-chart (RSI / MACD)
        if (subChartHeight > 0) {
            // Draw Sub-chart background
            ctx.fillStyle = "#09090b";
            ctx.fillRect(10, subChartTop, width - 65, subChartHeight);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.strokeRect(10, subChartTop, width - 65, subChartHeight);

            if (activeIndicators.RSI) {
                // Draw 30 / 70 guidelines
                const rsiY = (rsiVal) => subChartTop + subChartHeight - (rsiVal / 100) * subChartHeight;
                ctx.strokeStyle = "rgba(239, 68, 68, 0.2)";
                ctx.setLineDash([2, 2]);
                ctx.beginPath();
                ctx.moveTo(10, rsiY(70)); ctx.lineTo(width - 55, rsiY(70));
                ctx.moveTo(10, rsiY(30)); ctx.lineTo(width - 55, rsiY(30));
                ctx.stroke();
                ctx.setLineDash([]);
                ctx.fillStyle = "#ef4444";
                ctx.fillText("70", width - 40, rsiY(70) + 3);
                ctx.fillText("30", width - 40, rsiY(30) + 3);

                // Draw mock RSI oscillating line
                ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    // Generate pseudo RSI values from closing prices relative to prevClose
                    const val = 40 + Math.sin(i / 4) * 20 + (prices[i].close / maxPrice) * 15;
                    if (i === 0) ctx.moveTo(getX(i), rsiY(val));
                    else ctx.lineTo(getX(i), rsiY(val));
                }
                ctx.strokeStyle = "#8b5cf6"; // Purple RSI line
                ctx.lineWidth = 1.2;
                ctx.stroke();
            } 
            else if (activeIndicators.MACD) {
                const macdY = (macdVal) => subChartTop + subChartHeight/2 - macdVal * 5;
                // Draw MACD Line & Signal Line
                ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    const macd = Math.sin(i / 5) * 4 + Math.cos(i / 10) * 2;
                    if (i === 0) ctx.moveTo(getX(i), macdY(macd));
                    else ctx.lineTo(getX(i), macdY(macd));
                }
                ctx.strokeStyle = "#3b82f6";
                ctx.lineWidth = 1.2;
                ctx.stroke();

                ctx.beginPath();
                for (let i = 0; i < count; i++) {
                    const signal = Math.sin(i / 5 - 0.5) * 3.5 + Math.cos(i / 10 - 0.2) * 1.8;
                    if (i === 0) ctx.moveTo(getX(i), macdY(signal));
                    else ctx.lineTo(getX(i), macdY(signal));
                }
                ctx.strokeStyle = "#f59e0b";
                ctx.lineWidth = 1.2;
                ctx.stroke();
            }
        }

        // 6. Hook mouse movements for Crosshair & tooltip
        canvas.removeEventListener("mousemove", canvas._mouseMoveHandler);
        
        const mouseMoveHandler = (e) => {
            const bounds = canvas.getBoundingClientRect();
            const mouseX = e.clientX - bounds.left;
            const mouseY = e.clientY - bounds.top;

            // Find nearest point index
            let nearestIdx = 0;
            let minDist = Infinity;
            for (let i = 0; i < count; i++) {
                const dist = Math.abs(getX(i) - mouseX);
                if (dist < minDist) {
                    minDist = dist;
                    nearestIdx = i;
                }
            }

            // Draw clean overlay canvas logic or pass details
            const hoveredPoint = prices[nearestIdx];
            
            // Re-render chart to clear previous crosshairs
            this.renderChart(canvasId, symbol, chartType, range, activeIndicators);

            // Draw Crosshair Lines on current context
            const ctx2 = canvas.getContext("2d");
            ctx2.strokeStyle = "rgba(255, 255, 255, 0.18)";
            ctx2.lineWidth = 0.8;
            ctx2.setLineDash([4, 4]);

            // Vertical line
            ctx2.beginPath();
            ctx2.moveTo(getX(nearestIdx), 10);
            ctx2.lineTo(getX(nearestIdx), mainChartHeight + 10);
            ctx2.stroke();

            // Horizontal line
            ctx2.beginPath();
            ctx2.moveTo(15, getY(hoveredPoint.close));
            ctx2.lineTo(width - 60, getY(hoveredPoint.close));
            ctx2.stroke();
            ctx2.setLineDash([]);

            // Premium Y-axis price label badge
            const badgeW = 50;
            const badgeH = 16;
            const badgeX = width - 55;
            const badgeY = getY(hoveredPoint.close) - badgeH / 2;
            
            ctx2.fillStyle = "#18181b";
            ctx2.fillRect(badgeX, badgeY, badgeW, badgeH);
            ctx2.strokeStyle = trendColor;
            ctx2.lineWidth = 1.2;
            ctx2.strokeRect(badgeX, badgeY, badgeW, badgeH);

            ctx2.fillStyle = "#ffffff";
            ctx2.font = "bold 9px monospace";
            ctx2.textAlign = "center";
            ctx2.textBaseline = "middle";
            ctx2.fillText(Math.round(hoveredPoint.close).toLocaleString('en-IN'), badgeX + badgeW / 2, badgeY + badgeH / 2);

            // Dot on line with white outline and glow ring
            ctx2.fillStyle = trendColor;
            ctx2.beginPath();
            ctx2.arc(getX(nearestIdx), getY(hoveredPoint.close), 5, 0, Math.PI * 2);
            ctx2.fill();

            ctx2.strokeStyle = "#ffffff";
            ctx2.lineWidth = 1.5;
            ctx2.beginPath();
            ctx2.arc(getX(nearestIdx), getY(hoveredPoint.close), 5, 0, Math.PI * 2);
            ctx2.stroke();

            // Fire hover callback to update UI stats labels
            if (onHoverCallback) {
                onHoverCallback(hoveredPoint);
            }
        };

        canvas._mouseMoveHandler = mouseMoveHandler;
        canvas.addEventListener("mousemove", mouseMoveHandler);

        // Clear crosshairs when mouse leaves canvas
        canvas.addEventListener("mouseleave", () => {
            canvas.removeEventListener("mousemove", canvas._mouseMoveHandler);
            // Redraw clean
            this.renderChart(canvasId, symbol, chartType, range, activeIndicators);
        }, { once: true });
    },

    // 3. Official TradingView Embed Widget Integration
    embedTradingView: function(containerId, symbol) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        container.innerHTML = ""; // clear previous
        
        // Map symbol to TradingView symbol syntax (e.g. RELIANCE -> NSE:RELIANCE)
        let tvSymbol = `NSE:${symbol}`;
        if (symbol === "TATAMOTORS") tvSymbol = "NSE:TATAMOTORS";
        else if (symbol === "RELIANCE") tvSymbol = "NSE:RELIANCE";
        else if (symbol === "HDFCBANK") tvSymbol = "NSE:HDFCBANK";
        else if (symbol === "INFY") tvSymbol = "NSE:INFY";
        else if (symbol === "ITC") tvSymbol = "NSE:ITC";
        
        // Create iframe element inside container
        const iframe = document.createElement("iframe");
        iframe.src = `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${tvSymbol}&interval=D&hidesidetoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=%5B%5D&theme=dark&style=1&timezone=Asia%2FKolkata&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${tvSymbol}`;
        iframe.style.width = "100%";
        iframe.style.height = "100%";
        iframe.style.border = "none";
        container.appendChild(iframe);
    }
};

console.log("BullVerse chart rendering engine compiled successfully.");
