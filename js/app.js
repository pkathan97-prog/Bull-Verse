// BullVerse India Main SPA Application Controller

document.addEventListener("DOMContentLoaded", () => {
    // App variables
    const data = window.BullVerseData;
    
    // Initialize prevClose for all stocks to prevent NaN% errors
    if (data && data.allStocksList) {
        data.allStocksList.forEach(stock => {
            if (!stock.prevClose) {
                stock.prevClose = parseFloat((stock.price / (1 + (stock.changePercent || 0) / 100)).toFixed(2));
            }
        });
    }

    let currentActiveView = "home";
    let activeStockSymbol = "TATAMOTORS";
    let activeChartType = "area";
    let activeChartRange = "1M";
    const chartIndicators = { SMA: false, EMA: false, VWAP: false, BollingerBands: false, RSI: false, MACD: false };
    
    // Full-Stack API Configuration & Session Storage
    const API_URL = "http://localhost:5005";
    window.showToast = function(msg, type = 'success') {
        let container = document.getElementById('toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toast-container';
            container.className = 'fixed bottom-5 right-5 z-[100] flex flex-col gap-3 pointer-events-none';
            document.body.appendChild(container);
        }
        const toast = document.createElement('div');
        const icon = type === 'success' ? '<i data-lucide="check-circle" class="w-5 h-5 text-emerald-400"></i>' : '<i data-lucide="alert-circle" class="w-5 h-5 text-red-400"></i>';
        const borderCls = type === 'success' ? 'border-emerald-500/30' : 'border-red-500/30';
        toast.className = `glass-card p-4 rounded-xl border ${borderCls} flex items-center gap-3 shadow-2xl transform transition-all duration-300 translate-y-10 opacity-0 bg-black/80 backdrop-blur-md min-w-[300px] pointer-events-auto`;
        toast.innerHTML = `${icon} <span class="text-sm text-white font-medium">${msg}</span>`;
        container.appendChild(toast);
        if (window.lucide) lucide.createIcons();
        
        setTimeout(() => { toast.classList.remove('translate-y-10', 'opacity-0'); }, 10);
        setTimeout(() => {
            toast.classList.add('translate-y-10', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    };

    let isOfflineSandbox = true;
    let userToken = localStorage.getItem("bv_token") || null;
    let userEmail = localStorage.getItem("bv_email") || null;

    // Admin state logs
    const adminLogs = ["System initialized.", "WebSocket simulation active.", "Default stocks loaded."];

    // Canvas QR code removed, using static image instead.

    // =========================================================================
    // 1. DYNAMIC ROUTER & VIEW CONTROLLER
    // =========================================================================
    function navigateTo(viewId) {
        // Resolve nested Detail Route
        let targetView = viewId;
        let symbolParam = null;

        if (viewId.startsWith("company-details/")) {
            targetView = "company-details";
            symbolParam = viewId.split("/")[1];
        }

        const views = document.querySelectorAll(".app-view");
        views.forEach(v => {
            v.classList.remove("active-view");
        });

        const targetSection = document.getElementById(`view-${targetView}`);
        if (targetSection) {
            targetSection.classList.add("active-view");
            currentActiveView = targetView;
        }

        // Highlight Sidebar link
        const links = document.querySelectorAll(".sidebar-link");
        links.forEach(l => {
            l.classList.remove("active");
            if (l.getAttribute("data-target") === targetView) {
                l.classList.add("active");
            }
        });

        // Initialize specific view modules
        switch (targetView) {
            case "home":
                setupHomeView();
                break;
            case "markets":
                setupMarketsView();
                break;
            case "stocks":
                setupStocksView();
                break;
            case "company-details":
                if (symbolParam) activeStockSymbol = symbolParam;
                setupCompanyDetailsView(activeStockSymbol);
                break;
            case "ipo":
                setupIpoView();
                break;
            case "mutual-funds":
                setupMutualFundsView();
                break;
            case "etfs":
                setupEtfsView();
                break;
            case "portfolio":
                setupPortfolioView();
                break;
            case "ai-assistant":
                setupAIAssistantView();
                break;
            case "learning":
                setupLearningView();
                break;
            case "community":
                setupCommunityView();
                break;
            case "news":
                setupNewsView();
                break;
            case "screeners":
                setupScreenerView();
                break;
            case "watchlist":
                setupWatchlistView();
                break;
            case "crypto":
                setupCryptoView();
                break;
            case "admin":
                setupAdminView();
                break;
        }
        
        // Scroll workspace to top
        document.getElementById("app-view-container").scrollTop = 0;
        
        // Add log
        logAdminAction(`Navigated to view: ${targetView}`);
    }

    // Bind hash change
    window.addEventListener("hashchange", () => {
        const hash = window.location.hash.substring(1) || "home";
        navigateTo(hash);
    });

    // Initial load navigation
    const initialHash = window.location.hash.substring(1) || "home";
    navigateTo(initialHash);


    // =========================================================================
    // 2. LIVE PRICE STREAM SIMULATOR
    // =========================================================================
    setInterval(() => {
        // Only trade during simulated active hours
        data.allStocksList.forEach(stock => {
            const volatility = stock.symbol === "ZOMATO" || stock.symbol === "BSE" ? 1.2 : 0.4;
            const drift = 0.01; // slight upward drift
            const move = (Math.random() - 0.48) * volatility + drift;
            const oldPrice = stock.price;
            stock.price = parseFloat((stock.price * (1 + move / 100)).toFixed(2));
            stock.changePercent = parseFloat((((stock.price - stock.prevClose) / stock.prevClose) * 100).toFixed(2));
            
            // Sync detailed stock object if loaded
            if (data.stocks[stock.symbol]) {
                data.stocks[stock.symbol].price = stock.price;
                data.stocks[stock.symbol].changePercent = stock.changePercent;
                data.stocks[stock.symbol].change = parseFloat((stock.price - data.stocks[stock.symbol].prevClose).toFixed(2));
            }

            // Check User watchlist price alerts trigger
            data.userState.alerts.forEach(alert => {
                if (alert.symbol === stock.symbol) {
                    const threshold = alert.threshold;
                    if ((alert.direction === "Above" && stock.price >= threshold) ||
                        (alert.direction === "Below" && stock.price <= threshold)) {
                        triggerPriceAlert(alert, stock.price);
                    }
                }
            });
        });

        // Trigger flash ticks and update views
        updateLiveMarquee();
        triggerViewTicks();
    }, 2500);

    function triggerViewTicks() {
        // Redraw marquee cells
        if (currentActiveView === "home") {
            updateHomePrices();
        } else if (currentActiveView === "stocks") {
            setupStocksView();
        } else if (currentActiveView === "company-details") {
            updateCompanyDetailsPrices();
        } else if (currentActiveView === "portfolio") {
            setupPortfolioView();
        } else if (currentActiveView === "watchlist") {
            setupWatchlistView();
        }
    }

    // Dynamic Top Marquee Renderer
    function updateLiveMarquee() {
        const marquee = document.getElementById("live-marquee");
        if (!marquee) return;
        
        let htmlContent = "";
        // Render standard indexes first
        const indices = [
            { name: "Nifty 50", price: 23985.40, pct: 0.65 },
            { name: "Sensex", price: 78920.15, pct: 0.58 },
            { name: "Bank Nifty", price: 52140.80, pct: 1.10 }
        ];

        indices.forEach(idx => {
            const isPos = idx.pct >= 0;
            htmlContent += `<div class="flex items-center gap-1 shrink-0">
                <span class="text-white font-bold">${idx.name}</span>
                <span class="text-gray-400 font-mono">${Math.round(idx.price).toLocaleString('en-IN')}</span>
                <span class="${isPos ? 'text-emerald-400' : 'text-red-400'} font-semibold font-mono flex items-center">
                    ${isPos ? '▲' : '▼'} ${Math.abs(idx.pct)}%
                </span>
            </div>`;
        });

        // Add stocks
        data.allStocksList.slice(0, 10).forEach(st => {
            const isPos = st.changePercent >= 0;
            htmlContent += `<div class="flex items-center gap-1 shrink-0 cursor-pointer" onclick="window.location.hash='#company-details/${st.symbol}'">
                <span class="text-gray-400 font-semibold">${st.symbol}</span>
                <span class="text-white font-mono font-bold">${st.price.toFixed(2)}</span>
                <span class="${isPos ? 'text-emerald-400' : 'text-red-400'} font-semibold font-mono flex items-center text-[10px]">
                    ${isPos ? '▲' : '▼'} ${Math.abs(st.changePercent)}%
                </span>
            </div>`;
        });

        // Double items for seamless infinite scroll loop
        marquee.innerHTML = htmlContent + htmlContent;
    }


    // =========================================================================
    // 3. WIDGET DRAW HELPERS (Canvas speeds & pie charts)
    // =========================================================================
    function drawSpeedometer(canvasId, val) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        const w = canvas.width;
        const h = canvas.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h - 5;
        const r = 50;

        // Draw Gauge Arc
        const grad = ctx.createLinearGradient(cx - r, cy, cx + r, cy);
        grad.addColorStop(0, "#ef4444"); // Red (Fear)
        grad.addColorStop(0.5, "#eab308"); // Yellow (Neutral)
        grad.addColorStop(1, "#10b981"); // Green (Greed)

        ctx.strokeStyle = grad;
        ctx.lineWidth = 10;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.arc(cx, cy, r, Math.PI, 2 * Math.PI);
        ctx.stroke();

        // Draw tick markers
        ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
        ctx.lineWidth = 2;
        for (let i = 0; i <= 4; i++) {
            const angle = Math.PI + (Math.PI * (i / 4));
            ctx.beginPath();
            ctx.moveTo(cx + (r - 10) * Math.cos(angle), cy + (r - 10) * Math.sin(angle));
            ctx.lineTo(cx + (r + 5) * Math.cos(angle), cy + (r + 5) * Math.sin(angle));
            ctx.stroke();
        }

        // Draw needle indicator
        const valAngle = Math.PI + (Math.PI * (val / 100));
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + (r - 5) * Math.cos(valAngle), cy + (r - 5) * Math.sin(valAngle));
        ctx.stroke();

        // Draw pivot pin
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(cx, cy, 6, 0, 2 * Math.PI);
        ctx.fill();
    }

    function drawDonutChart(canvasId, slices) {
        const canvas = document.getElementById(canvasId);
        if (!canvas) return;
        
        const ctx = canvas.getContext("2d");
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);

        const w = rect.width;
        const h = rect.height;
        ctx.clearRect(0, 0, w, h);

        const cx = w / 2;
        const cy = h / 2;
        const r = Math.max(1, Math.min(cx, cy) - 20);

        let total = slices.reduce((acc, curr) => acc + curr.value, 0);
        if (total === 0) total = 1;

        let startAngle = -Math.PI / 2;
        slices.forEach(slice => {
            const angle = (slice.value / total) * 2 * Math.PI;
            if (angle <= 0) return;
            
            // Draw slice
            ctx.fillStyle = slice.color;
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.arc(cx, cy, r, startAngle, startAngle + angle);
            ctx.closePath();
            ctx.fill();
            
            // Draw border separator
            ctx.strokeStyle = "#0c0c0e";
            ctx.lineWidth = 2;
            ctx.stroke();

            // Draw labels on slices
            const pct = Math.round((slice.value / total) * 100);
            if (pct >= 5) {
                const midAngle = startAngle + angle / 2;
                const labelDist = r * 0.68;
                const lx = cx + Math.cos(midAngle) * labelDist;
                const ly = cy + Math.sin(midAngle) * labelDist;

                // Label background shadow
                ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
                ctx.font = "bold 11px sans-serif";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(pct + "%", lx + 1, ly + 1);

                // White text
                ctx.fillStyle = "#ffffff";
                ctx.fillText(pct + "%", lx, ly);

                // Category name below pct if slice is large enough
                if (pct >= 12 && slice.label) {
                    ctx.font = "7px sans-serif";
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                    ctx.fillText(slice.label.substring(0, 10), lx, ly + 10);
                }
            }

            startAngle += angle;
        });

        // Draw inner circle for Donut effect
        ctx.fillStyle = "#0c0c0e";
        ctx.beginPath();
        ctx.arc(cx, cy, r * 0.45, 0, 2 * Math.PI);
        ctx.fill();

        // Center text label
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 12px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("100%", cx, cy - 3);
        
        ctx.font = "7px sans-serif";
        ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
        ctx.fillText("Total", cx, cy + 8);
    }


    // =========================================================================
        // ===== Add Funds Modal Logic =====
        const addFundsBtn = document.getElementById("add-funds-btn");
        const addFundsModal = document.getElementById("add-funds-modal");
        const closeAddFundsModal = document.getElementById("close-add-funds-modal");
        const addFundsInput = document.getElementById("add-funds-amount");
        const depositBtn = document.getElementById("deposit-funds-btn");

        if (addFundsBtn && addFundsModal) {
            addFundsBtn.addEventListener("click", () => {
                addFundsModal.classList.remove("hidden");
                addFundsModal.style.display = "flex";
                if (addFundsInput) addFundsInput.value = "";
                if (typeof lucide !== "undefined") lucide.createIcons();
            });

            if (closeAddFundsModal) {
                closeAddFundsModal.addEventListener("click", () => {
                    addFundsModal.style.display = "none";
                    addFundsModal.classList.add("hidden");
                });
            }

            // Click outside to close
            addFundsModal.addEventListener("click", (e) => {
                if (e.target === addFundsModal) {
                    addFundsModal.style.display = "none";
                    addFundsModal.classList.add("hidden");
                }
            });

            // Quick amount buttons
            document.querySelectorAll(".quick-amt-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    if (addFundsInput) addFundsInput.value = btn.dataset.amount;
                    // Highlight selected
                    document.querySelectorAll(".quick-amt-btn").forEach(b => b.classList.remove("bg-emerald-500/15", "border-emerald-500/30"));
                    btn.classList.add("bg-emerald-500/15", "border-emerald-500/30");
                });
            });

            // Handle payment method toggling
            const payMethods = document.querySelectorAll('input[name="pay-method"]');
            const detailSections = document.querySelectorAll('.pay-detail-section');
            payMethods.forEach(radio => {
                radio.addEventListener("change", (e) => {
                    detailSections.forEach(sec => {
                        sec.classList.remove('block');
                        sec.classList.add('hidden');
                    });
                    const targetId = `pay-detail-${e.target.value}`;
                    const targetEl = document.getElementById(targetId);
                    if (targetEl) {
                        targetEl.classList.remove('hidden');
                        targetEl.classList.add('block');
                    }
                });
            });

            // Deposit Funds simulation
            if (depositBtn) {
                depositBtn.addEventListener("click", () => {
                    const amount = parseFloat(addFundsInput?.value || 0);
                    if (!amount || amount < 100) {
                        alert("Please enter a valid amount (minimum ₹100)");
                        return;
                    }

                    // Validate Payment Details
                    const selectedMethod = document.querySelector('input[name="pay-method"]:checked')?.value;
                    if (selectedMethod === 'upi') {
                        const upiId = document.getElementById("add-funds-upi-id")?.value;
                        if (!upiId || !upiId.includes("@")) {
                            alert("Please enter a valid UPI ID (e.g. name@upi)");
                            return;
                        }
                    } else if (selectedMethod === 'card') {
                        const cardNum = document.getElementById("add-funds-card-num")?.value;
                        const cardCvv = document.getElementById("add-funds-card-cvv")?.value;
                        if (!cardNum || cardNum.length < 12) {
                            alert("Please enter a valid Card Number");
                            return;
                        }
                        if (!cardCvv || cardCvv.length < 3) {
                            alert("Please enter a valid CVV");
                            return;
                        }
                    } else if (selectedMethod === 'neft') {
                        const accNum = document.getElementById("add-funds-neft-acc")?.value;
                        if (!accNum || accNum.length < 8) {
                            alert("Please enter a valid Account Number or Reference");
                            return;
                        }
                    }

                    // Show success animation
                    depositBtn.innerHTML = '<i data-lucide="check-circle" class="w-4 h-4"></i> Deposited Successfully!';
                    depositBtn.classList.add("from-green-600", "to-emerald-600");
                    if (typeof lucide !== "undefined") lucide.createIcons();

                    // Update balance display
                    const availEl = document.getElementById("lim-avail-margin");
                    const cashEl = document.getElementById("lim-cash-bal");
                    if (availEl) {
                        const current = parseFloat(availEl.textContent.replace(/[₹,]/g, "")) || 623420;
                        const newVal = current + amount;
                        availEl.textContent = "₹" + newVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                    if (cashEl) {
                        const current = parseFloat(cashEl.textContent.replace(/[₹,]/g, "")) || 474860;
                        const newVal = current + amount;
                        cashEl.textContent = "₹" + newVal.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    }
                    
                    // Refresh portfolio if currently active
                    if (currentActiveView === 'portfolio') {
                        setupPortfolioView();
                    }

                    setTimeout(() => {
                        addFundsModal.style.display = "none";
                        addFundsModal.classList.add("hidden");
                        // Reset button
                        depositBtn.innerHTML = '<i data-lucide="shield-check" class="w-4 h-4"></i> Deposit Securely';
                        depositBtn.classList.remove("from-green-600", "to-emerald-600");
                        if (typeof lucide !== "undefined") lucide.createIcons();
                    }, 1500);
                });
            }
        }

    // 4. VIEW SETUPS & TEMPLATES
    // =========================================================================

    // --- HOME VIEW ---
    function setupHomeView() {
        // Draw Fear and Greed Speedometer
        drawSpeedometer("fg-speedometer", 68); // 68: Greed
        document.getElementById("fg-score-val").textContent = "68";
        document.getElementById("fg-mood-lbl").textContent = "Greed Mood";

        // Render indices cards
        const idxGrid = document.getElementById("home-index-grid");
        if (idxGrid) {
            const indexList = [
                { name: "NIFTY 50", price: 24056.00, change: 34.35, pct: 0.14 },
                { name: "SENSEX", price: 77100.47, change: 109.25, pct: 0.14 },
                { name: "BANK NIFTY", price: 58177.05, change: 26.70, pct: 0.04 },
                { name: "NIFTY MIDCAP", price: 54120.00, change: -120.40, pct: -0.22 },
                { name: "NIFTY SMALLCAP", price: 17200.00, change: -245.50, pct: -1.41 }
            ];

            idxGrid.innerHTML = indexList.map(idx => {
                const isPos = idx.pct >= 0;
                return `<div class="glass-card p-4 rounded-xl space-y-1 select-none">
                    <span class="text-[9px] text-gray-500 font-bold tracking-wider block">${idx.name}</span>
                    <span class="font-poppins font-black text-sm text-white block">${Math.round(idx.price).toLocaleString('en-IN')}</span>
                    <div class="flex items-center gap-1 text-[10px] ${isPos ? 'text-emerald-400' : 'text-red-400'} font-semibold mt-0.5">
                        <span>${isPos ? '+' : ''}${idx.change.toFixed(2)}</span>
                        <span>(${isPos ? '+' : ''}${idx.pct.toFixed(2)}%)</span>
                    </div>
                </div>`;
            }).join("");
        }

        // Render Trending Stock lists
        const trendingGrid = document.getElementById("home-trending-grid");
        if (trendingGrid) {
            const trending = data.allStocksList.slice(0, 4);
            trendingGrid.innerHTML = trending.map(st => {
                const isPos = st.changePercent >= 0;
                return `<div class="glass-card p-4 rounded-xl space-y-2 cursor-pointer hover:border-emerald-500/25 transition" onclick="window.location.hash='#company-details/${st.symbol}'">
                    <div class="flex justify-between items-center">
                        <span class="font-bold text-white text-xs block font-poppins">${st.symbol}</span>
                        <span class="text-[9px] text-gray-500 font-semibold">${st.sector}</span>
                    </div>
                    <div class="flex items-baseline justify-between">
                        <strong class="font-poppins font-black text-sm text-white font-mono">₹${st.price.toFixed(2)}</strong>
                        <span class="${isPos ? 'text-emerald-400' : 'text-red-400'} text-[10px] font-bold">
                            ${isPos ? '+' : ''}${st.changePercent.toFixed(2)}%
                        </span>
                    </div>
                </div>`;
            }).join("");
        }

        // Render Home Sector list
        const sectorsGrid = document.getElementById("home-sectors-grid");
        if (sectorsGrid) {
            const sectors = [
                { name: "Automobile", cap: "12.8L Cr", move: 1.28, color: "border-emerald-500/10 hover:border-emerald-500/30" },
                { name: "Banking", cap: "28.4L Cr", move: 1.55, color: "border-emerald-500/10 hover:border-emerald-500/30" },
                { name: "IT Services", cap: "18.2L Cr", move: -1.60, color: "border-red-500/10 hover:border-red-500/30" },
                { name: "FMCG", cap: "11.5L Cr", move: 0.54, color: "border-emerald-500/10 hover:border-emerald-500/30" }
            ];

            sectorsGrid.innerHTML = sectors.map(sec => {
                const isPos = sec.move >= 0;
                return `<div class="p-3 border rounded-xl glass-card text-center cursor-pointer ${sec.color} flex flex-col justify-between" onclick="window.location.hash='#stocks'; document.getElementById('stocks-sector-filter').value='${sec.name}';">
                    <span class="text-xs font-bold text-white block">${sec.name}</span>
                    <span class="text-[9px] text-gray-500 block mt-0.5">Cap: ${sec.cap}</span>
                    <span class="text-[9px] font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'} block mt-1.5">${isPos ? '+' : ''}${sec.move.toFixed(2)}%</span>
                </div>`;
            }).join("");
        }

        // Load default chart
        updateHomeChart(activeStockSymbol);


    }

    function updateHomePrices() {
        // Just refresh the trending grid and index grid values
        setupHomeView();
    }

    // Refresh default home chart data
    function updateHomeChart(symbol) {
        document.getElementById("home-chart-title").textContent = symbol;
        const fromList = data.allStocksList.find(function(s){ return s.symbol === symbol; });
        const stock = data.stocks[symbol] || fromList || { sector: "Equity", price: 500, changePercent: 0, name: symbol };
        document.getElementById("home-chart-sector").textContent = stock.sector;
        document.getElementById("home-chart-price").textContent = `₹${stock.price.toFixed(2)}`;
        
        const isPos = stock.changePercent >= 0;
        const el = document.getElementById("home-chart-change");
        el.textContent = `${isPos ? '+' : ''}${stock.changePercent.toFixed(2)}%`;
        el.className = `text-xs font-semibold ${isPos ? 'text-emerald-400' : 'text-red-400'}`;

        window.BullVerseCharts.renderChart(
            "home-stock-canvas",
            symbol,
            "area",
            activeChartRange,
            {},
            (pt) => {
                // Hover callback to update header labels
                document.getElementById("ch-date").textContent = pt.date;
                document.getElementById("ch-open").textContent = pt.open.toFixed(1);
                document.getElementById("ch-close").textContent = pt.close.toFixed(1);
                document.getElementById("ch-high").textContent = pt.high.toFixed(1);
                document.getElementById("ch-low").textContent = pt.low.toFixed(1);
                document.getElementById("ch-vol").textContent = pt.volume.toLocaleString();
                document.getElementById("chart-hover-overlay").classList.remove("hidden");
            }
        );
    }

    // Range buttons bindings
    document.querySelectorAll(".home-chart-range-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            document.querySelectorAll(".home-chart-range-btn").forEach(b => b.classList.remove("bg-white/10", "text-white"));
            btn.classList.add("bg-white/10", "text-white");
            activeChartRange = btn.getAttribute("data-range");
            updateHomeChart(activeStockSymbol);
        });
    });


    // --- MARKETS VIEW ---
    function setupMarketsView() {
        const tbody = document.getElementById("market-sectors-tbody");
        if (!tbody) return;

        const sectors = [
            { name: "Financial Services / Banking", count: 8, cap: "28,45,200 Cr", pe: 18.2, trend: 1.55 },
            { name: "Automobile & Heavy Engineering", count: 4, cap: "8,95,000 Cr", pe: 22.4, trend: 1.28 },
            { name: "Technology / IT Consulting", count: 6, cap: "18,24,000 Cr", pe: 26.5, trend: -1.60 },
            { name: "FMCG / Consumer Staples", count: 5, cap: "11,54,000 Cr", pe: 42.1, trend: 0.54 },
            { name: "Defense & Railway Infrastructure", count: 3, cap: "5,42,000 Cr", pe: 45.8, trend: 4.80 }
        ];

        tbody.innerHTML = sectors.map(sec => {
            const isPos = sec.trend >= 0;
            return `<tr>
                <td class="py-3 font-bold text-white">${sec.name}</td>
                <td class="py-3 text-gray-400">${sec.count} Listings</td>
                <td class="py-3 font-mono font-semibold">${sec.cap}</td>
                <td class="py-3 text-right font-mono">${sec.pe}x</td>
                <td class="py-3 text-right font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}">
                    ${isPos ? '▲' : '▼'} ${Math.abs(sec.trend).toFixed(2)}%
                </td>
            </tr>`;
        }).join("");
    }


    // --- LISTED STOCKS VIEW ---
    function setupStocksView() {
        const grid = document.getElementById("stocks-grid-container");
        const filterSelect = document.getElementById("stocks-sector-filter");
        if (!grid || !filterSelect) return;

        // Dynamically populate sector dropdown if it only has the "ALL" option
        if (filterSelect.options.length <= 1) {
            const sectors = [...new Set(data.allStocksList.map(st => st.sector))].sort();
            sectors.forEach(sec => {
                const opt = document.createElement("option");
                opt.value = sec;
                opt.textContent = sec;
                filterSelect.appendChild(opt);
            });
        }

        const searchVal = document.getElementById("stocks-search-input").value.toLowerCase();
        const sectorVal = filterSelect.value;

        // Filter list
        const filtered = data.allStocksList.filter(st => {
            const matchSearch = st.symbol.toLowerCase().includes(searchVal) || st.name.toLowerCase().includes(searchVal);
            const matchSector = sectorVal === "ALL" || st.sector === sectorVal;
            return matchSearch && matchSector;
        });

        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-1 md:col-span-3 lg:col-span-4 text-center py-20 bg-white/5 rounded-2xl border border-white/5">
                <i data-lucide="search-x" class="w-8 h-8 text-gray-500 mx-auto mb-3"></i>
                <h3 class="text-white font-poppins font-bold text-sm">No matching stocks found</h3>
                <p class="text-[10px] text-gray-400 mt-1">Try adjusting your filters or searching for a different company.</p>
            </div>`;
            lucide.createIcons();
            return;
        }

        grid.className = "grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5 animate-fade-in";
        
        grid.innerHTML = filtered.map(st => {
            const isPos = st.changePercent >= 0;
            const inWatch = data.userState.watchlist.includes(st.symbol);
            const trendColor = isPos ? "text-emerald-400" : "text-red-400";
            const bgGradient = isPos ? "from-emerald-500/5" : "from-red-500/5";
            const sparklineData = Array.from({length: 6}, () => Math.random() * 20 + 10);
            const pathD = `M0,${30 - sparklineData[0]} ` + sparklineData.map((v, i) => `L${i * (100/5)},${30 - v}`).join(" ");

            const mcap = st.marketCap || 'N/A';
            const pctOf52 = (st.high52w > st.low52w)
                ? Math.max(0, Math.min(100, Math.round(((st.price - st.low52w) / (st.high52w - st.low52w)) * 100)))
                : 50;

            return `<div class="glass-card p-4 rounded-2xl border border-white/5 bg-gradient-to-br ${bgGradient} to-transparent relative group hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-[0_8px_30px_rgb(16,185,129,0.1)] transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between" style="min-height:195px;" onclick="window.location.hash='#company-details/${st.symbol}'">
                
                <!-- Background ambient glow -->
                <div class="absolute -top-10 -right-10 w-24 h-24 bg-${isPos ? 'emerald' : 'red'}-500/10 blur-2xl rounded-full group-hover:scale-150 transition-transform duration-500"></div>

                <!-- Header -->
                <div class="flex justify-between items-start z-10">
                    <div class="flex gap-3 items-center">
                        <div class="w-10 h-10 rounded-xl bg-black/40 border border-white/10 flex items-center justify-center font-bold text-[11px] text-white backdrop-blur-md">
                            ${st.symbol.substring(0, 3)}
                        </div>
                        <div>
                            <h3 class="font-poppins font-black text-sm text-white group-hover:text-emerald-400 transition-colors leading-tight">${st.symbol}</h3>
                            <span class="text-[9px] text-gray-400 font-semibold block line-clamp-1 mt-0.5 leading-tight">${st.name}</span>
                        </div>
                    </div>
                    <button class="text-gray-500 hover:text-amber-500 transition-colors add-watch-btn z-20 p-1 flex-shrink-0" data-symbol="${st.symbol}">
                        <i data-lucide="star" class="w-4 h-4 ${inWatch ? 'fill-amber-500 text-amber-500' : ''}"></i>
                    </button>
                </div>

                <!-- Sparkline -->
                <div class="h-7 mt-3 z-10 w-full opacity-50 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 100 30" class="w-full h-full" preserveAspectRatio="none">
                        <path d="${pathD}" fill="none" stroke="currentColor" stroke-width="2" class="${trendColor}" vector-effect="non-scaling-stroke"/>
                    </svg>
                </div>

                <!-- Price Row -->
                <div class="z-10 mt-auto">
                    <div class="flex items-end justify-between mb-2">
                        <strong class="font-poppins text-base text-white font-mono">₹${st.price.toFixed(2)}</strong>
                        <strong class="font-poppins text-xs font-bold font-mono px-2 py-0.5 rounded ${isPos ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'} flex items-center gap-1">
                            <i data-lucide="${isPos ? 'trending-up' : 'trending-down'}" class="w-3 h-3"></i>
                            ${isPos ? '+' : ''}${st.changePercent.toFixed(2)}%
                        </strong>
                    </div>
                    <!-- 52W mini range bar -->
                    <div class="relative h-1.5 bg-white/10 rounded-full mb-2.5 overflow-hidden">
                        <div class="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded-full"></div>
                        <div class="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full border border-zinc-900 shadow" style="left:calc(${pctOf52}% - 5px)"></div>
                    </div>
                    <div class="flex justify-between items-center text-[9px] text-gray-500 pt-2 border-t border-white/10 uppercase tracking-widest font-semibold">
                        <span>${st.sector}</span>
                        <span class="text-gray-400">${mcap}</span>
                    </div>
                </div>
            </div>`;
        }).join("");

        // Bind quick watchlist stars
        document.querySelectorAll(".add-watch-btn").forEach(btn => {
            btn.addEventListener("click", async (e) => {
                e.stopPropagation();
                const sym = btn.getAttribute("data-symbol");
                await toggleWatchlist(sym);
                setupStocksView();
            });
        });

        // Update results count badge
        const countEl = document.getElementById("stocks-results-count");
        if (countEl) {
            countEl.textContent = filtered.length + " of " + data.allStocksList.length + " stocks";
        }

        // re-render icon labels
        lucide.createIcons();
    }

    // Bind filters — use debounce for smooth typing
    const searchInput = document.getElementById("stocks-search-input");
    const sectorFilter = document.getElementById("stocks-sector-filter");
    let _searchTimer;
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            // Show/hide clear button
            const clearBtn = document.getElementById("stocks-search-clear");
            if (clearBtn) clearBtn.classList.toggle("hidden", !searchInput.value);
            clearTimeout(_searchTimer);
            _searchTimer = setTimeout(setupStocksView, 180);
        });
    }
    if (sectorFilter) sectorFilter.addEventListener("change", setupStocksView);


    // --- COMPANY DETAILS VIEW ---
    function setupCompanyDetailsView(symbol) {
        const container = document.getElementById("company-detail-content");
        if (!container) return;

        // Force ALL stocks to use the same universal rich detail design
        const stock = null; // unified template for all stocks
        {
            const baseInfo = data.allStocksList.find(function(s){ return s.symbol === symbol; }) || {
                name: symbol, sector: 'Indian Equity', price: 100, prevClose: 100,
                changePercent: 0, pe: 0, roe: 0, marketCap: 'N/A',
                high52w: 110, low52w: 90, cap: 'Large'
            };

            const bPrice = parseFloat(baseInfo.price || 100);
            const bPrev  = parseFloat(baseInfo.prevClose || bPrice);
            const bChg   = parseFloat(baseInfo.changePercent || 0);
            const isUp   = bChg >= 0;
            const chgAmt = parseFloat((bPrice - bPrev).toFixed(2));
            const chgCls = isUp ? 'text-emerald-400' : 'text-red-400';
            const pricePct = (baseInfo.high52w > baseInfo.low52w)
                ? Math.max(0, Math.min(100, Math.round(((bPrice - baseInfo.low52w) / (baseInfo.high52w - baseInfo.low52w)) * 100)))
                : 50;

            // Generate mock 30-bar OHLC with proper dates
            const ohlcData = [];
            let mp = bPrice * 0.92;
            const today = new Date();
            for (let d = 0; d < 30; d++) {
                const barDate = new Date(today);
                barDate.setDate(barDate.getDate() - (29 - d));
                const dateLabel = barDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
                const open  = parseFloat(mp.toFixed(2));
                const move  = (Math.random() - 0.45) * mp * 0.025;
                const close = parseFloat((open + move).toFixed(2));
                const high  = parseFloat((Math.max(open, close) * (1 + Math.random() * 0.012)).toFixed(2));
                const low   = parseFloat((Math.min(open, close) * (1 - Math.random() * 0.012)).toFixed(2));
                ohlcData.push({ date: dateLabel, open, high, low, close });
                mp = close;
            }
            ohlcData[ohlcData.length - 1].close = bPrice;

            // Mock quarterly revenue
            const quarters = ['Q1FY24','Q2FY24','Q3FY24','Q4FY24','Q1FY25','Q2FY25','Q3FY25','Q4FY25'];
            const baseRev  = bPrice * 120;
            const revData  = quarters.map(function(_,i){ return Math.round(baseRev * (1 + i * 0.05 + (Math.random()-0.4)*0.08)); });

            // Mock shareholding
            const promo_  = Math.round(35 + Math.random() * 25);
            const fii_    = Math.round(15 + Math.random() * 18);
            const dii_    = Math.round(10 + Math.random() * 13);
            const retail_ = Math.max(2, 100 - promo_ - fii_ - dii_);

            const keyStats = [
                { label: 'Market Cap',  val: baseInfo.marketCap || 'N/A' },
                { label: 'P/E Ratio',   val: (baseInfo.pe || 0) + 'x' },
                { label: 'ROE',         val: (baseInfo.roe || 0) + '%' },
                { label: 'Prev Close',  val: '\u20B9' + bPrev.toFixed(2) },
                { label: '52W High',    val: '\u20B9' + (baseInfo.high52w || 0).toLocaleString() },
                { label: '52W Low',     val: '\u20B9' + (baseInfo.low52w || 0).toLocaleString() }
            ];

            container.innerHTML =
                '<div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/5 pb-5 mb-5">' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-lg text-white">' +
                            symbol.substring(0, 3) +
                        '</div>' +
                        '<div>' +
                            '<div class="flex items-center gap-2 flex-wrap">' +
                                '<h1 class="font-poppins font-black text-2xl text-white tracking-tight">' + baseInfo.name + '</h1>' +
                                '<span class="bg-white/5 text-[9px] text-gray-400 border border-white/10 px-2 py-0.5 rounded font-mono">' + symbol + '</span>' +
                                '<span class="text-[9px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">' + (baseInfo.cap || 'Large') + ' Cap</span>' +
                            '</div>' +
                            '<p class="text-xs text-gray-400 mt-1">' + baseInfo.sector + ' \u00B7 NSE / BSE</p>' +
                        '</div>' +
                    '</div>' +
                    '<div class="flex items-center gap-4">' +
                        '<div class="text-right">' +
                            '<span class="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Live Price</span>' +
                            '<span class="font-poppins font-black text-3xl text-white font-mono" id="detail-live-price">\u20B9' + bPrice.toFixed(2) + '</span>' +
                            '<div class="flex items-center gap-2 justify-end mt-1">' +
                                '<span class="text-xs font-bold font-mono px-2 py-0.5 rounded ' + (isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400') + '">' +
                                    (isUp ? '+' : '') + chgAmt.toFixed(2) + ' (' + (isUp ? '+' : '') + bChg.toFixed(2) + '%)' +
                                '</span>' +
                            '</div>' +
                        '</div>' +
                        '<button onclick="window.location.hash=\'#stocks\'" class="text-xs text-gray-400 hover:text-white border border-white/10 px-4 py-2 rounded-xl transition flex items-center gap-1">' +
                            '<svg class=\"w-3 h-3\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M19 12H5M12 19l-7-7 7-7\"/></svg> Back' +
                        '</button>' +
                    '</div>' +
                '</div>' +

                // --- Key Stats Row ---
                '<div class="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">' +
                keyStats.map(function(m) {
                    return '<div class="glass-card p-3 rounded-xl border border-white/5 text-center">' +
                        '<span class="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">' + m.label + '</span>' +
                        '<strong class="text-sm text-white font-mono">' + m.val + '</strong>' +
                    '</div>';
                }).join('') +
                '</div>' +

                // --- 52W Range Bar ---
                '<div class="glass-card p-4 rounded-xl border border-white/5 mb-6">' +
                    '<div class="flex justify-between text-[9px] text-gray-500 mb-2 uppercase tracking-widest">' +
                        '<span>52W Low: \u20B9' + (baseInfo.low52w || 0).toLocaleString() + '</span>' +
                        '<span class="text-white font-bold">Now: \u20B9' + bPrice.toFixed(2) + '</span>' +
                        '<span>52W High: \u20B9' + (baseInfo.high52w || 0).toLocaleString() + '</span>' +
                    '</div>' +
                    '<div class="relative h-3 bg-white/10 rounded-full">' +
                        '<div class="absolute inset-0 bg-gradient-to-r from-red-500 via-amber-400 to-emerald-500 rounded-full"></div>' +
                        '<div class="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-zinc-900 z-10 transition-all" style="left:calc(' + pricePct + '% - 8px)"></div>' +
                    '</div>' +
                '</div>' +

                // --- Charts Row ---
                '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">' +
                    '<div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-white/5">' +
                        '<div class="flex justify-between items-center mb-4">' +
                            '<h3 class="font-poppins font-bold text-sm text-white">\uD83D\uDCC8 Price Chart (30 Days)</h3>' +
                            '<div class="flex gap-2">' +
                                '<button id="btn-candle" class="text-[9px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition">Candle</button>' +
                                '<button id="btn-line" class="text-[9px] font-bold px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 transition">Line</button>' +
                            '</div>' +
                        '</div>' +
                        '<canvas id="stock-price-chart" class="w-full h-[270px] block" style="height: 270px;"></canvas>' +
                    '</div>' +
                    '<div class="glass-card p-5 rounded-2xl border border-white/5">' +
                        '<h3 class="font-poppins font-bold text-sm text-white mb-4">\uD83E\uDD67 Shareholding Pattern</h3>' +
                        '<div class="relative w-40 h-40 mx-auto mb-4">' +
                            '<canvas id="shareholding-chart" class="w-full h-full mx-auto"></canvas>' +
                        '</div>' +
                        '<div class="grid grid-cols-2 gap-2 mt-4">' +
                        [
                            ['Promoters', promo_, '#10b981'],
                            ['FII', fii_, '#3b82f6'],
                            ['DII', dii_, '#f59e0b'],
                            ['Retail', retail_, '#8b5cf6']
                        ].map(function(s) {
                            return '<div class="flex items-center gap-1.5 text-[9px]">' +
                                '<span class="w-2.5 h-2.5 rounded-sm flex-shrink-0" style="background:' + s[2] + '"></span>' +
                                '<span class="text-gray-400">' + s[0] + '</span>' +
                                '<strong class="text-white ml-auto">' + s[1] + '%</strong>' +
                            '</div>';
                        }).join('') +
                        '</div>' +
                    '</div>' +
                '</div>' +

                // --- Revenue Bar Chart ---
                '<div class="glass-card p-5 rounded-2xl border border-white/5 mb-6">' +
                    '<h3 class="font-poppins font-bold text-sm text-white mb-4">\uD83D\uDCCA Quarterly Revenue (\u20B9 Cr)</h3>' +
                    '<canvas id="revenue-chart" class="w-full h-[150px] block" style="height: 150px;"></canvas>' +
                '</div>' +

                // --- TECHNICAL ANALYSIS PANEL ---
                (function() {
                    var pe = baseInfo.pe || 0;
                    var price = bPrice;
                    var h52 = baseInfo.high52w || price * 1.2;
                    var l52 = baseInfo.low52w || price * 0.8;
                    var pctFrom52H = ((h52 - price) / h52 * 100).toFixed(1);
                    var pctFrom52L = ((price - l52) / l52 * 100).toFixed(1);
                    var sma20v = (price * (0.97 + Math.random() * 0.06)).toFixed(2);
                    var sma50v = (price * (0.94 + Math.random() * 0.10)).toFixed(2);
                    var sma200v = (price * (0.88 + Math.random() * 0.18)).toFixed(2);
                    var rsi = Math.round(40 + Math.random() * 30);
                    var macdVal = (Math.random() * 4 - 1).toFixed(2);
                    var abv20 = price > parseFloat(sma20v);
                    var abv50 = price > parseFloat(sma50v);
                    var abv200 = price > parseFloat(sma200v);
                    var trend = (abv20 && abv50 && abv200) ? 'Strong Uptrend' : (abv50 && abv200) ? 'Uptrend' : (!abv20 && !abv50) ? 'Downtrend' : 'Sideways';
                    var trendColor = trend.includes('Up') ? 'text-emerald-400' : trend === 'Downtrend' ? 'text-red-400' : 'text-amber-400';
                    var trendIcon = trend.includes('Up') ? '\u2197\uFE0F' : trend === 'Downtrend' ? '\u2198\uFE0F' : '\u27A1\uFE0F';
                    var rsiLabel = rsi > 70 ? 'Overbought' : rsi < 30 ? 'Oversold' : 'Neutral';
                    var rsiColor = rsi > 70 ? 'text-red-400' : rsi < 30 ? 'text-emerald-400' : 'text-gray-300';
                    var peLabel = pe < 15 ? 'Undervalued' : pe < 30 ? 'Fair Value' : pe < 60 ? 'Growth Premium' : 'Expensive';
                    var peColor = pe < 15 ? 'text-emerald-400' : pe < 30 ? 'text-blue-400' : pe < 60 ? 'text-amber-400' : 'text-red-400';
                    var macdSignal = parseFloat(macdVal) > 0 ? 'Bullish' : 'Bearish';
                    var macdColor = parseFloat(macdVal) > 0 ? 'text-emerald-400' : 'text-red-400';

                    return '<div class="glass-card p-5 rounded-2xl border border-white/5 mb-6">' +
                        '<h3 class="font-poppins font-bold text-sm text-white mb-4">\uD83D\uDD2C Technical Analysis</h3>' +

                        // Trend + RSI Header
                        '<div class="flex flex-wrap gap-4 mb-5">' +
                            '<div class="flex-1 min-w-[140px] bg-black/30 rounded-xl p-3 border border-white/5">' +
                                '<span class="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">Overall Trend</span>' +
                                '<strong class="text-lg ' + trendColor + ' font-poppins">' + trendIcon + ' ' + trend + '</strong>' +
                            '</div>' +
                            '<div class="flex-1 min-w-[140px] bg-black/30 rounded-xl p-3 border border-white/5">' +
                                '<span class="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">RSI (14)</span>' +
                                '<div class="flex items-center gap-3">' +
                                    '<strong class="text-lg text-white font-mono">' + rsi + '</strong>' +
                                    '<span class="text-[10px] font-bold ' + rsiColor + '">' + rsiLabel + '</span>' +
                                '</div>' +
                                '<div class="relative h-1.5 bg-white/10 rounded-full mt-2">' +
                                    '<div class="absolute inset-0 bg-gradient-to-r from-emerald-500 via-gray-400 to-red-500 rounded-full"></div>' +
                                    '<div class="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full border border-zinc-900" style="left:' + rsi + '%"></div>' +
                                '</div>' +
                            '</div>' +
                            '<div class="flex-1 min-w-[140px] bg-black/30 rounded-xl p-3 border border-white/5">' +
                                '<span class="text-[9px] text-gray-500 uppercase tracking-widest block mb-1">MACD Signal</span>' +
                                '<strong class="text-lg ' + macdColor + ' font-mono">' + macdVal + '</strong>' +
                                '<span class="text-[10px] ' + macdColor + ' ml-2 font-bold">' + macdSignal + '</span>' +
                            '</div>' +
                        '</div>' +

                        // Indicator Grid
                        '<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">P/E Ratio</span>' +
                                '<strong class="text-white font-mono">' + pe + 'x</strong>' +
                                '<span class="text-[8px] block mt-0.5 ' + peColor + '">' + peLabel + '</span>' +
                            '</div>' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">SMA 20</span>' +
                                '<strong class="text-white font-mono">\u20B9' + sma20v + '</strong>' +
                                '<span class="text-[8px] block mt-0.5 ' + (abv20 ? 'text-emerald-400' : 'text-red-400') + '">' + (abv20 ? '\u25B2 Above' : '\u25BC Below') + '</span>' +
                            '</div>' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">SMA 50</span>' +
                                '<strong class="text-white font-mono">\u20B9' + sma50v + '</strong>' +
                                '<span class="text-[8px] block mt-0.5 ' + (abv50 ? 'text-emerald-400' : 'text-red-400') + '">' + (abv50 ? '\u25B2 Above' : '\u25BC Below') + '</span>' +
                            '</div>' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">SMA 200</span>' +
                                '<strong class="text-white font-mono">\u20B9' + sma200v + '</strong>' +
                                '<span class="text-[8px] block mt-0.5 ' + (abv200 ? 'text-emerald-400' : 'text-red-400') + '">' + (abv200 ? '\u25B2 Above' : '\u25BC Below') + '</span>' +
                            '</div>' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">From 52W High</span>' +
                                '<strong class="text-red-400 font-mono">-' + pctFrom52H + '%</strong>' +
                            '</div>' +
                            '<div class="bg-black/20 rounded-lg p-2.5 border border-white/5">' +
                                '<span class="text-[8px] text-gray-500 uppercase block">From 52W Low</span>' +
                                '<strong class="text-emerald-400 font-mono">+' + pctFrom52L + '%</strong>' +
                            '</div>' +
                        '</div>' +
                    '</div>';
                })() +

                // --- Fundamentals + Trade ---
                '<div class="grid grid-cols-1 lg:grid-cols-3 gap-6">' +
                    '<div class="lg:col-span-2 glass-card p-5 rounded-2xl border border-white/5">' +
                        '<h3 class="font-poppins font-bold text-sm text-white mb-4">Key Fundamentals</h3>' +
                        '<div class="grid grid-cols-2 gap-3 text-xs">' +
                        [
                            ['Sector', baseInfo.sector],
                            ['Cap Category', (baseInfo.cap || 'Large') + ' Cap'],
                            ['P/E Ratio', (baseInfo.pe || 0) + 'x'],
                            ['ROE', (baseInfo.roe || 0) + '%'],
                            ['52W High', '\u20B9' + (baseInfo.high52w || 0).toLocaleString()],
                            ['52W Low', '\u20B9' + (baseInfo.low52w || 0).toLocaleString()],
                            ['Market Cap', baseInfo.marketCap || 'N/A'],
                            ['Prev Close', '\u20B9' + bPrev.toFixed(2)]
                        ].map(function(pair) {
                            return '<div class="flex justify-between border-b border-white/5 pb-2">' +
                                '<span class="text-gray-400">' + pair[0] + '</span>' +
                                '<strong class="text-white font-mono">' + pair[1] + '</strong>' +
                            '</div>';
                        }).join('') +
                        '</div>' +
                    '</div>' +
                    '<div class="glass-card p-5 rounded-2xl border border-white/5">' +
                        '<h3 class="font-poppins font-bold text-sm text-white mb-4">\u26A1 Quick Trade</h3>' +
                        '<div class="space-y-3">' +
                            '<label class="text-[9px] text-gray-500 font-bold block uppercase">Shares</label>' +
                            '<input type="number" id="generic-trade-shares" value="10" min="1" class="w-full glass-input text-xs p-2.5 rounded-lg text-white border border-white/10 bg-black/30">' +
                            '<div class="text-[10px] text-gray-500 flex justify-between">' +
                                '<span>Est. Value</span>' +
                                '<span class="text-white font-mono" id="generic-trade-est">\u20B9' + (bPrice * 10).toFixed(2) + '</span>' +
                            '</div>' +
                            '<div class="grid grid-cols-2 gap-2">' +
                                '<button id="generic-buy-btn" class="bg-emerald-500 hover:bg-emerald-600 text-black font-bold text-xs py-2.5 rounded-xl transition">BUY</button>' +
                                '<button id="generic-sell-btn" class="bg-red-500 hover:bg-red-600 text-white font-bold text-xs py-2.5 rounded-xl transition">SELL</button>' +
                            '</div>' +
                            '<p class="text-[10px] text-gray-500 text-center pt-2 border-t border-white/5">Cash: <strong class="text-white" id="generic-trade-cash">\u20B9' + data.userState.portfolio.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</strong></p>' +
                            '<div id="generic-trade-position" class="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-[10px] hidden">' +
                                '<div class="flex justify-between text-gray-500">' +
                                    '<span>Shares Owned</span>' +
                                    '<strong class="text-emerald-400 font-mono" id="generic-position-shares">0 Shares</strong>' +
                                '</div>' +
                                '<div class="flex justify-between text-gray-500">' +
                                    '<span>Avg. Cost</span>' +
                                    '<strong class="text-white font-mono" id="generic-position-avg">\u20B90.00</strong>' +
                                '</div>' +
                                '<div class="flex justify-between text-gray-500">' +
                                    '<span>Position Value</span>' +
                                    '<strong class="text-white font-mono" id="generic-position-val">\u20B90.00</strong>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>';

            lucide.createIcons();

            // ---- RENDER CHARTS ----
            setTimeout(function() {
                var ohlcLocal  = ohlcData;
                var revLocal   = revData;
                var promoL     = promo_;
                var fiiL       = fii_;
                var diiL       = dii_;
                var retailL    = retail_;
                var showCandle = true;

                // ====== PRICE CHART ======
                var priceCanvas = document.getElementById('stock-price-chart');
                if (priceCanvas) {
                    priceCanvas.style.cursor = 'crosshair';
                    var hoverIdx = -1; // -1 = no hover

                    function drawPriceChart(mode) {
                        var ctx = priceCanvas.getContext('2d');
                        var d = ohlcLocal;
                        if (!d || !d.length) return;

                        var rect = priceCanvas.getBoundingClientRect();
                        var W_val = rect.width || 600;
                        var H_val = rect.height || 270;

                        var dpr = window.devicePixelRatio || 1;
                        priceCanvas.width = W_val * dpr;
                        priceCanvas.height = H_val * dpr;
                        ctx.scale(dpr, dpr);

                        var allH = d.map(function(c){ return c.high; });
                        var allL = d.map(function(c){ return c.low; });
                        var minP = Math.min.apply(null, allL) * 0.996;
                        var maxP = Math.max.apply(null, allH) * 1.004;
                        var padT = 18, padB = 40, padR = 55;
                        var chartH = H_val - padT - padB;
                        var chartW = W_val - padR;
                        var colW = chartW / d.length;

                        function yOf(v) { return padT + chartH - ((v - minP) / (maxP - minP)) * chartH; }
                        function xOf(i) { return i * colW + colW / 2; }

                        // Background
                        ctx.clearRect(0, 0, W_val, H_val);
                        ctx.fillStyle = '#0c0c0e';
                        ctx.fillRect(0, 0, W_val, H_val);

                        // Grid + Y-axis labels
                        for (var g = 0; g <= 5; g++) {
                            var gy = padT + (g / 5) * chartH;
                            ctx.strokeStyle = 'rgba(255,255,255,0.04)';
                            ctx.lineWidth = 1;
                            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(chartW, gy); ctx.stroke();
                            var gv = maxP - (g / 5) * (maxP - minP);
                            ctx.fillStyle = 'rgba(255,255,255,0.35)';
                            ctx.font = '9px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText('\u20B9' + gv.toFixed(0), chartW + 4, gy + 3);
                        }

                        // X-axis date labels (drawn higher from bottom to prevent clipping)
                        ctx.fillStyle = 'rgba(255,255,255,0.35)';
                        ctx.font = '9px sans-serif';
                        ctx.textAlign = 'center';
                        for (var di = 0; di < d.length; di++) {
                            if (di % 5 === 0 || di === d.length - 1) {
                                ctx.fillText(d[di].date || '', xOf(di), H_val - 12);
                            }
                        }

                        // SMA-10 calculation
                        var sma = [];
                        for (var si = 0; si < d.length; si++) {
                            if (si < 9) { sma.push(null); continue; }
                            var s = 0; for (var j = si - 9; j <= si; j++) s += d[j].close;
                            sma.push(s / 10);
                        }

                        if (mode === 'candle') {
                            // Draw candlesticks
                            d.forEach(function(c, i) {
                                var x = xOf(i);
                                var bull = c.close >= c.open;
                                ctx.strokeStyle = bull ? '#10b981' : '#ef4444';
                                ctx.fillStyle = bull ? '#10b981' : '#ef4444';
                                ctx.lineWidth = 1;
                                // Wick
                                ctx.beginPath(); ctx.moveTo(x, yOf(c.high)); ctx.lineTo(x, yOf(c.low)); ctx.stroke();
                                // Body
                                var bw = Math.max(3, colW * 0.6);
                                var top = yOf(Math.max(c.open, c.close));
                                var bh = Math.max(1.5, Math.abs(yOf(c.open) - yOf(c.close)));
                                ctx.fillRect(x - bw/2, top, bw, bh);
                            });

                            // SMA overlay
                            ctx.beginPath();
                            var started = false;
                            for (var k = 0; k < d.length; k++) {
                                if (sma[k] !== null) {
                                    if (!started) { ctx.moveTo(xOf(k), yOf(sma[k])); started = true; }
                                    else ctx.lineTo(xOf(k), yOf(sma[k]));
                                }
                            }
                            ctx.strokeStyle = '#f59e0b';
                            ctx.lineWidth = 1.5;
                            ctx.setLineDash([4, 3]);
                            ctx.stroke();
                            ctx.setLineDash([]);
                            // SMA label
                            ctx.fillStyle = '#f59e0b';
                            ctx.font = '9px sans-serif';
                            ctx.textAlign = 'right';
                            ctx.fillText('— SMA 10', chartW - 2, padT + 12);
                        } else {
                            // Line chart
                            ctx.beginPath();
                            d.forEach(function(c, i) {
                                if (i === 0) ctx.moveTo(xOf(i), yOf(c.close));
                                else ctx.lineTo(xOf(i), yOf(c.close));
                            });
                            ctx.strokeStyle = '#10b981';
                            ctx.lineWidth = 2.5;
                            ctx.stroke();
                            // Area fill
                            ctx.lineTo(xOf(d.length - 1), H_val - padB);
                            ctx.lineTo(xOf(0), H_val - padB);
                            ctx.closePath();
                            var grd = ctx.createLinearGradient(0, padT, 0, H_val - padB);
                            grd.addColorStop(0, 'rgba(16,185,129,0.30)');
                            grd.addColorStop(1, 'rgba(16,185,129,0.0)');
                            ctx.fillStyle = grd;
                            ctx.fill();
                        }

                        // Crosshair tooltip (only when hovering)
                        if (hoverIdx >= 0 && hoverIdx < d.length) {
                            var bar = d[hoverIdx];
                            var bx = xOf(hoverIdx);
                            var by = yOf(bar.close);

                            // Crosshair lines
                            ctx.strokeStyle = 'rgba(255,255,255,0.18)';
                            ctx.lineWidth = 0.7;
                            ctx.setLineDash([3, 3]);
                            ctx.beginPath(); ctx.moveTo(bx, padT); ctx.lineTo(bx, H_val - padB); ctx.stroke();
                            ctx.beginPath(); ctx.moveTo(0, by); ctx.lineTo(chartW, by); ctx.stroke();
                            ctx.setLineDash([]);

                            // Dot
                            var dotColor = bar.close >= bar.open ? '#10b981' : '#ef4444';
                            ctx.beginPath(); ctx.arc(bx, by, 5, 0, Math.PI * 2);
                            ctx.fillStyle = dotColor; ctx.fill();
                            ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

                            // Tooltip box
                            var tw = 160, th = 72;
                            var tx = (bx + tw + 15 < W_val) ? bx + 12 : bx - tw - 12;
                            var ty = Math.max(padT, by - th / 2);
                            // Rounded box
                            ctx.fillStyle = 'rgba(0,0,0,0.92)';
                            ctx.beginPath();
                            ctx.moveTo(tx + 5, ty); ctx.lineTo(tx + tw - 5, ty);
                            ctx.quadraticCurveTo(tx + tw, ty, tx + tw, ty + 5);
                            ctx.lineTo(tx + tw, ty + th - 5);
                            ctx.quadraticCurveTo(tx + tw, ty + th, tx + tw - 5, ty + th);
                            ctx.lineTo(tx + 5, ty + th);
                            ctx.quadraticCurveTo(tx, ty + th, tx, ty + th - 5);
                            ctx.lineTo(tx, ty + 5);
                            ctx.quadraticCurveTo(tx, ty, tx + 5, ty);
                            ctx.closePath(); ctx.fill();
                            ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 1; ctx.stroke();

                            // Safe format
                            function fmt(v) { return (typeof v === 'number' && !isNaN(v)) ? '\u20B9' + v.toFixed(2) : '\u20B9--'; }

                            ctx.textAlign = 'left';
                            ctx.fillStyle = '#fff'; ctx.font = 'bold 10px sans-serif';
                            ctx.fillText('Date: ' + (bar.date || ''), tx + 8, ty + 15);

                            ctx.fillStyle = '#d4d4d8'; ctx.font = '9px monospace';
                            ctx.fillText('O: ' + fmt(bar.open) + '  C: ' + fmt(bar.close), tx + 8, ty + 30);
                            ctx.fillText('H: ' + fmt(bar.high) + '  L: ' + fmt(bar.low), tx + 8, ty + 43);

                            var pct = (bar.open > 0) ? ((bar.close - bar.open) / bar.open * 100).toFixed(2) : '0.00';
                            var up = parseFloat(pct) >= 0;
                            ctx.fillStyle = up ? '#10b981' : '#ef4444';
                            ctx.font = 'bold 10px monospace';
                            ctx.fillText('Change: ' + (up ? '+' : '') + pct + '%', tx + 8, ty + 58);

                            // Price label on Y-axis
                            ctx.fillStyle = dotColor;
                            ctx.font = 'bold 9px monospace';
                            ctx.textAlign = 'left';
                            ctx.fillText(fmt(bar.close), chartW + 4, by + 3);
                        }
                    }

                    // Initial draw
                    drawPriceChart('candle');

                    // Hover handler (no recursion — uses requestAnimationFrame)
                    priceCanvas.addEventListener('mousemove', function(e) {
                        var rect = priceCanvas.getBoundingClientRect();
                        var mx = e.clientX - rect.left;
                        var chartW2 = rect.width - 55;
                        var colW2 = chartW2 / ohlcLocal.length;
                        hoverIdx = Math.min(ohlcLocal.length - 1, Math.max(0, Math.floor(mx / colW2)));
                        drawPriceChart(showCandle ? 'candle' : 'line');
                    });
                    priceCanvas.addEventListener('mouseleave', function() {
                        hoverIdx = -1;
                        drawPriceChart(showCandle ? 'candle' : 'line');
                    });

                    // Toggle buttons
                    var btnC = document.getElementById('btn-candle');
                    var btnL = document.getElementById('btn-line');
                    if (btnC) {
                        btnC.addEventListener('click', function() {
                            showCandle = true; hoverIdx = -1;
                            drawPriceChart('candle');
                            btnC.className = 'text-[9px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition';
                            btnL.className = 'text-[9px] font-bold px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 transition';
                        });
                    }
                    if (btnL) {
                        btnL.addEventListener('click', function() {
                            showCandle = false; hoverIdx = -1;
                            drawPriceChart('line');
                            btnL.className = 'text-[9px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition';
                            btnC.className = 'text-[9px] font-bold px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 border border-white/10 transition';
                        });
                    }
                }

                // ====== PIE / DONUT CHART ======
                (function() {
                    var holdings = [
                        { label: 'Promoters', value: promoL, color: '#10b981' },
                        { label: 'FII', value: fiiL, color: '#3b82f6' },
                        { label: 'DII', value: diiL, color: '#f59e0b' },
                        { label: 'Retail', value: retailL, color: '#8b5cf6' }
                    ];
                    drawDonutChart('shareholding-chart', holdings);
                })();

                // ====== REVENUE BAR CHART ======
                (function() {
                    var rc = document.getElementById('revenue-chart');
                    if (!rc) return;
                    var rect = rc.getBoundingClientRect();
                    var W3 = rect.width || 500;
                    var H3 = rect.height || 150;

                    var dpr = window.devicePixelRatio || 1;
                    rc.width = W3 * dpr;
                    rc.height = H3 * dpr;
                    var ctx3 = rc.getContext('2d');
                    ctx3.scale(dpr, dpr);
                    var rmax = Math.max.apply(null, revLocal);
                    var slot = (W3 - 20) / revLocal.length;
                    var bW3 = slot - 8;
                    var qLabels = ['Q1FY24','Q2FY24','Q3FY24','Q4FY24','Q1FY25','Q2FY25','Q3FY25','Q4FY25'];

                    ctx3.clearRect(0, 0, W3, H3);

                    // Grid
                    for (var gi = 1; gi <= 3; gi++) {
                        var gy = (gi / 4) * (H3 - 30);
                        ctx3.strokeStyle = 'rgba(255,255,255,0.04)';
                        ctx3.lineWidth = 1;
                        ctx3.beginPath(); ctx3.moveTo(10, gy); ctx3.lineTo(W3 - 10, gy); ctx3.stroke();
                    }

                    revLocal.forEach(function(v, i) {
                        var barH = ((v / rmax) * (H3 - 35));
                        var x = 10 + i * slot + 4;
                        var y = H3 - barH - 24;
                        var grad = ctx3.createLinearGradient(0, y, 0, H3 - 24);
                        grad.addColorStop(0, '#10b981');
                        grad.addColorStop(1, 'rgba(16,185,129,0.08)');
                        ctx3.fillStyle = grad;
                        ctx3.beginPath();
                        if (ctx3.roundRect) {
                            ctx3.roundRect(x, y, bW3, barH, [5, 5, 0, 0]);
                        } else {
                            ctx3.rect(x, y, bW3, barH);
                        }
                        ctx3.fill();
                        // Quarter label
                        ctx3.fillStyle = 'rgba(255,255,255,0.4)';
                        ctx3.font = '8px sans-serif';
                        ctx3.textAlign = 'center';
                        ctx3.fillText(qLabels[i] || '', x + bW3 / 2, H3 - 7);
                        // Value on top
                        if (barH > 20) {
                            ctx3.fillStyle = 'rgba(255,255,255,0.65)';
                            ctx3.font = '9px monospace';
                            ctx3.fillText('\u20B9' + Math.round(v / 100) + 'Cr', x + bW3 / 2, y - 5);
                        }
                    });
                })();

            }, 200);

            // Trade bindings
            var sharesInp = document.getElementById('generic-trade-shares');
            if (sharesInp) {
                sharesInp.addEventListener('input', function() {
                    var est   = parseFloat(this.value || 1) * bPrice;
                    var estEl = document.getElementById('generic-trade-est');
                    if (estEl) estEl.textContent = '\u20B9' + est.toFixed(2);
                });
            }
            // Refresh Quick Trade position UI helper
            function updateQuickTradePositionUI() {
                var existing = data.userState.portfolio.holdings.find(function(h) { return h.symbol === symbol; });
                var posDiv = document.getElementById('generic-trade-position');
                var sharesEl = document.getElementById('generic-position-shares');
                var avgEl = document.getElementById('generic-position-avg');
                var valEl = document.getElementById('generic-position-val');
                if (posDiv) {
                    if (existing && existing.shares > 0) {
                        var avgCost = existing.avgCost !== undefined ? existing.avgCost : (existing.avg_cost || 0);
                        posDiv.classList.remove('hidden');
                        if (sharesEl) sharesEl.textContent = existing.shares + ' Shares';
                        if (avgEl) avgEl.textContent = '\u20B9' + avgCost.toFixed(2);
                        if (valEl) valEl.textContent = '\u20B9' + (existing.shares * bPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                    } else {
                        posDiv.classList.add('hidden');
                    }
                }
            }
            updateQuickTradePositionUI();

            var buyBtnEl  = document.getElementById('generic-buy-btn');
            var sellBtnEl = document.getElementById('generic-sell-btn');
            if (buyBtnEl) {
                buyBtnEl.addEventListener('click', async function() {
                    var sh  = parseInt((document.getElementById('generic-trade-shares') || {value:'1'}).value) || 1;
                    if (window.PortfolioManager) {
                        var res = await window.PortfolioManager.addTransaction('BUY', symbol, sh, bPrice);
                        if (res && res.msg) window.showToast(res.msg, res.success ? 'success' : 'error');
                        var cashEl = document.getElementById('generic-trade-cash');
                        if (cashEl) cashEl.textContent = '₹' + data.userState.portfolio.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        var detailCashEl = document.getElementById('detail-trade-cash');
                        if (detailCashEl) detailCashEl.textContent = '₹' + data.userState.portfolio.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        updateQuickTradePositionUI();
                    }
                });
            }
            if (sellBtnEl) {
                sellBtnEl.addEventListener('click', async function() {
                    var sh  = parseInt((document.getElementById('generic-trade-shares') || {value:'1'}).value) || 1;
                    if (window.PortfolioManager) {
                        var res = await window.PortfolioManager.addTransaction('SELL', symbol, sh, bPrice);
                        if (res && res.msg) window.showToast(res.msg, res.success ? 'success' : 'error');
                        var cashEl = document.getElementById('generic-trade-cash');
                        if (cashEl) cashEl.textContent = '₹' + data.userState.portfolio.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        var detailCashEl = document.getElementById('detail-trade-cash');
                        if (detailCashEl) detailCashEl.textContent = '₹' + data.userState.portfolio.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                        updateQuickTradePositionUI();
                    }
                });
            }
            return;
        }

        // Pre-build tabs and content wrapper
        container.innerHTML = `
            <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
                <div class="flex items-center gap-4">
                    <img src="${stock.logo}" alt="${stock.name}" class="w-14 h-14 object-contain rounded-xl bg-white p-2">
                    <div>
                        <div class="flex items-center gap-2">
                            <h1 class="font-poppins font-black text-2xl text-white tracking-tight">${stock.name}</h1>
                            <span class="bg-white/5 text-[9px] text-gray-400 border border-white/5 px-2 py-0.5 rounded font-mono font-bold">${stock.symbol}</span>
                        </div>
                        <p class="text-xs text-gray-400 mt-1">${stock.sector} | CEO: ${stock.ceo}</p>
                    </div>
                </div>
                <div class="flex items-center gap-4">
                    <div class="text-right">
                        <span class="text-[10px] text-gray-500 font-bold block uppercase tracking-wider">Live Exchange Price</span>
                        <div class="flex items-baseline gap-2 mt-0.5 justify-end">
                            <span class="font-poppins font-black text-3xl text-white font-mono" id="detail-live-price">₹${stock.price.toFixed(2)}</span>
                            <span class="text-sm font-bold font-mono" id="detail-live-change">--</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Page Tabs menu -->
            <div class="border-b border-white/5 flex gap-6 text-xs font-semibold overflow-x-auto scrollbar-none pb-2 select-none">
                <button class="detail-tab-btn active pb-2 border-b-2 border-transparent transition text-gray-400 hover:text-white" data-tab="overview">Overview & Ratios</button>
                <button class="detail-tab-btn pb-2 border-b-2 border-transparent transition text-gray-400 hover:text-white" data-tab="chart">Technical Charts</button>
                <button class="detail-tab-btn pb-2 border-b-2 border-transparent transition text-gray-400 hover:text-white" data-tab="financials">Financial Statements</button>
                <button class="detail-tab-btn pb-2 border-b-2 border-transparent transition text-gray-400 hover:text-white" data-tab="shareholding">Shareholding Pattern</button>
                <button class="detail-tab-btn pb-2 border-b-2 border-transparent transition text-gray-400 hover:text-white" data-tab="actions">Corporate Actions</button>
                <button class="detail-tab-btn pb-2 border-b-2 border-transparent text-amber-400 hover:text-amber-300 flex items-center gap-1" data-tab="ai">
                    <i data-lucide="brain" class="w-3.5 h-3.5 text-amber-500"></i> AI DNA Report
                </button>
            </div>

            <!-- TABS MOUNT POINT -->
            <div id="detail-tab-content" class="animate-fade-in">
                <!-- Swapped dynamic tabs -->
            </div>
        `;

        lucide.createIcons();

        // Switch to default overview tab
        switchDetailTab(symbol, "overview");

        // Handle live changes indicators
        updateCompanyDetailsPrices();

        // Bind tab buttons
        document.querySelectorAll(".detail-tab-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                document.querySelectorAll(".detail-tab-btn").forEach(b => b.classList.remove("active", "border-amber-400", "text-white", "text-amber-400"));
                const tab = btn.getAttribute("data-tab");
                if (tab === "ai") {
                    btn.classList.add("active", "border-amber-400", "text-amber-400");
                } else {
                    btn.classList.add("active", "border-b-2", "border-white", "text-white");
                }
                switchDetailTab(symbol, tab);
            });
        });
    }

    function updateCompanyDetailsPrices() {
        const pEl = document.getElementById("detail-live-price");
        if (!pEl) return;
        
        // Look up in allStocksList first, then data.stocks
        const fromList = data.allStocksList.find(function(s){ return s.symbol === activeStockSymbol; });
        const fromStocks = data.stocks[activeStockSymbol];
        const price = fromList ? fromList.price : (fromStocks ? fromStocks.price : null);
        const chg = fromList ? fromList.changePercent : (fromStocks ? fromStocks.changePercent : 0);
        
        if (price === null) return;

        pEl.textContent = '\u20B9' + price.toFixed(2);
        
        const isPos = chg >= 0;
        const cEl = document.getElementById("detail-live-change");
        if (cEl) {
            cEl.textContent = (isPos ? '+' : '') + chg.toFixed(2) + '%';
            cEl.className = 'text-sm font-bold font-mono ' + (isPos ? 'text-emerald-400' : 'text-red-400');
        }
    }

    function switchDetailTab(symbol, tabName) {
        const pane = document.getElementById("detail-tab-content");
        if (!pane) return;

        const baseInfo = data.allStocksList.find(function(s){ return s.symbol === symbol; }) || {
            name: symbol, sector: 'Indian Equity', price: 100, prevClose: 100,
            changePercent: 0, pe: 0, roe: 0, marketCap: 'N/A',
            high52w: 110, low52w: 90, cap: 'Large'
        };

        const stock = data.stocks[symbol] || {
            symbol: symbol,
            name: baseInfo.name,
            industry: baseInfo.sector,
            sector: baseInfo.sector,
            ceo: "N/A",
            price: baseInfo.price,
            prevClose: baseInfo.prevClose,
            marketCap: baseInfo.marketCap,
            faceValue: 10,
            bookValue: parseFloat((baseInfo.price * 0.35).toFixed(2)),
            peRatio: baseInfo.pe || 15.0,
            pbRatio: 2.1,
            roe: baseInfo.roe || 12.0,
            roce: parseFloat((baseInfo.roe * 0.9).toFixed(2)) || 10.8,
            eps: parseFloat((baseInfo.price / (baseInfo.pe || 15.0)).toFixed(2)),
            dividendYield: 1.2,
            debtToEquity: 0.45,
            freeCashFlow: "500 Cr",
            holdings: {
                promoter: Math.round(35 + Math.random() * 25),
                fii: Math.round(15 + Math.random() * 18),
                dii: Math.round(10 + Math.random() * 13),
                retail: 20
            },
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 100 },
                    { item: "Reserves & Surplus", value: 2500 },
                    { item: "Long Term Debt", value: 500 },
                    { item: "Other Liabilities", value: 1200 }
                ],
                assets: [
                    { item: "Fixed Assets", value: 2200 },
                    { item: "Investments", value: 800 },
                    { item: "Cash Equivalents", value: 400 },
                    { item: "Other Assets", value: 900 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: Math.round(baseInfo.price * 1200), profit: Math.round(baseInfo.price * 100) },
                { year: "FY23", revenue: Math.round(baseInfo.price * 1100), profit: Math.round(baseInfo.price * 90) },
                { year: "FY22", revenue: Math.round(baseInfo.price * 1000), profit: Math.round(baseInfo.price * 80) }
            ],
            corporateActions: {
                dividends: [],
                bonus: [],
                splits: []
            },
            news: [
                { date: "Recent", title: `${baseInfo.name} expands operations across key markets`, sentiment: "Bullish" }
            ],
            peers: []
        };
        stock.holdings.retail = 100 - stock.holdings.promoter - stock.holdings.fii - stock.holdings.dii;
        
        switch (tabName) {
            case "overview":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
                        <!-- Key metrics ratios card -->
                        <div class="lg:col-span-2 glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white">Stock Ratios Valuation</h3>
                            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">Market Cap</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">${stock.marketCap}</strong>
                                </div>
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">P/E Ratio (PE)</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">${stock.peRatio}x</strong>
                                </div>
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">Book Value</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">₹${stock.bookValue}</strong>
                                </div>
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">ROE / ROCE (%)</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">${stock.roe}% / ${stock.roce}%</strong>
                                </div>
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">Debt to Equity</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">${stock.debtToEquity}</strong>
                                </div>
                                <div class="p-3 border border-white/5 rounded-xl bg-zinc-900/40">
                                    <span class="text-gray-500 block text-[9px] uppercase">Dividend Yield</span>
                                    <strong class="text-white mt-1 block text-sm font-mono">${stock.dividendYield}%</strong>
                                </div>
                            </div>
                        </div>

                        <!-- Trade transaction console -->
                        <div class="glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-1">
                                <i data-lucide="wallet" class="w-4 h-4 text-emerald-400"></i> Trade Terminal
                            </h3>
                            <div class="space-y-3">
                                <div>
                                    <label class="text-[9px] text-gray-500 font-bold block mb-0.5">SHARES COUNT</label>
                                    <input type="number" id="detail-trade-shares" value="10" class="w-full glass-input text-xs p-2 rounded-lg text-white">
                                </div>
                                <div class="grid grid-cols-2 gap-2">
                                    <button id="detail-buy-btn" class="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs py-2.5 rounded-lg transition">BUY SHARE</button>
                                    <button id="detail-sell-btn" class="bg-red-500 hover:bg-red-600 text-white font-semibold text-xs py-2.5 rounded-lg transition">SELL SHARE</button>
                                </div>
                                <div class="text-[10px] text-gray-500 text-center border-t border-white/5 pt-2 flex justify-between">
                                    <span>Cash balance: <strong class="text-white" id="detail-trade-cash">₹${data.userState.portfolio.cash.toLocaleString()}</strong></span>
                                    <button class="text-amber-400 hover:underline" onclick="window.location.hash='#portfolio'">Open portfolio ledger</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Bind trade terminal
                document.getElementById("detail-buy-btn").addEventListener("click", async () => {
                    const sh = parseInt(document.getElementById("detail-trade-shares").value);
                    const res = await window.PortfolioManager.addTransaction("BUY", symbol, sh, stock.price);
                    alert(res.msg);
                    setupCompanyDetailsView(symbol);
                });
                document.getElementById("detail-sell-btn").addEventListener("click", async () => {
                    const sh = parseInt(document.getElementById("detail-trade-shares").value);
                    const res = await window.PortfolioManager.addTransaction("SELL", symbol, sh, stock.price);
                    alert(res.msg);
                    setupCompanyDetailsView(symbol);
                });
                break;

            case "chart":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-4">
                        <!-- Chart Workspace -->
                        <div class="lg:col-span-3 glass-card p-5 rounded-2xl space-y-4">
                            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-white/5 pb-2.5">
                                <div class="flex flex-wrap gap-2 text-[10px] font-semibold">
                                    <!-- Types -->
                                    <button class="chart-type-toggle px-2.5 py-1 rounded bg-white/10 text-white transition" data-type="area">Area</button>
                                    <button class="chart-type-toggle px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition" data-type="candlestick">Candlestick</button>
                                    <button class="chart-type-toggle px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition" data-type="line">Line</button>
                                </div>
                                <div class="flex flex-wrap gap-2 text-[10px] font-semibold">
                                    <!-- Ranges -->
                                    <button class="chart-range-toggle px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition" data-range="1D">1D</button>
                                    <button class="chart-range-toggle px-2.5 py-1 rounded bg-white/10 text-white transition active" data-range="1M">1M</button>
                                    <button class="chart-range-toggle px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition" data-range="1Y">1Y</button>
                                    <button class="chart-range-toggle px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-gray-400 transition" data-range="MAX">MAX</button>
                                </div>
                            </div>
                            <div class="h-80 relative bg-black/45 rounded-xl border border-white/5 overflow-hidden">
                                <canvas id="detail-canvas-board" class="w-full h-full"></canvas>
                                <!-- Interactive Hover Details Overlay -->
                                <div id="detail-chart-hover-overlay" class="absolute top-2 left-2 bg-[#121217]/90 border border-white/10 rounded-lg p-2 text-[9px] font-semibold space-y-0.5 text-gray-300 hidden pointer-events-none">
                                    <div>Date: <span id="dt-date" class="text-white">--</span></div>
                                    <div>O: <span id="dt-open">--</span> | C: <span id="dt-close">--</span></div>
                                    <div>H: <span id="dt-high">--</span> | L: <span id="dt-low">--</span></div>
                                </div>
                            </div>
                        </div>

                        <!-- Technical Indicators Control panel -->
                        <div class="glass-card p-5 rounded-2xl space-y-4 text-xs">
                            <h3 class="font-poppins font-bold text-sm text-white">Technical Overlays</h3>
                            <div class="space-y-3.5">
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" class="indicator-cb accent-emerald-500" data-ind="SMA">
                                    <span>SMA Overlay (20 Days)</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" class="indicator-cb accent-emerald-500" data-ind="EMA">
                                    <span>EMA Overlay (20 Days)</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" class="indicator-cb accent-emerald-500" data-ind="VWAP">
                                    <span>VWAP Indicator</span>
                                </label>
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" class="indicator-cb accent-emerald-500" data-ind="BollingerBands">
                                    <span>Bollinger Bands</span>
                                </label>
                                
                                <div class="border-t border-white/5 pt-3.5 space-y-3">
                                    <h4 class="font-poppins font-bold text-[10px] text-gray-500 uppercase">Sub-Charts Oscillators</h4>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sub-ind" class="sub-ind-rb accent-emerald-500" data-ind="RSI">
                                        <span>RSI Sub-chart (14)</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sub-ind" class="sub-ind-rb accent-emerald-500" data-ind="MACD">
                                        <span>MACD (12, 26, 9)</span>
                                    </label>
                                    <label class="flex items-center gap-2 cursor-pointer">
                                        <input type="radio" name="sub-ind" checked class="sub-ind-rb accent-emerald-500" data-ind="NONE">
                                        <span>None (Hide panel)</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Render detail chart
                const drawDetailChart = () => {
                    window.BullVerseCharts.renderChart(
                        "detail-canvas-board",
                        symbol,
                        activeChartType,
                        activeChartRange,
                        chartIndicators,
                        (pt) => {
                            document.getElementById("dt-date").textContent = pt.date;
                            document.getElementById("dt-open").textContent = pt.open.toFixed(1);
                            document.getElementById("dt-close").textContent = pt.close.toFixed(1);
                            document.getElementById("dt-high").textContent = pt.high.toFixed(1);
                            document.getElementById("detail-chart-hover-overlay").classList.remove("hidden");
                        }
                    );
                };

                drawDetailChart();

                // Bind controls
                document.querySelectorAll(".chart-type-toggle").forEach(btn => {
                    btn.addEventListener("click", () => {
                        document.querySelectorAll(".chart-type-toggle").forEach(b => b.classList.remove("bg-white/10", "text-white"));
                        btn.classList.add("bg-white/10", "text-white");
                        activeChartType = btn.getAttribute("data-type");
                        drawDetailChart();
                    });
                });
                document.querySelectorAll(".chart-range-toggle").forEach(btn => {
                    btn.addEventListener("click", () => {
                        document.querySelectorAll(".chart-range-toggle").forEach(b => b.classList.remove("bg-white/10", "text-white"));
                        btn.classList.add("bg-white/10", "text-white");
                        activeChartRange = btn.getAttribute("data-range");
                        drawDetailChart();
                    });
                });

                // Checkboxes
                document.querySelectorAll(".indicator-cb").forEach(cb => {
                    cb.addEventListener("change", () => {
                        const ind = cb.getAttribute("data-ind");
                        chartIndicators[ind] = cb.checked;
                        drawDetailChart();
                    });
                });

                document.querySelectorAll(".sub-ind-rb").forEach(rb => {
                    rb.addEventListener("change", () => {
                        chartIndicators.RSI = false;
                        chartIndicators.MACD = false;
                        const ind = rb.getAttribute("data-ind");
                        if (ind !== "NONE") chartIndicators[ind] = true;
                        drawDetailChart();
                    });
                });
                break;

            case "financials":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
                        <!-- P&L Statement -->
                        <div class="glass-card p-5 rounded-2xl space-y-3">
                            <h3 class="font-poppins font-bold text-sm text-white">Profit & Loss Statement (₹ Cr)</h3>
                            <table class="w-full text-left">
                                <thead class="text-gray-500 font-semibold border-b border-white/5">
                                    <tr>
                                        <th class="pb-2">Year</th>
                                        <th class="pb-2">Total Revenue</th>
                                        <th class="pb-2 text-right">Net Profit</th>
                                    </tr>
                                </thead>
                                <tbody class="divide-y divide-white/2 text-gray-300">
                                    ${stock.profitAndLoss.map(pl => `
                                        <tr>
                                            <td class="py-2.5 font-bold">${pl.year}</td>
                                            <td class="py-2.5">${pl.revenue.toLocaleString()}</td>
                                            <td class="py-2.5 text-right font-semibold ${pl.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}">
                                                ${pl.profit.toLocaleString()}
                                            </td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        </div>

                        <!-- Balance Sheet Statement -->
                        <div class="glass-card p-5 rounded-2xl space-y-3">
                            <h3 class="font-poppins font-bold text-sm text-white">Balance Sheet Summary</h3>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <span class="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Total Assets</span>
                                    <div class="divide-y divide-white/2 text-gray-300 mt-2">
                                        ${stock.balanceSheet.assets.map(as => `
                                            <div class="flex justify-between py-1.5">
                                                <span>${as.item}</span>
                                                <strong class="text-white">${as.value} Cr</strong>
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                                <div>
                                    <span class="text-[9px] uppercase tracking-wider text-gray-500 font-bold">Equity & Liabilities</span>
                                    <div class="divide-y divide-white/2 text-gray-300 mt-2">
                                        ${stock.balanceSheet.liabilities.map(li => `
                                            <div class="flex justify-between py-1.5">
                                                <span>${li.item}</span>
                                                <strong class="text-white">${li.value} Cr</strong>
                                            </div>
                                        `).join("")}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case "shareholding":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 text-xs">
                        <div class="glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white">Shareholding Distribution</h3>
                            <div class="relative w-44 h-44 mx-auto">
                                <canvas id="shareholding-pie-canvas" class="w-full h-full mx-auto"></canvas>
                            </div>
                        </div>
                        <div class="glass-card p-5 rounded-2xl space-y-3 flex flex-col justify-center">
                            <h4 class="font-poppins font-bold text-[10px] text-gray-500 uppercase tracking-widest">Shareholder Stakes</h4>
                            <div class="space-y-2.5">
                                <div class="flex items-center justify-between">
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded bg-emerald-500"></span> Promoters</span>
                                    <strong class="text-white font-mono">${stock.holdings.promoter}%</strong>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded bg-blue-500"></span> FII (Foreign Inst)</span>
                                    <strong class="text-white font-mono">${stock.holdings.fii}%</strong>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded bg-yellow-500"></span> DII (Mutual Funds)</span>
                                    <strong class="text-white font-mono">${stock.holdings.dii}%</strong>
                                </div>
                                <div class="flex items-center justify-between">
                                    <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded bg-gray-500"></span> Retail Public</span>
                                    <strong class="text-white font-mono">${stock.holdings.retail}%</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                `;

                // Draw pie
                setTimeout(() => {
                    const holdings = [
                        { label: "Promoters", value: stock.holdings.promoter, color: "#10b981" },
                        { label: "FII", value: stock.holdings.fii, color: "#3b82f6" },
                        { label: "DII", value: stock.holdings.dii, color: "#f59e0b" },
                        { label: "Retail", value: stock.holdings.retail, color: "#6b7280" }
                    ];
                    drawDonutChart("shareholding-pie-canvas", holdings);
                }, 100);
                break;

            case "actions":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-xs">
                        <div class="glass-card p-5 rounded-2xl space-y-3">
                            <h4 class="font-poppins font-bold text-xs text-white">Dividends History</h4>
                            <div class="divide-y divide-white/2">
                                ${stock.corporateActions.dividends.map(div => `
                                    <div class="flex justify-between py-2">
                                        <span class="text-gray-400">${div.date} (${div.type})</span>
                                        <strong class="text-white">${div.amount}</strong>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                        <div class="glass-card p-5 rounded-2xl space-y-3">
                            <h4 class="font-poppins font-bold text-xs text-white">Bonus History</h4>
                            <div class="divide-y divide-white/2">
                                ${stock.corporateActions.bonus.map(bo => `
                                    <div class="flex justify-between py-2">
                                        <span class="text-gray-400">${bo.date}</span>
                                        <strong class="text-white">${bo.ratio}</strong>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                        <div class="glass-card p-5 rounded-2xl space-y-3">
                            <h4 class="font-poppins font-bold text-xs text-white">Splits History</h4>
                            <div class="divide-y divide-white/2">
                                ${stock.corporateActions.splits.map(sp => `
                                    <div class="flex justify-between py-2">
                                        <span class="text-gray-400">${sp.date}</span>
                                        <strong class="text-white">${sp.ratio}</strong>
                                    </div>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                `;
                break;

            case "ai":
                pane.innerHTML = `
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4 text-xs">
                        <!-- Scoreboard bars -->
                        <div class="lg:col-span-2 glass-card p-5 rounded-2xl space-y-4">
                            <h3 class="font-poppins font-bold text-sm text-white">AI Diagnostic DNA Scores</h3>
                            <div class="space-y-3">
                                <div>
                                    <div class="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                                        <span>Revenue Growth Momentum</span>
                                        <span class="text-white">${stock.aiScore.dna.growth}/100</span>
                                    </div>
                                    <div class="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                                        <div class="h-full bg-emerald-500 dna-bar-fill" style="width: ${stock.aiScore.dna.growth}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                                        <span>Valuation Safety Margin</span>
                                        <span class="text-white">${stock.aiScore.dna.valuation}/100</span>
                                    </div>
                                    <div class="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                                        <div class="h-full bg-amber-500 dna-bar-fill" style="width: ${stock.aiScore.dna.valuation}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                                        <span>Balance Sheet Stability</span>
                                        <span class="text-white">${stock.aiScore.dna.stability}/100</span>
                                    </div>
                                    <div class="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                                        <div class="h-full bg-emerald-500 dna-bar-fill" style="width: ${stock.aiScore.dna.stability}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between text-[11px] font-bold text-gray-400 mb-1">
                                        <span>Corporate Governance Quality</span>
                                        <span class="text-white">${stock.aiScore.dna.governance}/100</span>
                                    </div>
                                    <div class="w-full h-2 rounded bg-zinc-800 overflow-hidden">
                                        <div class="h-full bg-blue-500 dna-bar-fill" style="width: ${stock.aiScore.dna.governance}%"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Analytical RAG output -->
                        <div class="glass-card p-5 rounded-2xl bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 flex flex-col justify-between space-y-4">
                            <div>
                                <h3 class="font-poppins font-bold text-sm text-white flex items-center gap-1">
                                    <i data-lucide="shield-check" class="w-4 h-4 text-amber-500"></i> AI Analyst Summary
                                </h3>
                                <p class="text-[11px] text-gray-300 mt-2 leading-relaxed italic">
                                    "${stock.aiScore.analysis}"
                                </p>
                            </div>
                            <div class="border-t border-white/5 pt-3.5 grid grid-cols-2 text-center">
                                <div>
                                    <span class="text-gray-500 text-[10px] block">RAG Target Price</span>
                                    <strong class="text-emerald-400 text-sm mt-0.5 block">${stock.aiScore.targetPrice}</strong>
                                </div>
                                <div>
                                    <span class="text-gray-500 text-[10px] block">ESG Rating</span>
                                    <strong class="text-blue-400 text-sm mt-0.5 block">${stock.aiScore.esgScore}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                lucide.createIcons();
                break;
        }
    }


    // --- IPO CENTER VIEW ---
    let currentIpoStatusFilter = "all";
    let currentIpoTypeFilter = "all";
    let ipoSimulatorStarted = false;

    function setupIpoView() {
        if (!ipoSimulatorStarted) {
            ipoSimulatorStarted = true;
            startIpoSimulator();
        }
        const tbody = document.getElementById("ipo-tbody-list");
        if (!tbody) return;

        // Populate Allotment Dropdown if empty
        const allotmentSelect = document.getElementById("allotment-ipo-select");
        if (allotmentSelect && allotmentSelect.children.length === 0) {
            allotmentSelect.innerHTML = data.ipos
                .filter(ipo => ipo.status === "Closed")
                .map(ipo => `<option value="${ipo.name}">${ipo.name}</option>`)
                .join("");
        }

        // Apply filters
        let filteredIpos = data.ipos;
        if (currentIpoStatusFilter !== "all") {
            filteredIpos = filteredIpos.filter(ipo => ipo.status === currentIpoStatusFilter);
        }
        if (currentIpoTypeFilter !== "all") {
            filteredIpos = filteredIpos.filter(ipo => ipo.type === currentIpoTypeFilter);
        }

        tbody.innerHTML = filteredIpos.map(ipo => {
            const isPos = ipo.gmp >= 0;
            const gmpColor = ipo.gmp === 0 ? "text-gray-400" : (isPos ? "text-emerald-400" : "text-red-400");
            const gmpSign = ipo.gmp > 0 ? "+" : "";
            const segmentBadge = ipo.type === "Mainboard" ? "ipo-badge-mainboard" : "ipo-badge-sme";
            
            let actionBtn = "";
            if (ipo.status === "Open") {
                actionBtn = `<button class="bg-emerald-500 hover:bg-emerald-400 text-black px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ipo-apply-action-btn" data-name="${ipo.name}">Apply</button>`;
            } else if (ipo.status === "Upcoming") {
                actionBtn = `<button class="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ipo-prospectus-action-btn" data-url="${ipo.prospectus}">Prospectus</button>`;
            } else {
                actionBtn = `<button class="bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white px-3 py-1.5 rounded-lg font-bold text-[10px] transition-all ipo-allotment-action-btn">Allotment</button>`;
            }

            return `
            <tr class="ipo-table-row border-b border-white/5" data-name="${ipo.name}">
                <td class="py-3.5 pr-4">
                    <div class="space-y-1">
                        <span class="font-poppins font-bold text-white block">${ipo.name}</span>
                        <div class="flex items-center gap-1.5">
                            <span class="ipo-badge ${segmentBadge}">${ipo.type}</span>
                            <span class="ipo-badge ipo-badge-exchange">${ipo.exchange}</span>
                        </div>
                    </div>
                </td>
                <td class="py-3.5 text-center font-mono ${gmpColor}">
                    ${gmpSign}₹${ipo.gmp} (${ipo.gmpPercent}%)
                </td>
                <td class="py-3.5 text-center text-gray-400">
                    <div class="font-semibold">${ipo.openDate}</div>
                    <div class="text-[10px] text-gray-500">to ${ipo.closeDate}</div>
                </td>
                <td class="py-3.5 text-center font-mono text-white">${ipo.priceBand}</td>
                <td class="py-3.5 text-center font-mono text-gray-400">${ipo.lotSize} Shares</td>
                <td class="py-3.5 text-center font-mono text-white">₹${ipo.size}</td>
                <td class="py-3.5 text-center text-gray-400">${ipo.listingDate || 'TBA'}</td>
                <td class="py-3.5 text-right" onclick="event.stopPropagation()">${actionBtn}</td>
            </tr>`;
        }).join("");

        if (window.lucide) lucide.createIcons();

        // Bind filter status chips
        document.querySelectorAll(".ipo-status-chip").forEach(chip => {
            chip.onclick = function() {
                document.querySelectorAll(".ipo-status-chip").forEach(c => c.classList.remove("active", "text-white"));
                this.classList.add("active");
                currentIpoStatusFilter = this.getAttribute("data-status");
                setupIpoView();
            };
        });

        // Bind filter type chips
        document.querySelectorAll(".ipo-type-chip").forEach(chip => {
            chip.onclick = function() {
                document.querySelectorAll(".ipo-type-chip").forEach(c => c.classList.remove("active", "text-white"));
                this.classList.add("active");
                currentIpoTypeFilter = this.getAttribute("data-type");
                setupIpoView();
            };
        });

        // Bind table row click for details drawer
        document.querySelectorAll(".ipo-table-row").forEach(row => {
            row.onclick = function() {
                const name = this.getAttribute("data-name");
                openIpoDetailsDrawer(name);
            };
        });

        // Bind action buttons
        document.querySelectorAll(".ipo-apply-action-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                window.showToast(`Redirecting to Demat client portal to apply for ${this.getAttribute("data-name")}...`, "success");
            };
        });

        document.querySelectorAll(".ipo-prospectus-action-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                window.showToast("Downloading SEBI prospectus PDF file...", "success");
            };
        });

        document.querySelectorAll(".ipo-allotment-action-btn").forEach(btn => {
            btn.onclick = function(e) {
                e.stopPropagation();
                const modal = document.getElementById("allotment-modal");
                if (modal) modal.classList.remove("hidden");
            };
        });
    }

    // --- IPO Details & Subscription Drawer ---
    function openIpoDetailsDrawer(name) {
        const ipo = data.ipos.find(i => i.name === name);
        if (!ipo) return;

        const drawer = document.getElementById("ipo-details-drawer");
        if (!drawer) return;

        // Populate fields
        document.getElementById("ipo-drawer-name").textContent = ipo.name;
        
        const typeBadge = document.getElementById("ipo-drawer-type");
        typeBadge.textContent = ipo.type;
        typeBadge.className = `px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${ipo.type === 'Mainboard' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'}`;
        
        document.getElementById("ipo-drawer-exchange").textContent = ipo.exchange;
        
        const isPos = ipo.gmp >= 0;
        const gmpText = document.getElementById("ipo-drawer-gmp");
        gmpText.textContent = `${ipo.gmp > 0 ? '+' : ''}₹${ipo.gmp} (${ipo.gmpPercent}%)`;
        gmpText.className = `text-xl font-poppins font-bold ${ipo.gmp === 0 ? 'text-gray-400' : (isPos ? 'text-emerald-400' : 'text-red-400')}`;

        // Timeline
        document.getElementById("ipo-drawer-timeline-period").textContent = `${ipo.openDate} - ${ipo.closeDate}`;
        document.getElementById("ipo-drawer-timeline-allotment").textContent = ipo.allotmentDate || 'TBA';
        document.getElementById("ipo-drawer-timeline-listing").textContent = ipo.listingDate || 'TBA';

        // Subscription rates
        document.getElementById("ipo-drawer-sub-total").textContent = ipo.subscription > 0 ? `${ipo.subscription}x` : 'N/A';
        document.getElementById("ipo-drawer-sub-retail").textContent = ipo.subBreakdown.retail > 0 ? `${ipo.subBreakdown.retail}x` : 'N/A';
        document.getElementById("ipo-drawer-sub-nii").textContent = ipo.subBreakdown.nii > 0 ? `${ipo.subBreakdown.nii}x` : 'N/A';
        document.getElementById("ipo-drawer-sub-qib").textContent = ipo.subBreakdown.qib > 0 ? `${ipo.subBreakdown.qib}x` : 'N/A';

        // Bar widths (scaled to max 100%)
        const scaleBar = (val) => Math.min(val * 8, 100) + '%';
        document.getElementById("ipo-drawer-sub-retail-bar").style.width = scaleBar(ipo.subBreakdown.retail);
        document.getElementById("ipo-drawer-sub-nii-bar").style.width = scaleBar(ipo.subBreakdown.nii);
        document.getElementById("ipo-drawer-sub-qib-bar").style.width = scaleBar(ipo.subBreakdown.qib);

        // Render GMP Trend SVG Area Chart
        const svg = document.getElementById("ipo-drawer-trend-svg");
        if (svg && ipo.gmpTrend && ipo.gmpTrend.length > 0) {
            const width = 180;
            const height = 50;
            
            const minGmp = Math.min(...ipo.gmpTrend, 0);
            const maxGmp = Math.max(...ipo.gmpTrend, 10);
            const range = maxGmp - minGmp;
            
            const points = ipo.gmpTrend.map((val, idx) => {
                const x = (idx * (width / (ipo.gmpTrend.length - 1))).toFixed(1);
                const y = (height - ((val - minGmp) / range) * (height - 10) - 5).toFixed(1);
                return `${x},${y}`;
            });

            const pathData = `M 0,${height} ` + points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p}`).join(" ") + ` L ${width},${height} Z`;
            const strokeData = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p}`).join(" ");
            const strokeColor = isPos ? '#10b981' : '#ef4444';

            svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
            svg.innerHTML = `
                <defs>
                    <linearGradient id="gmpGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="${strokeColor}" stop-opacity="0.2"/>
                        <stop offset="100%" stop-color="${strokeColor}" stop-opacity="0.0"/>
                    </linearGradient>
                </defs>
                <path d="${pathData}" fill="url(#gmpGrad)" />
                <path d="${strokeData}" fill="none" stroke="${strokeColor}" stroke-width="2" />
            `;
        }

        // Drawer Apply button
        const applyBtn = document.getElementById("ipo-drawer-apply-btn");
        if (ipo.status === "Closed") {
            applyBtn.textContent = "IPO Closed / Allotment Status Out";
            applyBtn.className = "w-full bg-white/5 border border-white/10 text-gray-500 font-bold py-3.5 rounded-xl text-xs cursor-not-allowed transition-all flex items-center justify-center gap-2";
            applyBtn.disabled = true;
        } else {
            applyBtn.textContent = ipo.status === "Upcoming" ? "Pre-Apply for IPO" : "Apply for IPO";
            applyBtn.className = "w-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-3.5 rounded-xl text-xs transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/10";
            applyBtn.disabled = false;
            applyBtn.onclick = function() {
                drawer.classList.remove("show");
                setTimeout(() => drawer.classList.add("hidden"), 300);
                window.showToast(`IPO subscription request for ${ipo.name} submitted successfully!`, "success");
            };
        }

        drawer.classList.remove("hidden");
        // Force reflow
        drawer.offsetHeight;
        drawer.classList.add("show");

        // Close bindings
        document.getElementById("close-ipo-drawer-btn").onclick = () => {
            drawer.classList.remove("show");
            setTimeout(() => drawer.classList.add("hidden"), 300);
        };
    }

    // IPO Allotment Status bindings
    const checkAllotmentBtn = document.getElementById("ipo-allotment-trigger");
    const allotmentModal = document.getElementById("allotment-modal");
    
    if (checkAllotmentBtn) {
        checkAllotmentBtn.addEventListener("click", () => {
            // Re-populate dropdown just in case
            const allotmentSelect = document.getElementById("allotment-ipo-select");
            if (allotmentSelect) {
                allotmentSelect.innerHTML = data.ipos
                    .filter(ipo => ipo.status === "Closed")
                    .map(ipo => `<option value="${ipo.name}">${ipo.name}</option>`)
                    .join("");
            }
            allotmentModal.classList.remove("hidden");
        });
    }
    
    const closeAllotmentBtn = document.getElementById("close-allotment-btn");
    if (closeAllotmentBtn) {
        closeAllotmentBtn.addEventListener("click", () => {
            allotmentModal.classList.add("hidden");
            document.getElementById("allotment-result").classList.add("hidden");
        });
    }

    // --- IPO Launch Simulator Engine ---
    const ipoPrefixes = ["Nivaan", "Aditya", "Vedic", "Karan", "Zeta", "Pinnacle", "Innova", "Sovereign", "Zenith", "Quantum"];
    const ipoSectors = ["Biotech", "Agritech", "Logistics", "Energy", "Software", "Mobility", "Semiconductors", "Fintech", "Solar", "Infra"];
    const ipoSuffixes = ["India", "Global", "Solutions", "Technologies", "Ventures", "Industries", "Enterprises"];

    function generateSimulatedIPO() {
        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
        const companyName = `${rand(ipoPrefixes)} ${rand(ipoSectors)} ${rand(ipoSuffixes)} Ltd`;
        
        if (data.ipos.some(i => i.name === companyName)) {
            return generateSimulatedIPO();
        }

        const isSme = Math.random() > 0.5;
        const type = isSme ? "SME" : "Mainboard";
        const exchange = isSme ? (Math.random() > 0.5 ? "NSE SME" : "BSE SME") : "NSE & BSE";
        
        const priceBandMin = Math.floor(Math.random() * 300) + 50;
        const priceBandMax = Math.floor(priceBandMin * (1 + (Math.random() * 0.15 + 0.05)));
        const priceBand = isSme && Math.random() > 0.6 
            ? `₹${priceBandMin}` 
            : `₹${priceBandMin} - ₹${priceBandMax}`;
            
        const capPrice = isSme && Math.random() > 0.6 ? priceBandMin : priceBandMax;
        const lotSize = Math.floor(15000 / capPrice);
        const sizeVal = isSme ? (Math.random() * 40 + 10).toFixed(1) : (Math.random() * 3000 + 300).toFixed(0);
        const size = `${parseFloat(sizeVal).toLocaleString('en-IN')} Cr`;
        
        const gmpVal = Math.floor((Math.random() * 0.6 - 0.1) * capPrice);
        const gmp = gmpVal;
        const gmpPercent = parseFloat(((gmp / capPrice) * 100).toFixed(1));
        
        const openDateObj = new Date();
        openDateObj.setDate(openDateObj.getDate() + Math.floor(Math.random() * 10) + 2);
        const closeDateObj = new Date(openDateObj);
        closeDateObj.setDate(closeDateObj.getDate() + 3);
        const allotmentDateObj = new Date(closeDateObj);
        allotmentDateObj.setDate(allotmentDateObj.getDate() + 3);
        const listingDateObj = new Date(allotmentDateObj);
        listingDateObj.setDate(listingDateObj.getDate() + 4);

        const formatDate = (date) => {
            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
        };

        const openDate = formatDate(openDateObj);
        const closeDate = formatDate(closeDateObj);
        const allotmentDate = formatDate(allotmentDateObj);
        const listingDate = formatDate(listingDateObj);

        const baseTrend = Array.from({length: 5}, (_, i) => {
            return Math.floor(gmp * (0.7 + (i * 0.08) + (Math.random() * 0.1 - 0.05)));
        });

        const newIpo = {
            name: companyName,
            type: type,
            status: "Upcoming",
            gmp: gmp,
            gmpPercent: gmpPercent,
            openDate: openDate,
            closeDate: closeDate,
            priceBand: priceBand,
            lotSize: lotSize,
            size: size,
            exchange: exchange,
            allotmentDate: allotmentDate,
            listingDate: listingDate,
            prospectus: "https://www.sebi.gov.in",
            subscription: 0.0,
            subBreakdown: { retail: 0.0, nii: 0.0, qib: 0.0 },
            gmpTrend: baseTrend
        };

        data.ipos.unshift(newIpo);
        setupIpoView();

        if (window.showToast) {
            window.showToast(`New IPO DRHP Filed! ${companyName} has filed for a ${size} issue. Initial GMP: ${gmpPercent}%`, "success");
        }

        const radarStatus = document.getElementById("ipo-radar-status");
        if (radarStatus) {
            radarStatus.innerHTML = `<span class="text-emerald-400 font-semibold">Latest filing detected:</span> ${companyName} (${type})`;
        }
    }

    let ipoSimulationTimer = 120;
    function startIpoSimulator() {
        const timerEl = document.getElementById("ipo-radar-timer");
        const btn = document.getElementById("btn-simulate-ipo-launch");

        if (btn) {
            btn.onclick = function() {
                generateSimulatedIPO();
                ipoSimulationTimer = 120;
            };
        }

        setInterval(() => {
            const tbody = document.getElementById("ipo-tbody-list");
            if (!tbody) return;

            ipoSimulationTimer--;
            if (timerEl) {
                const mins = Math.floor(ipoSimulationTimer / 60).toString().padStart(2, "0");
                const secs = (ipoSimulationTimer % 60).toString().padStart(2, "0");
                timerEl.textContent = `${mins}:${secs}`;
            }

            if (ipoSimulationTimer <= 0) {
                generateSimulatedIPO();
                ipoSimulationTimer = 120;
            }
        }, 1000);
    }

    const submitAllotmentBtn = document.getElementById("submit-allotment-btn");
    if (submitAllotmentBtn) {
        submitAllotmentBtn.addEventListener("click", () => {
            const pan = document.getElementById("allotment-pan-input").value.toUpperCase().trim();
            const ipo = document.getElementById("allotment-ipo-select").value;
            const res = document.getElementById("allotment-result");
            
            if (pan.length !== 10) {
                res.innerHTML = `<span class="text-red-400 font-bold block">Invalid Query: PAN must be 10 characters long.</span>`;
                res.className = "p-3 rounded-lg border border-red-500/20 bg-red-500/5 text-xs block";
                return;
            }

            // Simulate allotment odds
            const gotShares = Math.random() > 0.65;
            res.className = `p-3 rounded-lg border text-xs block ${gotShares ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'}`;
            
            if (gotShares) {
                res.innerHTML = `
                    <div class="flex items-center gap-2 mb-1.5 text-emerald-400 font-bold">
                        <i data-lucide="check-circle" class="w-4 h-4"></i> Shares Allotted!
                    </div>
                    <p class="text-gray-300">You have been allotted **1 Lot (150 shares)** for **${ipo}** at the cutoff price. Debit trigger initiated on Demat.</p>
                `;
            } else {
                res.innerHTML = `
                    <div class="flex items-center gap-2 mb-1.5 text-red-400 font-bold">
                        <i data-lucide="x-circle" class="w-4 h-4"></i> No Shares Allotted (Lapsed)
                    </div>
                    <p class="text-gray-300">Unfortunately, you were not allotted shares during the lottery allocation for ${ipo}. Refunding blocked UPI mandate.</p>
                `;
            }
            lucide.createIcons();
        });
    }


    // --- MUTUAL FUNDS VIEW ---
    function setupMutualFundsView() {
        const grid = document.getElementById("mf-cards-container");
        if (!grid) return;

        grid.innerHTML = data.mutualFunds.map(mf => {
            return `<div class="glass-card p-5 rounded-2xl border ${mf.pinned ? 'border-amber-500/50 bg-amber-500/5 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'border-white/5'} space-y-4 select-none flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-poppins font-black text-xs text-white max-w-[70%] block leading-tight">
                            ${mf.pinned ? '<svg class="w-3 h-3 inline text-amber-500 mr-1 mb-0.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M16 11V7c0-2.206-1.794-4-4-4S8 4.794 8 7v4l-2 3v2h5v7l1 1 1-1v-7h5v-2l-2-3z"></path></svg>' : ''}
                            ${mf.name}
                        </span>
                        <span class="text-[8px] px-2 py-0.5 rounded font-bold uppercase ${
                            mf.risk === 'Very High' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                        }">${mf.risk} Risk</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs pt-2.5 border-t border-white/5">
                        <div>
                            <span class="text-gray-500 block text-[9px] uppercase">Current NAV</span>
                            <strong class="text-white block mt-0.5 font-mono">₹${mf.nav.toFixed(2)}</strong>
                        </div>
                        <div>
                            <span class="text-gray-500 block text-[9px] uppercase">Expense Ratio</span>
                            <strong class="text-white block mt-0.5 font-mono">${mf.expenseRatio}%</strong>
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-3 text-xs pt-3">
                        <div>
                            <span class="text-gray-500 block text-[9px] uppercase">3Y / 5Y Return</span>
                            <strong class="text-emerald-400 block mt-0.5 font-mono">${mf.return3y}% / ${mf.return5y}%</strong>
                        </div>
                        <div>
                            <span class="text-gray-500 block text-[9px] uppercase">Min SIP Cost</span>
                            <strong class="text-white block mt-0.5 font-mono">₹${mf.minSip}</strong>
                        </div>
                    </div>
                </div>

                <div class="pt-4 flex gap-2">
                    <button class="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-bold py-2 rounded-lg transition" onclick="window.openCompareModal('${mf.id}')">
                        Compare Fund
                    </button>
                    <button class="flex-1 bg-emerald-500 hover:bg-emerald-600 text-black text-[10px] font-bold py-2 rounded-lg transition" onclick="window.openInvestModal('${mf.id}', '${mf.name}', ${mf.nav})">
                        Invest Direct
                    </button>
                </div>
            </div>`;
        }).join("");
    }

    // --- UNIFIED MUTUAL FUNDS SIP/SWP CALCULATOR ---
    const uniTabs = document.querySelectorAll("#mf-calc-tabs .calc-tab-btn");
    const uniSipContent = document.getElementById("calc-sip-content");
    const uniSwpContent = document.getElementById("calc-swp-content");
    const uniTabIndicator = document.getElementById("calc-tab-indicator");
    const uniCalcChart = document.getElementById("uni-calc-chart");
    const uniCenterLabel = document.getElementById("calc-center-label");
    const uniCenterValue = document.getElementById("calc-center-value");
    const uniResultsList = document.getElementById("calc-results-list");

    let currentCalcMode = "sip";
    let uniChartInstance = null;

    if (uniTabs.length > 0) {
        uniTabs.forEach((tab, index) => {
            tab.addEventListener("click", () => {
                // Update tabs state
                uniTabs.forEach(t => t.classList.remove("active", "text-white"));
                uniTabs.forEach(t => t.classList.add("text-gray-400"));
                tab.classList.remove("text-gray-400");
                tab.classList.add("active", "text-white");
                
                // Move indicator
                if (uniTabIndicator) {
                    uniTabIndicator.style.transform = `translateX(${index * 100}%)`;
                    // Change color based on mode
                    if (index === 0) {
                        uniTabIndicator.classList.remove("bg-blue-500/20", "border-blue-500/30");
                        uniTabIndicator.classList.add("bg-emerald-500/20", "border-emerald-500/30");
                    } else {
                        uniTabIndicator.classList.remove("bg-emerald-500/20", "border-emerald-500/30");
                        uniTabIndicator.classList.add("bg-blue-500/20", "border-blue-500/30");
                    }
                }

                currentCalcMode = tab.dataset.target;
                
                if (currentCalcMode === "sip") {
                    uniSipContent.classList.remove("hidden");
                    uniSwpContent.classList.add("hidden");
                } else {
                    uniSipContent.classList.add("hidden");
                    uniSwpContent.classList.remove("hidden");
                }
                
                runUnifiedCalculator();
            });
        });
    }

    // Input-Slider sync utility
    function syncInputSlider(inputId, sliderId) {
        const inp = document.getElementById(inputId);
        const sli = document.getElementById(sliderId);
        if (!inp || !sli) return;
        
        inp.addEventListener("input", () => {
            sli.value = inp.value;
            runUnifiedCalculator();
        });
        sli.addEventListener("input", () => {
            inp.value = sli.value;
            runUnifiedCalculator();
        });
    }

    // Bind SIP Controls
    syncInputSlider("uni-sip-amount-input", "uni-sip-amount-slider");
    syncInputSlider("uni-sip-rate-input", "uni-sip-rate-slider");
    syncInputSlider("uni-sip-years-input", "uni-sip-years-slider");

    // Bind SWP Controls
    syncInputSlider("uni-swp-capital-input", "uni-swp-capital-slider");
    syncInputSlider("uni-swp-withdraw-input", "uni-swp-withdraw-slider");
    syncInputSlider("uni-swp-rate-input", "uni-swp-rate-slider");
    syncInputSlider("uni-swp-years-input", "uni-swp-years-slider");

    function runUnifiedCalculator() {
        const fmt = (val) => val.toLocaleString('en-IN', { maximumFractionDigits: 0 });
        let chartData = [];

        if (currentCalcMode === "sip") {
            const amt = parseFloat(document.getElementById("uni-sip-amount-input")?.value) || 0;
            const rate = parseFloat(document.getElementById("uni-sip-rate-input")?.value) || 0;
            const yrs = parseFloat(document.getElementById("uni-sip-years-input")?.value) || 0;
            
            const results = window.FinanceCalculators?.calculateSIP(amt, rate, yrs) || {invested: 0, gain: 0, futureValue: 0};
            
            if(uniCenterLabel) uniCenterLabel.textContent = "TOTAL VALUE";
            if(uniCenterValue) uniCenterValue.textContent = `₹${fmt(results.futureValue)}`;
            if(uniCenterValue) uniCenterValue.className = "font-poppins font-black text-emerald-400 text-2xl mt-1 tracking-tight";
            
            if(uniResultsList) {
                uniResultsList.innerHTML = `
                    <div class="flex justify-between items-center pb-2 border-b border-white/5">
                        <span class="text-gray-400 flex items-center gap-2"><span class="w-3 h-3 bg-gray-500 rounded-sm block"></span> Invested Amount</span>
                        <strong class="text-white font-mono text-sm">₹${fmt(results.invested)}</strong>
                    </div>
                    <div class="flex justify-between items-center pt-1">
                        <span class="text-gray-400 flex items-center gap-2"><span class="w-3 h-3 bg-emerald-500 rounded-sm block shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span> Est. Returns</span>
                        <strong class="text-emerald-400 font-mono text-sm">₹${fmt(results.gain)}</strong>
                    </div>
                `;
            }
            
            chartData = [
                { label: "Invested", value: results.invested, color: "#6b7280" },
                { label: "Est. Returns", value: results.gain, color: "#10b981" }
            ];
            
        } else {
            const cap = parseFloat(document.getElementById("uni-swp-capital-input")?.value) || 0;
            const wdr = parseFloat(document.getElementById("uni-swp-withdraw-input")?.value) || 0;
            const rate = parseFloat(document.getElementById("uni-swp-rate-input")?.value) || 0;
            const yrs = parseFloat(document.getElementById("uni-swp-years-input")?.value) || 0;
            
            const results = window.FinanceCalculators?.calculateSWP(cap, wdr, rate, yrs) || {invested: 0, totalWithdrawn: 0, finalBalance: 0};
            
            if(uniCenterLabel) uniCenterLabel.textContent = "REMAINING CASH";
            if(uniCenterValue) uniCenterValue.textContent = `₹${fmt(results.finalBalance)}`;
            if(uniCenterValue) uniCenterValue.className = "font-poppins font-black text-amber-500 text-2xl mt-1 tracking-tight";
            
            if(uniResultsList) {
                uniResultsList.innerHTML = `
                    <div class="flex justify-between items-center pb-2 border-b border-white/5">
                        <span class="text-gray-400 flex items-center gap-2"><span class="w-3 h-3 bg-blue-500 rounded-sm block shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span> Total Investment</span>
                        <strong class="text-white font-mono text-sm">₹${fmt(results.invested)}</strong>
                    </div>
                    <div class="flex justify-between items-center pt-1">
                        <span class="text-gray-400 flex items-center gap-2"><span class="w-3 h-3 bg-amber-500 rounded-sm block shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span> Total Withdrawn</span>
                        <strong class="text-emerald-400 font-mono text-sm">₹${fmt(results.totalWithdrawn)}</strong>
                    </div>
                `;
            }
            
            chartData = [
                { label: "Remaining", value: results.finalBalance, color: "#f59e0b" },
                { label: "Withdrawn", value: results.totalWithdrawn, color: "#3b82f6" }
            ];
        }
        
        // Render Chart
        if (uniCalcChart) {
            const ctx = uniCalcChart.getContext('2d');
            
            if (uniChartInstance) {
                uniChartInstance.destroy();
            }
            
            if (typeof Chart !== 'undefined') {
                uniChartInstance = new Chart(ctx, {
                    type: 'doughnut',
                    data: {
                        labels: chartData.map(d => d.label),
                        datasets: [{
                            data: chartData.map(d => Math.max(0, d.value)), // ensure positive
                            backgroundColor: chartData.map(d => d.color),
                            borderWidth: 0,
                            hoverOffset: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        cutout: '75%',
                        plugins: {
                            legend: { display: false },
                            tooltip: {
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                titleColor: '#fff',
                                bodyColor: '#fff',
                                callbacks: {
                                    label: function(context) {
                                        return ' ₹' + fmt(context.raw);
                                    }
                                }
                            }
                        }
                    }
                });
            } else if (typeof drawDonutChart === "function") {
                drawDonutChart("uni-calc-chart", chartData);
            }
        }
    }

    // Initial render for unified calculator
    if (document.getElementById("uni-sip-amount-input")) {
        setTimeout(runUnifiedCalculator, 500); // slight delay to ensure scripts are loaded
    }


    // --- ETFs VIEW ---
    const etfDetails = {
        NIFTYBEES: {
            holdings: [
                { name: "Reliance Industries", weight: 10.2 },
                { name: "HDFC Bank", weight: 9.4 },
                { name: "ICICI Bank", weight: 7.8 },
                { name: "Infosys", weight: 6.1 },
                { name: "ITC Ltd", weight: 4.9 }
            ],
            sectors: [
                { name: "Financial Services", weight: 34.5 },
                { name: "Information Technology", weight: 14.2 },
                { name: "Oil & Gas", weight: 12.1 },
                { name: "FMCG", weight: 9.5 },
                { name: "Others", weight: 29.7 }
            ]
        },
        JUNIORBEES: {
            holdings: [
                { name: "Trent Ltd", weight: 4.5 },
                { name: "Bharat Electronics (BEL)", weight: 4.2 },
                { name: "Tata Power", weight: 3.9 },
                { name: "Shriram Finance", weight: 3.6 },
                { name: "Cholamandalam Investment", weight: 3.4 }
            ],
            sectors: [
                { name: "Financial Services", weight: 22.1 },
                { name: "Capital Goods", weight: 18.4 },
                { name: "Power", weight: 12.5 },
                { name: "Consumer Services", weight: 11.0 },
                { name: "Others", weight: 36.0 }
            ]
        },
        MON100: {
            holdings: [
                { name: "Microsoft Corp", weight: 12.5 },
                { name: "Apple Inc", weight: 12.1 },
                { name: "NVIDIA Corp", weight: 11.4 },
                { name: "Amazon.com Inc", weight: 6.5 },
                { name: "Meta Platforms", weight: 4.8 }
            ],
            sectors: [
                { name: "Technology", weight: 51.2 },
                { name: "Consumer Discretionary", weight: 18.5 },
                { name: "Communication Services", weight: 15.1 },
                { name: "Healthcare", weight: 6.8 },
                { name: "Others", weight: 8.4 }
            ]
        },
        BANKBEES: {
            holdings: [
                { name: "HDFC Bank", weight: 28.2 },
                { name: "ICICI Bank", weight: 23.4 },
                { name: "Axis Bank", weight: 11.8 },
                { name: "Kotak Mahindra Bank", weight: 9.5 },
                { name: "State Bank of India", weight: 9.1 }
            ],
            sectors: [
                { name: "Private Sector Banks", weight: 78.0 },
                { name: "Public Sector Banks", weight: 22.0 }
            ]
        },
        ITBEES: {
            holdings: [
                { name: "Infosys Ltd", weight: 26.5 },
                { name: "Tata Consultancy Services (TCS)", weight: 24.8 },
                { name: "HCL Technologies", weight: 10.5 },
                { name: "Wipro Ltd", weight: 8.2 },
                { name: "Tech Mahindra", weight: 7.5 }
            ],
            sectors: [
                { name: "IT Services", weight: 92.0 },
                { name: "Consulting & Software", weight: 8.0 }
            ]
        },
        INFRA: {
            holdings: [
                { name: "Larsen & Toubro (L&T)", weight: 15.2 },
                { name: "NTPC Ltd", weight: 11.4 },
                { name: "Power Grid Corp", weight: 10.2 },
                { name: "Coal India", weight: 8.5 },
                { name: "UltraTech Cement", weight: 7.2 }
            ],
            sectors: [
                { name: "Capital Goods", weight: 35.0 },
                { name: "Power", weight: 28.0 },
                { name: "Metals & Mining", weight: 19.0 },
                { name: "Construction Materials", weight: 18.0 }
            ]
        },
        GOLDBEES: {
            holdings: [
                { name: "Physical Gold (99.5% Purity)", weight: 99.5 },
                { name: "Cash & Cash Equivalents", weight: 0.5 }
            ],
            sectors: [
                { name: "Precious Metals", weight: 100.0 }
            ]
        },
        LIQUIDBEES: {
            holdings: [
                { name: "Call Money", weight: 45.0 },
                { name: "Triparty Repo (TREPS)", weight: 35.0 },
                { name: "Government Securities", weight: 18.0 },
                { name: "Cash Equivalents", weight: 2.0 }
            ],
            sectors: [
                { name: "Money Market Instruments", weight: 100.0 }
            ]
        },
        SENSEXETF: {
            holdings: [
                { name: "Reliance Industries", weight: 12.8 },
                { name: "HDFC Bank", weight: 11.5 },
                { name: "ICICI Bank", weight: 9.2 },
                { name: "Infosys", weight: 7.8 },
                { name: "ITC Ltd", weight: 5.5 }
            ],
            sectors: [
                { name: "Financial Services", weight: 38.0 },
                { name: "Information Technology", weight: 15.0 },
                { name: "Oil & Gas", weight: 11.0 },
                { name: "FMCG", weight: 10.5 },
                { name: "Others", weight: 25.5 }
            ]
        },
        PSUBNKBEES: {
            holdings: [
                { name: "State Bank of India", weight: 30.2 },
                { name: "Bank of Baroda", weight: 14.5 },
                { name: "Punjab National Bank", weight: 12.8 },
                { name: "Canara Bank", weight: 11.0 },
                { name: "Union Bank of India", weight: 8.5 }
            ],
            sectors: [
                { name: "Public Sector Banks", weight: 100.0 }
            ]
        },
        PHARMABEES: {
            holdings: [
                { name: "Sun Pharma", weight: 25.5 },
                { name: "Dr Reddy's Labs", weight: 12.0 },
                { name: "Cipla Ltd", weight: 10.5 },
                { name: "Divi's Labs", weight: 9.2 },
                { name: "Apollo Hospitals", weight: 8.0 }
            ],
            sectors: [
                { name: "Pharmaceuticals", weight: 72.0 },
                { name: "Healthcare Services", weight: 18.0 },
                { name: "Biotech", weight: 10.0 }
            ]
        },
        SILVERBEES: {
            holdings: [
                { name: "Physical Silver (99.9% Purity)", weight: 99.2 },
                { name: "Cash & Cash Equivalents", weight: 0.8 }
            ],
            sectors: [
                { name: "Precious Metals", weight: 100.0 }
            ]
        },
        CPSEETF: {
            holdings: [
                { name: "NTPC Ltd", weight: 16.5 },
                { name: "Coal India", weight: 14.2 },
                { name: "Power Grid Corp", weight: 13.8 },
                { name: "Oil India", weight: 11.0 },
                { name: "NHPC Ltd", weight: 9.5 }
            ],
            sectors: [
                { name: "Power & Energy", weight: 45.0 },
                { name: "Oil & Gas", weight: 25.0 },
                { name: "Metals & Mining", weight: 20.0 },
                { name: "Others", weight: 10.0 }
            ]
        },
        BHARAT22: {
            holdings: [
                { name: "Larsen & Toubro (L&T)", weight: 15.8 },
                { name: "ITC Ltd", weight: 12.5 },
                { name: "State Bank of India", weight: 10.0 },
                { name: "Axis Bank", weight: 8.2 },
                { name: "NTPC Ltd", weight: 7.5 }
            ],
            sectors: [
                { name: "Capital Goods", weight: 25.0 },
                { name: "Financial Services", weight: 22.0 },
                { name: "FMCG", weight: 18.0 },
                { name: "Power", weight: 15.0 },
                { name: "Others", weight: 20.0 }
            ]
        },
        HNGSNGBEES: {
            holdings: [
                { name: "Tencent Holdings", weight: 10.5 },
                { name: "Alibaba Group", weight: 9.8 },
                { name: "AIA Group", weight: 7.5 },
                { name: "Meituan", weight: 5.2 },
                { name: "HSBC Holdings", weight: 4.8 }
            ],
            sectors: [
                { name: "Technology", weight: 35.0 },
                { name: "Financial Services", weight: 30.0 },
                { name: "Consumer Discretionary", weight: 20.0 },
                { name: "Others", weight: 15.0 }
            ]
        },
        MAFANG: {
            holdings: [
                { name: "Meta Platforms", weight: 11.2 },
                { name: "Apple Inc", weight: 10.8 },
                { name: "Amazon.com Inc", weight: 10.5 },
                { name: "Netflix Inc", weight: 10.1 },
                { name: "Alphabet (Google)", weight: 10.0 }
            ],
            sectors: [
                { name: "Technology", weight: 45.0 },
                { name: "Communication Services", weight: 25.0 },
                { name: "Consumer Discretionary", weight: 20.0 },
                { name: "Entertainment", weight: 10.0 }
            ]
        }
    };

    let currentEtfThemeFilter = "all";

    function setupEtfsView() {
        const grid = document.getElementById("etf-grid-container");
        if (!grid) return;

        // 1. Populate Overlap Selector Dropdowns
        const selectA = document.getElementById("etf-overlap-a");
        const selectB = document.getElementById("etf-overlap-b");
        if (selectA && selectA.children.length === 0) {
            const etfOptions = data.etfs.map(etf => `<option value="${etf.symbol}">${etf.symbol} - ${etf.name}</option>`).join("");
            selectA.innerHTML = etfOptions;
            selectB.innerHTML = etfOptions;
            // Default select different ones
            if (selectB.children[1]) selectB.children[1].selected = true;
        }

        // 2. Render Cards based on active filter
        const filteredEtfs = currentEtfThemeFilter === "all" 
            ? data.etfs 
            : data.etfs.filter(etf => etf.theme === currentEtfThemeFilter);

        grid.innerHTML = filteredEtfs.map(etf => {
            const isPos = etf.changePercent >= 0;
            const themeClassMap = {
                "Core Indices": "etf-theme-core",
                "Sectoral / Tech": "etf-theme-sector",
                "Commodities & Debt": "etf-theme-commodity",
                "Thematic & ESG": "etf-theme-thematic",
                "International": "etf-theme-intl"
            };
            const themeClass = themeClassMap[etf.theme] || "etf-theme-core";
            
            // Sparkline path generator
            const sparkPoints = Array.from({length: 10}, (_, i) => {
                const x = (i * 12).toFixed(1);
                const y = (20 + Math.sin(i + (etf.price % 10)) * 10).toFixed(1);
                return `${x},${y}`;
            }).join(" ");

            return `
            <div class="glass-card p-5 rounded-2xl border border-white/5 flex flex-col justify-between h-full etf-card bg-zinc-950/40">
                <div class="space-y-4">
                    <div class="flex items-start justify-between">
                        <div>
                            <span class="etf-theme-badge ${themeClass}">${etf.theme}</span>
                            <h3 class="font-poppins font-black text-lg text-white mt-2">${etf.symbol}</h3>
                            <p class="text-[10px] text-gray-500 line-clamp-1">${etf.name}</p>
                        </div>
                        <!-- Mini Sparkline -->
                        <svg class="w-16 h-8 overflow-visible">
                            <polyline fill="none" stroke="${isPos ? '#10b981' : '#ef4444'}" stroke-width="1.5" class="etf-sparkline" points="${sparkPoints}" />
                        </svg>
                    </div>

                    <div class="flex items-baseline gap-2">
                        <span class="text-xl font-poppins font-bold text-white">₹${etf.price.toFixed(2)}</span>
                        <span class="text-xs font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}">
                            ${isPos ? '▲' : '▼'} ${Math.abs(etf.changePercent).toFixed(2)}%
                        </span>
                    </div>

                    <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/5 text-[10px]">
                        <div>
                            <span class="block text-gray-500 font-semibold uppercase">Expense</span>
                            <span class="font-mono text-white">${etf.expenseRatio}%</span>
                        </div>
                        <div>
                            <span class="block text-gray-500 font-semibold uppercase">Track Err</span>
                            <span class="font-mono text-white">${etf.trackingError}%</span>
                        </div>
                        <div>
                            <span class="block text-gray-500 font-semibold uppercase">Volume</span>
                            <span class="font-mono text-white">${(etf.volume / 1000).toFixed(0)}k</span>
                        </div>
                    </div>
                </div>

                <button class="w-full mt-5 bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 hover:border-emerald-500 text-white font-bold py-2 px-4 rounded-xl text-[11px] transition-all flex items-center justify-center gap-1.5 etf-xray-btn" data-symbol="${etf.symbol}">
                    <i data-lucide="zoom-in" class="w-3.5 h-3.5"></i>
                    X-Ray Basket
                </button>
            </div>`;
        }).join("");

        if (window.lucide) lucide.createIcons();

        // 3. Bind Filter Chips
        document.querySelectorAll(".etf-filter-chip").forEach(chip => {
            chip.onclick = function() {
                document.querySelectorAll(".etf-filter-chip").forEach(c => c.classList.remove("active", "text-white"));
                this.classList.add("active");
                currentEtfThemeFilter = this.getAttribute("data-theme");
                setupEtfsView();
            };
        });

        // 4. Bind X-Ray Buttons
        document.querySelectorAll(".etf-xray-btn").forEach(btn => {
            btn.onclick = function() {
                const symbol = this.getAttribute("data-symbol");
                openEtfXray(symbol);
            };
        });
    }

    // --- ETF Basket X-Ray Modal Control ---
    function openEtfXray(symbol) {
        const etf = data.etfs.find(e => e.symbol === symbol);
        const details = etfDetails[symbol];
        if (!etf || !details) return;

        const modal = document.getElementById("etf-xray-modal");
        const title = document.getElementById("etf-xray-title");
        const badge = document.getElementById("etf-xray-theme-badge");
        const price = document.getElementById("etf-xray-price");
        const change = document.getElementById("etf-xray-change");
        const sectorsContainer = document.getElementById("etf-xray-sectors");
        const holdingsContainer = document.getElementById("etf-xray-holdings");

        title.textContent = `${etf.symbol} - ${etf.name}`;
        badge.textContent = etf.theme;
        badge.className = `px-2.5 py-1 rounded text-[9px] font-bold uppercase tracking-wider ${etf.theme === 'Core Indices' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : (etf.theme === 'Sectoral / Tech' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30')}`;
        price.textContent = `₹${etf.price.toFixed(2)}`;
        
        const isPos = etf.changePercent >= 0;
        change.textContent = `${isPos ? '+' : ''}${etf.changePercent.toFixed(2)}%`;
        change.className = `text-sm font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}`;

        // Render sectors
        sectorsContainer.innerHTML = details.sectors.map(sec => {
            return `
            <div class="space-y-1">
                <div class="flex justify-between text-[10px]">
                    <span class="text-gray-400 font-medium">${sec.name}</span>
                    <span class="font-mono font-bold text-white">${sec.weight}%</span>
                </div>
                <div class="h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div class="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-500" style="width: ${sec.weight}%"></div>
                </div>
            </div>`;
        }).join("");

        // Render holdings
        holdingsContainer.innerHTML = details.holdings.map(h => {
            return `
            <div class="flex justify-between items-center py-2 text-xs">
                <span class="text-gray-300 font-medium">${h.name}</span>
                <span class="font-mono font-bold text-emerald-400">${h.weight}%</span>
            </div>`;
        }).join("");

        modal.classList.remove("hidden");

        // Invest button
        document.getElementById("etf-xray-invest-btn").onclick = function() {
            modal.classList.add("hidden");
            if (window.openEtfTradeModal) {
                window.openEtfTradeModal(etf.symbol, etf.name, etf.price);
            } else {
                window.showToast(`Order Placed: Purchased shares of ${etf.symbol}!`, "success");
            }
        };

        // Close handlers
        document.getElementById("close-etf-xray-btn").onclick = () => modal.classList.add("hidden");
        modal.onclick = function(e) {
            if (e.target === modal) modal.classList.add("hidden");
        };
    }

    // --- ETF Overlap Analyzer Engine ---
    document.addEventListener("click", function(e) {
        if (e.target && e.target.id === "btn-analyze-etf-overlap") {
            const etfA = document.getElementById("etf-overlap-a").value;
            const etfB = document.getElementById("etf-overlap-b").value;

            if (etfA === etfB) {
                if (window.showToast) window.showToast("Select two different ETFs to scan overlap.", "error");
                return;
            }

            const detailsA = etfDetails[etfA];
            const detailsB = etfDetails[etfB];

            if (!detailsA || !detailsB) return;

            // Calculate overlap
            let overlapScore = 0;
            const commonHoldings = [];

            detailsA.holdings.forEach(hA => {
                const matchB = detailsB.holdings.find(hB => hB.name === hA.name);
                if (matchB) {
                    const minWeight = Math.min(hA.weight, matchB.weight);
                    overlapScore += minWeight;
                    commonHoldings.push({
                        name: hA.name,
                        weightA: hA.weight,
                        weightB: matchB.weight,
                        overlap: minWeight
                    });
                }
            });

            // If there's 0 overlap, let's keep a tiny base level or 0 depending on the asset
            overlapScore = parseFloat(overlapScore.toFixed(1));

            // Render results
            const resultsPanel = document.getElementById("etf-overlap-results");
            const pctText = document.getElementById("etf-overlap-pct-text");
            const circle = document.getElementById("etf-overlap-circle");
            const commonList = document.getElementById("etf-overlap-common-list");
            const advice = document.getElementById("etf-overlap-advice");

            pctText.textContent = `${overlapScore}%`;

            // SVG dashoffset animation (radius is 40, circumference is 2 * pi * r = 251.2)
            const circumference = 251.2;
            const offset = circumference - (overlapScore / 100) * circumference;
            circle.style.strokeDashoffset = offset;

            // Colors based on overlap
            if (overlapScore > 50) {
                circle.setAttribute("stroke", "#ef4444"); // Red
                advice.className = "text-[10px] text-red-400 bg-red-500/5 border border-red-500/10 p-2.5 rounded-lg flex items-start gap-1.5";
                advice.innerHTML = `<i data-lucide="alert-octagon" class="w-3.5 h-3.5 shrink-0"></i><span>Warning: High Overlap (${overlapScore}%). These ETFs hold almost the same top stocks. Diversification benefit is minimal.</span>`;
            } else if (overlapScore > 20) {
                circle.setAttribute("stroke", "#f59e0b"); // Orange
                advice.className = "text-[10px] text-amber-400 bg-amber-500/5 border border-amber-500/10 p-2.5 rounded-lg flex items-start gap-1.5";
                advice.innerHTML = `<i data-lucide="alert-triangle" class="w-3.5 h-3.5 shrink-0"></i><span>Notice: Moderate Overlap (${overlapScore}%). Decent diversification, but some common exposure exists.</span>`;
            } else {
                circle.setAttribute("stroke", "#10b981"); // Green
                advice.className = "text-[10px] text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 p-2.5 rounded-lg flex items-start gap-1.5";
                advice.innerHTML = `<i data-lucide="check-circle" class="w-3.5 h-3.5 shrink-0"></i><span>Excellent: Low Overlap (${overlapScore}%). Perfect choice to blend together for balanced asset allocation.</span>`;
            }

            if (commonHoldings.length === 0) {
                commonList.innerHTML = `<div class="text-[11px] text-gray-500 py-4 text-center">No common stock holdings found between these two baskets.</div>`;
            } else {
                commonList.innerHTML = commonHoldings.map(ch => {
                    return `
                    <div class="flex items-center justify-between text-[11px] bg-white/[0.01] border border-white/5 p-2 rounded-xl">
                        <span class="text-gray-300 font-medium">${ch.name}</span>
                        <div class="flex items-center gap-3 font-mono">
                            <span class="text-gray-500">${etfA}: ${ch.weightA}%</span>
                            <span class="text-gray-500">${etfB}: ${ch.weightB}%</span>
                            <span class="text-emerald-400 font-bold">Overlap: ${ch.overlap}%</span>
                        </div>
                    </div>`;
                }).join("");
            }

            resultsPanel.classList.remove("hidden");
            if (window.lucide) lucide.createIcons();
        }
    });


    // --- PORTFOLIO VIEW ---
    function setupPortfolioView() {
        const summary = window.PortfolioManager.getSummary();
        
        // Synchronize with Home Dashboard Limits
        const dashCashEl = document.getElementById("lim-cash-bal");
        const dashMarginUsedEl = document.getElementById("lim-margin-used");
        const dashCollateralEl = document.getElementById("lim-collateral");
        
        const cashValue = dashCashEl ? (parseFloat(dashCashEl.textContent.replace(/[₹,]/g, "")) || summary.cash) : summary.cash;
        const collateralValue = dashCollateralEl ? (parseFloat(dashCollateralEl.textContent.replace(/[₹,]/g, "")) || 0) : 285000;
        const marginUsedValue = dashMarginUsedEl ? (parseFloat(dashMarginUsedEl.textContent.replace(/[₹,]/g, "")) || 0) : 148560;
        
        const purchasingPower = cashValue + collateralValue;
        const marginHealthPct = purchasingPower > 0 ? ((purchasingPower - marginUsedValue) / purchasingPower) * 100 : 0;
        const marginUsedPct = purchasingPower > 0 ? (marginUsedValue / purchasingPower) * 100 : 0;

        // Update Stats Labels
        document.getElementById("port-total-val").textContent = `₹${Math.round(summary.totalValue).toLocaleString('en-IN')}`;
        document.getElementById("port-holdings-val").textContent = `₹${Math.round(summary.holdingsValue).toLocaleString('en-IN')}`;
        
        // Update new Purchasing Power indicator
        const powerEl = document.getElementById("port-purchasing-power");
        if (powerEl) powerEl.textContent = `₹${Math.round(purchasingPower).toLocaleString('en-IN')}`;
        
        const marginPctEl = document.getElementById("port-margin-used-pct");
        if (marginPctEl) marginPctEl.textContent = `${marginUsedPct.toFixed(1)}%`;
        
        // Update progress bar width for Margin Health
        const marginHealthBar = document.querySelector("#view-portfolio .glass-card .bg-emerald-500.rounded-full");
        if (marginHealthBar) marginHealthBar.style.width = `${marginHealthPct}%`;
        
        // Cash reserves liquidity (still showing cash only)
        const portCashEl = document.getElementById("port-cash-val");
        if (portCashEl) portCashEl.textContent = `₹${Math.round(cashValue).toLocaleString('en-IN')}`;
        
        const isPos = summary.profit >= 0;
        const portPct = document.getElementById("port-total-profit-pct");
        if (portPct) {
            portPct.textContent = `${isPos ? '+' : ''}₹${Math.round(summary.profit).toLocaleString('en-IN')} (${isPos ? '+' : ''}${summary.profitPercent.toFixed(2)}%)`;
            portPct.className = `text-[10px] font-semibold mt-1 block ${isPos ? 'text-emerald-400' : 'text-red-400'}`;
        }
        
        // Sync Cloned Limits
        const cloneAvail = document.getElementById("port-clone-lim-avail-margin");
        const cloneUsed = document.getElementById("port-clone-lim-margin-used");
        const cloneCash = document.getElementById("port-clone-lim-cash-bal");
        const cloneCollat = document.getElementById("port-clone-lim-collateral");
        
        if (cloneAvail && dashCashEl) cloneAvail.textContent = document.getElementById("lim-avail-margin")?.textContent || "₹6,23,420.00";
        if (cloneUsed && dashMarginUsedEl) cloneUsed.innerHTML = dashMarginUsedEl.innerHTML;
        if (cloneCash) cloneCash.textContent = `₹${Math.round(cashValue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        if (cloneCollat && dashCollateralEl) cloneCollat.textContent = dashCollateralEl.textContent;

        // Populate holdings tables
        const tbody = document.getElementById("port-holdings-tbody");
        const mfTbody = document.getElementById("port-mf-holdings-tbody");
        
        if (tbody) {
            const stockHolds = [];
            const mfHolds = [];
            const etfHolds = [];
            
            data.userState.portfolio.holdings.forEach(hold => {
                const isMF = data.mutualFunds ? data.mutualFunds.some(m => m.id === hold.symbol) : false;
                const isETF = data.etfs ? data.etfs.some(e => e.symbol === hold.symbol) : false;
                if (isMF) mfHolds.push(hold);
                else if (isETF) etfHolds.push(hold);
                else stockHolds.push(hold);
            });

            // 1. Render Stocks/Crypto
            if (stockHolds.length === 0) {
                tbody.innerHTML = `<tr><td colspan="8" class="py-10 text-center text-gray-500">No stock or crypto positions found.</td></tr>`;
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
                    const hashTarget = isCrypto ? '#crypto' : `#company-details/${hold.symbol}`;

                    return `<tr class="hover:bg-white/2 cursor-pointer transition" onclick="window.location.hash='${hashTarget}'">
                        <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                            <span class="w-1.5 h-1.5 rounded-full ${isCrypto ? 'bg-amber-400' : 'bg-emerald-500'}"></span> ${hold.symbol}
                        </td>
                        <td class="py-3.5">${hold.shares}</td>
                        <td class="py-3.5 font-mono">₹${hold.avgCost.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹${stock.price.toFixed(2)}</td>
                        <td class="py-3.5 font-mono">₹${Math.round(investedVal).toLocaleString()}</td>
                        <td class="py-3.5 font-mono">₹${Math.round(currentVal).toLocaleString()}</td>
                        <td class="py-3.5 text-right font-mono font-bold ${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                            ${holdsPos ? '+' : ''}${profitPct.toFixed(1)}%
                        </td>
                        <td class="py-3.5 text-right pr-4">
                            <button class="glass-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all" onclick="window.location.hash='${hashTarget}'; event.stopPropagation();">
                                Details
                            </button>
                        </td>
                    </tr>`;
                }).join("");
            }
            
            // 2. Render ETFs
            const etfTbody = document.getElementById("port-etf-holdings-tbody");
            if (etfTbody) {
                if (etfHolds.length === 0) {
                    etfTbody.innerHTML = `<tr><td colspan="8" class="py-10 text-center text-gray-500">No ETF positions found.</td></tr>`;
                } else {
                    etfTbody.innerHTML = etfHolds.map(hold => {
                        const fromETF = data.etfs.find(e => e.symbol === hold.symbol);
                        const currentPrice = fromETF ? fromETF.price : hold.avgCost;
                        const name = fromETF ? fromETF.name : hold.symbol;
                        
                        const investedVal = hold.shares * hold.avgCost;
                        const currentVal = hold.shares * currentPrice;
                        const profit = currentVal - investedVal;
                        const profitPct = investedVal > 0 ? (profit / investedVal) * 100 : 0;
                        const holdsPos = profit >= 0;

                        return `<tr class="hover:bg-white/2 cursor-pointer transition" onclick="window.location.hash='#etfs'">
                            <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-purple-500"></span> ${hold.symbol}
                                <span class="text-[9px] text-gray-500 font-normal hidden md:inline-block truncate max-w-[120px]" title="${name}">- ${name}</span>
                            </td>
                            <td class="py-3.5">${hold.shares}</td>
                            <td class="py-3.5 font-mono">₹${hold.avgCost.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹${currentPrice.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹${Math.round(investedVal).toLocaleString()}</td>
                            <td class="py-3.5 font-mono">₹${Math.round(currentVal).toLocaleString()}</td>
                            <td class="py-3.5 text-right font-mono font-bold ${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                                ${holdsPos ? '+' : ''}${profitPct.toFixed(1)}%
                            </td>
                            <td class="py-3.5 text-right pr-4">
                                <button class="glass-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all" onclick="window.location.hash='#etfs'; event.stopPropagation();">
                                    Details
                                </button>
                            </td>
                        </tr>`;
                    }).join("");
                }
            }

            // 3. Render Mutual Funds
            if (mfTbody) {
                if (mfHolds.length === 0) {
                    mfTbody.innerHTML = `<tr><td colspan="7" class="py-10 text-center text-gray-500">No mutual fund investments found.</td></tr>`;
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

                        return `<tr class="hover:bg-white/2 transition">
                            <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                                <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> ${name}
                            </td>
                            <td class="py-3.5">${hold.shares}</td>
                            <td class="py-3.5 font-mono">₹${hold.avgCost.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹${currentNav.toFixed(2)}</td>
                            <td class="py-3.5 font-mono">₹${Math.round(investedVal).toLocaleString()}</td>
                            <td class="py-3.5 font-mono">₹${Math.round(currentVal).toLocaleString()}</td>
                            <td class="py-3.5 text-right font-mono font-bold ${holdsPos ? 'text-emerald-400' : 'text-red-400'}">
                                ${holdsPos ? '+' : ''}${profitPct.toFixed(1)}%
                            </td>
                            <td class="py-3.5 text-right pr-4">
                                <button class="glass-btn bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[10.5px] font-bold px-3 py-1.5 rounded-lg border border-emerald-500/20 transition-all" onclick="window.location.hash='#mutual-funds'; event.stopPropagation();">
                                    Details
                                </button>
                            </td>
                        </tr>`;
                    }).join("");
                }
            }
        }

        // Render Trending Stocks Recommendations dynamically
        const demandingSymbols = ["RELIANCE", "TATAMOTORS", "HDFCBANK", "TCS", "ICICIBANK"];
        const trendingListDiv = document.getElementById("trending-stocks-list");
        if (trendingListDiv) {
            trendingListDiv.innerHTML = demandingSymbols.map(sym => {
                const detailed = data.stocks[sym];
                const fromList = data.allStocksList.find(s => s.symbol === sym);
                const stock = detailed || fromList || { symbol: sym, name: sym, price: 1000, changePercent: 1.5 };
                
                const stockPrice = stock.price;
                const changePct = stock.changePercent || 0;
                const isPos = changePct >= 0;
                const name = stock.name.replace(" Limited", "").replace(" Ltd.", "");
                
                return `
                <div class="glass-card p-4 rounded-xl flex flex-col justify-between space-y-3 hover:border-emerald-500/20 transition-all duration-300">
                    <div>
                        <div class="flex justify-between items-start">
                            <span class="font-poppins font-black text-white text-xs tracking-wider">${stock.symbol}</span>
                            <span class="text-[10px] font-semibold font-mono ${isPos ? 'text-emerald-400' : 'text-red-400'}">
                                ${isPos ? '▲' : '▼'} ${Math.abs(changePct).toFixed(1)}%
                            </span>
                        </div>
                        <span class="text-[10px] text-gray-400 block truncate mt-1">${name}</span>
                    </div>
                    <div class="flex items-center justify-between pt-1">
                        <span class="font-mono font-bold text-white text-xs">₹${stockPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                        <button class="bg-emerald-500 hover:bg-emerald-600 text-black text-[10.5px] font-bold px-2.5 py-1.5 rounded-md transition-all flex items-center gap-0.5" 
                            onclick="window.openStockTradeModal('${stock.symbol}', ${stockPrice}); event.stopPropagation();">
                            + Buy
                        </button>
                    </div>
                </div>
                `;
            }).join("");
        }

        // Draw donut allocation charts
        const colors = ["#10b981", "#3b82f6", "#f59e0b", "#ec4899", "#8b5cf6", "#6366f1", "#14b8a6"];
        
        const stockHoldsPie = [];
        const mfHoldsPie = [];
        const etfHoldsPie = [];
        data.userState.portfolio.holdings.forEach(h => {
            const isMF = data.mutualFunds ? data.mutualFunds.some(m => m.id === h.symbol) : false;
            const isETF = data.etfs ? data.etfs.some(e => e.symbol === h.symbol) : false;
            if (isMF) mfHoldsPie.push(h);
            else if (isETF) etfHoldsPie.push(h);
            else stockHoldsPie.push(h);
        });

        // 1. Stock Sector Pie
        const stockSlices = stockHoldsPie.map((h, i) => {
            const fromList = data.allStocksList.find(s => s.symbol === h.symbol);
            const fromCrypto = data.cryptos ? data.cryptos.find(c => c.symbol === h.symbol) : null;
            const stock = data.stocks[h.symbol] || fromList || fromCrypto || { price: h.avgCost, sector: "Diversified" };
            return {
                label: stock.sector || "Equities",
                value: h.shares * stock.price,
                color: colors[i % colors.length]
            };
        });
        
        // Group by label if needed, but for now simple mapping
        const groupedStockSlices = {};
        stockSlices.forEach(s => {
            if (!groupedStockSlices[s.label]) groupedStockSlices[s.label] = 0;
            groupedStockSlices[s.label] += s.value;
        });
        const finalStockSlices = Object.keys(groupedStockSlices).map((label, i) => ({
            label, value: groupedStockSlices[label], color: colors[i % colors.length]
        }));

        finalStockSlices.push({ label: "Cash reserves", value: data.userState.portfolio.cash, color: "#6b7280" });
        drawDonutChart("port-sector-pie-canvas", finalStockSlices);

        const legends = document.getElementById("port-sector-legends");
        if (legends) {
            legends.innerHTML = finalStockSlices.map(s => {
                return `<div class="flex items-center justify-between text-[11px] mb-1">
                    <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background-color: ${s.color}"></span> ${s.label}</span>
                    <strong class="text-white font-mono">₹${Math.round(s.value).toLocaleString()}</strong>
                </div>`;
            }).join("");
        }

        // 2. ETF Theme Weight Pie
        if (document.getElementById("port-etf-pie-canvas")) {
            const etfSlices = etfHoldsPie.map((h, i) => {
                const fromETF = data.etfs.find(e => e.symbol === h.symbol);
                return {
                    label: fromETF ? fromETF.theme : "ETF",
                    value: h.shares * (fromETF ? fromETF.price : h.avgCost),
                    color: colors[i % colors.length]
                };
            });

            const groupedEtfSlices = {};
            etfSlices.forEach(s => {
                if (!groupedEtfSlices[s.label]) groupedEtfSlices[s.label] = 0;
                groupedEtfSlices[s.label] += s.value;
            });
            let finalEtfSlices = Object.keys(groupedEtfSlices).map((label, i) => ({
                label, value: groupedEtfSlices[label], color: colors[i % colors.length]
            }));

            if (finalEtfSlices.length === 0) finalEtfSlices.push({ label: "No ETFs", value: 1, color: "#374151" });

            drawDonutChart("port-etf-pie-canvas", finalEtfSlices);

            const etfLegends = document.getElementById("port-etf-legends");
            if (etfLegends) {
                if (finalEtfSlices.length === 1 && finalEtfSlices[0].label === "No ETFs") {
                    etfLegends.innerHTML = `<div class="text-center text-gray-500 py-4">No ETFs in portfolio</div>`;
                } else {
                    etfLegends.innerHTML = finalEtfSlices.map(s => {
                        return `<div class="flex items-center justify-between text-[11px] mb-1">
                            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background-color: ${s.color}"></span> ${s.label}</span>
                            <strong class="text-white font-mono">₹${Math.round(s.value).toLocaleString()}</strong>
                        </div>`;
                    }).join("");
                }
            }
        }

        // 3. Mutual Fund Category Pie
        if (document.getElementById("port-mf-pie-canvas")) {
            const mfSlices = mfHoldsPie.map((h, i) => {
                const fromMF = data.mutualFunds.find(m => m.id === h.symbol);
                return {
                    label: fromMF ? fromMF.category : "Funds",
                    value: h.shares * (fromMF ? fromMF.nav : h.avgCost),
                    color: colors[i % colors.length]
                };
            });
            
            const groupedMfSlices = {};
            mfSlices.forEach(s => {
                if (!groupedMfSlices[s.label]) groupedMfSlices[s.label] = 0;
                groupedMfSlices[s.label] += s.value;
            });
            let finalMfSlices = Object.keys(groupedMfSlices).map((label, i) => ({
                label, value: groupedMfSlices[label], color: colors[i % colors.length]
            }));
            
            if (finalMfSlices.length === 0) finalMfSlices.push({ label: "No Funds", value: 1, color: "#374151" });
            
            drawDonutChart("port-mf-pie-canvas", finalMfSlices);

            const mfLegends = document.getElementById("port-mf-legends");
            if (mfLegends) {
                if (finalMfSlices.length === 1 && finalMfSlices[0].label === "No Funds") {
                    mfLegends.innerHTML = `<div class="text-center text-gray-500 py-4">No Mutual Funds in portfolio</div>`;
                } else {
                    mfLegends.innerHTML = finalMfSlices.map(s => {
                        return `<div class="flex items-center justify-between text-[11px] mb-1">
                            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-sm" style="background-color: ${s.color}"></span> ${s.label}</span>
                            <strong class="text-white font-mono">₹${Math.round(s.value).toLocaleString()}</strong>
                        </div>`;
                    }).join("");
                }
            }
        }

        // Render Goals lists
        const goalsDiv = document.getElementById("port-goals-list");
        if (goalsDiv) {
            goalsDiv.innerHTML = data.userState.goals.map(g => {
                const progress = (g.current / g.target) * 100;
                return `<div class="space-y-1 text-xs">
                    <div class="flex justify-between font-semibold">
                        <span class="text-white">${g.name} (By ${g.deadline})</span>
                        <span class="text-amber-500 font-mono">${progress.toFixed(0)}% (₹${Math.round(g.current).toLocaleString()}/${Math.round(g.target).toLocaleString()})</span>
                    </div>
                    <div class="w-full h-2 rounded bg-zinc-800 overflow-hidden relative">
                        <div class="h-full bg-gradient-to-r from-emerald-500 to-amber-500" style="width: ${progress}%"></div>
                    </div>
                </div>`;
            }).join("");
        }

        // Transactions logger
        const txDiv = document.getElementById("port-transactions-list");
        if (txDiv) {
            txDiv.innerHTML = data.userState.portfolio.transactions.map(t => {
                const isBuy = t.type === "BUY";
                const isMF = data.mutualFunds ? data.mutualFunds.some(m => m.id === t.symbol) : false;
                const qtyLabel = isMF ? "units" : "shares";
                
                return `<div class="flex items-center justify-between p-2.5 rounded-lg bg-[#121217] border border-white/5 text-[11px]">
                    <div>
                        <strong class="${isBuy ? 'text-emerald-400' : 'text-red-400'} font-bold">${t.type}</strong>
                        <span class="text-white font-bold ml-1 inline-block max-w-[110px] truncate align-bottom" title="${t.symbol}">${t.symbol}</span>
                        <span class="text-gray-500 block mt-0.5">${t.date}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-white block font-mono">${t.shares} ${qtyLabel}</span>
                        <span class="text-gray-400 block font-mono">@ ₹${t.price}</span>
                    </div>
                </div>`;
            }).join("");
        }
    }

    // Modal forms bindings for Transactions adding
    const addTxBtn = document.getElementById("add-transaction-modal-btn");
    const txModal = document.getElementById("tx-modal");
    
    if (addTxBtn) {
        addTxBtn.addEventListener("click", () => {
            // Fill symbol dropdown options with categorized optgroups
            const drop = document.getElementById("tx-symbol-select");
            let html = '';
            // Stocks group
            html += '<optgroup label="── Stocks ──">';
            data.allStocksList.forEach(st => {
                html += `<option value="${st.symbol}">${st.symbol}</option>`;
            });
            html += '</optgroup>';
            // ETFs group
            if (data.etfs && data.etfs.length > 0) {
                html += '<optgroup label="── ETFs ──">';
                data.etfs.forEach(e => {
                    html += `<option value="${e.symbol}">${e.symbol} - ${e.name}</option>`;
                });
                html += '</optgroup>';
            }
            // Cryptos group
            if (data.cryptos && data.cryptos.length > 0) {
                html += '<optgroup label="── Crypto ──">';
                data.cryptos.forEach(c => {
                    html += `<option value="${c.symbol}">${c.symbol} (Crypto)</option>`;
                });
                html += '</optgroup>';
            }
            drop.innerHTML = html;
            
            // Sync default inputs
            document.getElementById("tx-price-input").value = data.allStocksList[0].price;
            
            const lblSymbol = document.getElementById("lbl-tx-symbol");
            if (lblSymbol) lblSymbol.innerText = "Stock Ticker";
            const lblShares = document.getElementById("lbl-tx-shares");
            if (lblShares) lblShares.innerText = "Shares Count";
            const lblPrice = document.getElementById("lbl-tx-price");
            if (lblPrice) lblPrice.innerText = "Execution Price (₹)";
            
            txModal.classList.remove("hidden");
        });

        // Auto-update price and labels when symbol selection changes
        const txSymbolSelect = document.getElementById("tx-symbol-select");
        if (txSymbolSelect) {
            txSymbolSelect.addEventListener("change", function() {
                const selectedSymbol = this.value;
                const priceInput = document.getElementById("tx-price-input");
                const lblSymbol = document.getElementById("lbl-tx-symbol");
                const lblShares = document.getElementById("lbl-tx-shares");
                const lblPrice = document.getElementById("lbl-tx-price");

                // Determine asset type and update price/labels
                const fromETF = data.etfs ? data.etfs.find(e => e.symbol === selectedSymbol) : null;
                const fromCrypto = data.cryptos ? data.cryptos.find(c => c.symbol === selectedSymbol) : null;
                const fromStock = data.allStocksList.find(s => s.symbol === selectedSymbol);

                if (fromETF) {
                    if (priceInput) priceInput.value = fromETF.price.toFixed(2);
                    if (lblSymbol) lblSymbol.innerText = "ETF Basket";
                    if (lblShares) lblShares.innerText = "Units Count";
                    if (lblPrice) lblPrice.innerText = "NAV / Price (₹)";
                } else if (fromCrypto) {
                    if (priceInput) priceInput.value = fromCrypto.price.toFixed(2);
                    if (lblSymbol) lblSymbol.innerText = "Crypto Asset";
                    if (lblShares) lblShares.innerText = "Token Quantity";
                    if (lblPrice) lblPrice.innerText = "Market Price (₹)";
                } else if (fromStock) {
                    if (priceInput) priceInput.value = fromStock.price.toFixed(2);
                    if (lblSymbol) lblSymbol.innerText = "Stock Ticker";
                    if (lblShares) lblShares.innerText = "Shares Count";
                    if (lblPrice) lblPrice.innerText = "Execution Price (₹)";
                }
            });
        }
    }
    
    // Global helper for Mutual Funds 
    window.openInvestModal = function(id, name, nav) {
        const drop = document.getElementById("tx-symbol-select");
        const modal = document.getElementById("tx-modal");
        
        // Ensure this specific mutual fund exists in the dropdown options
        if (drop && !drop.querySelector(`option[value="${id}"]`)) {
            drop.innerHTML = `<option value="${id}">${name}</option>` + drop.innerHTML;
        }
        
        if (drop) drop.value = id;
        
        const priceInput = document.getElementById("tx-price-input");
        if (priceInput) priceInput.value = nav;
        
        const sharesInput = document.getElementById("tx-shares-input");
        if (sharesInput) sharesInput.value = 1; 
        
        const lblSymbol = document.getElementById("lbl-tx-symbol");
        if (lblSymbol) lblSymbol.innerText = "Fund Name";
        const lblShares = document.getElementById("lbl-tx-shares");
        if (lblShares) lblShares.innerText = "Units";
        const lblPrice = document.getElementById("lbl-tx-price");
        if (lblPrice) lblPrice.innerText = "NAV Price (₹)";
        
        if (modal) modal.classList.remove("hidden");
    };

    // Mutual Fund Comparison Helpers
    window.openCompareModal = function(fundId) {
        const modal = document.getElementById("mf-compare-modal");
        if (!modal) return;

        const fund1 = data.mutualFunds.find(f => f.id === fundId);
        if (!fund1) return;

        const name1El = document.getElementById("compare-fund-1-name");
        if (name1El) name1El.textContent = fund1.name;

        const select2 = document.getElementById("compare-fund-2-select");
        if (select2) {
            const otherFunds = data.mutualFunds.filter(f => f.id !== fundId);
            select2.innerHTML = otherFunds.map(f => `<option value="${f.id}">${f.name}</option>`).join("");
            
            if (otherFunds.length > 0) {
                updateComparison(fund1, otherFunds[0]);
            }

            select2.onchange = function() {
                const fund2 = data.mutualFunds.find(f => f.id === select2.value);
                if (fund2) {
                    updateComparison(fund1, fund2);
                }
            };
        }

        modal.classList.remove("hidden");
    };

    function updateComparison(f1, f2) {
        document.getElementById("compare-name-1").textContent = f1.name;
        document.getElementById("compare-name-2").textContent = f2.name;

        document.getElementById("compare-cat-1").textContent = f1.category;
        document.getElementById("compare-cat-2").textContent = f2.category;

        document.getElementById("compare-risk-1").innerHTML = `<span class="px-2 py-0.5 rounded font-bold uppercase ${f1.risk.includes('High') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}">${f1.risk}</span>`;
        document.getElementById("compare-risk-2").innerHTML = `<span class="px-2 py-0.5 rounded font-bold uppercase ${f2.risk.includes('High') ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'}">${f2.risk}</span>`;

        document.getElementById("compare-nav-1").textContent = `₹${f1.nav.toFixed(2)}`;
        document.getElementById("compare-nav-2").textContent = `₹${f2.nav.toFixed(2)}`;

        const exp1 = f1.expenseRatio;
        const exp2 = f2.expenseRatio;
        const exp1Class = exp1 <= exp2 ? 'text-emerald-400 font-bold' : 'text-white';
        const exp2Class = exp2 <= exp1 ? 'text-emerald-400 font-bold' : 'text-white';
        document.getElementById("compare-exp-1").className = `font-mono ${exp1Class}`;
        document.getElementById("compare-exp-1").textContent = `${exp1}%`;
        document.getElementById("compare-exp-2").className = `font-mono ${exp2Class}`;
        document.getElementById("compare-exp-2").textContent = `${exp2}%`;

        const ret3y1 = f1.return3y;
        const ret3y2 = f2.return3y;
        const ret3y1Class = ret3y1 >= ret3y2 ? 'text-emerald-400 font-bold' : 'text-white';
        const ret3y2Class = ret3y2 >= ret3y1 ? 'text-emerald-400 font-bold' : 'text-white';
        document.getElementById("compare-ret3y-1").className = `font-mono ${ret3y1Class}`;
        document.getElementById("compare-ret3y-1").textContent = `${ret3y1}%`;
        document.getElementById("compare-ret3y-2").className = `font-mono ${ret3y2Class}`;
        document.getElementById("compare-ret3y-2").textContent = `${ret3y2}%`;

        const ret5y1 = f1.return5y;
        const ret5y2 = f2.return5y;
        const ret5y1Class = ret5y1 >= ret5y2 ? 'text-emerald-400 font-bold' : 'text-white';
        const ret5y2Class = ret5y2 >= ret5y1 ? 'text-emerald-400 font-bold' : 'text-white';
        document.getElementById("compare-ret5y-1").className = `font-mono ${ret5y1Class}`;
        document.getElementById("compare-ret5y-1").textContent = `${ret5y1}%`;
        document.getElementById("compare-ret5y-2").className = `font-mono ${ret5y2Class}`;
        document.getElementById("compare-ret5y-2").textContent = `${ret5y2}%`;

        document.getElementById("compare-sip-1").textContent = `₹${f1.minSip}`;
        document.getElementById("compare-sip-2").textContent = `₹${f2.minSip}`;

        const aum1 = Math.round((f1.name.length * 482) + 1250);
        const aum2 = Math.round((f2.name.length * 482) + 1250);
        document.getElementById("compare-aum-1").textContent = `₹${aum1.toLocaleString('en-IN')} Cr`;
        document.getElementById("compare-aum-2").textContent = `₹${aum2.toLocaleString('en-IN')} Cr`;

        document.getElementById("compare-exit-1").textContent = f1.category.includes("Index") ? "Nil" : "1.00% (within 365 days)";
        document.getElementById("compare-exit-2").textContent = f2.category.includes("Index") ? "Nil" : "1.00% (within 365 days)";

        const alloc1 = getAlloc(f1.category);
        const alloc2 = getAlloc(f2.category);
        
        document.getElementById("compare-alloc-1").innerHTML = renderAlloc(alloc1);
        document.getElementById("compare-alloc-2").innerHTML = renderAlloc(alloc2);
    }

    function getAlloc(cat) {
        if (cat.includes("Large") || cat.includes("Bluechip")) return { eq: 95, dt: 3, cs: 2 };
        if (cat.includes("Mid") || cat.includes("Small")) return { eq: 92, dt: 5, cs: 3 };
        if (cat.includes("Multi") || cat.includes("Flexi")) return { eq: 88, dt: 8, cs: 4 };
        if (cat.includes("Index")) return { eq: 99, dt: 0, cs: 1 };
        return { eq: 75, dt: 20, cs: 5 };
    }

    function renderAlloc(a) {
        return `
            <div class="space-y-1 w-full max-w-[200px]">
                <div class="flex justify-between text-[9px] text-gray-500 font-bold">
                    <span>EQ: ${a.eq}%</span>
                    <span>DT: ${a.dt}%</span>
                    <span>CS: ${a.cs}%</span>
                </div>
                <div class="h-2 w-full bg-white/5 rounded-full overflow-hidden flex">
                    <div class="bg-emerald-500 h-full" style="width: ${a.eq}%"></div>
                    <div class="bg-blue-500 h-full" style="width: ${a.dt}%"></div>
                    <div class="bg-amber-500 h-full" style="width: ${a.cs}%"></div>
                </div>
            </div>
        `;
    }

    const closeCompareBtn = document.getElementById("close-mf-compare-btn");
    if (closeCompareBtn) {
        closeCompareBtn.addEventListener("click", () => {
            document.getElementById("mf-compare-modal").classList.add("hidden");
        });
    }

    const closeTxModalBtn = document.getElementById("close-tx-modal-btn");
    if (closeTxModalBtn) {
        closeTxModalBtn.addEventListener("click", () => txModal.classList.add("hidden"));
    }

    // Trigger calculation when changing select options
    const txSelect = document.getElementById("tx-symbol-select");
    if (txSelect) {
        txSelect.addEventListener("change", (e) => {
            const sym = e.target.value;
            const isMF = data.mutualFunds ? data.mutualFunds.some(m => m.id === sym) : false;
            
            if (isMF) {
                const match = data.mutualFunds.find(m => m.id === sym);
                if (match) document.getElementById("tx-price-input").value = match.nav;
                
                const lblSymbol = document.getElementById("lbl-tx-symbol");
                if (lblSymbol) lblSymbol.innerText = "Fund Name";
                const lblShares = document.getElementById("lbl-tx-shares");
                if (lblShares) lblShares.innerText = "Units";
                const lblPrice = document.getElementById("lbl-tx-price");
                if (lblPrice) lblPrice.innerText = "NAV Price (₹)";
            } else {
                const match = data.allStocksList.find(st => st.symbol === sym);
                if (match) document.getElementById("tx-price-input").value = match.price;
                
                const lblSymbol = document.getElementById("lbl-tx-symbol");
                if (lblSymbol) lblSymbol.innerText = "Stock Ticker";
                const lblShares = document.getElementById("lbl-tx-shares");
                if (lblShares) lblShares.innerText = "Shares Count";
                const lblPrice = document.getElementById("lbl-tx-price");
                if (lblPrice) lblPrice.innerText = "Execution Price (₹)";
            }
        });
    }

    const submitTxBtn = document.getElementById("submit-tx-btn");
    if (submitTxBtn) {
        submitTxBtn.addEventListener("click", async () => {
            const action = document.getElementById("tx-action-select").value;
            const symbol = document.getElementById("tx-symbol-select").value;
            const shares = parseInt(document.getElementById("tx-shares-input").value);
            const price = parseFloat(document.getElementById("tx-price-input").value);
            
            const res = await window.PortfolioManager.addTransaction(action, symbol, shares, price);
            alert(res.msg);
            
            if (res.success) {
                txModal.classList.add("hidden");
                setupPortfolioView();
                logAdminAction(`Executed Port order: ${action} ${shares} shares of ${symbol}`);
            }
        });
    }

    // Launch AI Portfolio Doctor logic
    const doctorBtn = document.getElementById("run-portfolio-doctor-btn");
    const docModal = document.getElementById("doctor-report-modal");
    
    if (doctorBtn) {
        doctorBtn.addEventListener("click", () => {
            const portfolio = data.userState.portfolio;
            const analysis = window.PortfolioDoctor.analyze(portfolio);

            document.getElementById("doctor-report-score").textContent = `${analysis.score}/100`;
            document.getElementById("doctor-report-status").textContent = analysis.status;
            
            const isAlertMood = analysis.score < 80;
            document.getElementById("doctor-report-score").className = `text-3xl font-poppins font-black ${
                isAlertMood ? 'text-amber-500' : 'text-emerald-400'
            }`;

            // Add Observations
            const obsContainer = document.getElementById("doctor-report-obs");
            obsContainer.innerHTML = analysis.observations.map(obs => `<div class="p-2.5 rounded-lg bg-white/2 border border-white/5">${obs}</div>`).join("");

            // Add Rebalance checklist
            const rebalanceContainer = document.getElementById("doctor-report-rebalance");
            if (analysis.rebalanceList.length === 0) {
                rebalanceContainer.innerHTML = `<div class="p-2 rounded bg-emerald-500/10 text-emerald-400 text-center font-bold">✅ Portfolio allocation is perfectly optimized. No rebalancing actions needed.</div>`;
            } else {
                rebalanceContainer.innerHTML = analysis.rebalanceList.map(rec => {
                    return `<div class="p-3 border border-white/5 rounded-lg bg-zinc-900 flex justify-between items-center">
                        <div>
                            <strong class="text-amber-500 font-bold uppercase tracking-wider">${rec.action}: ${rec.symbol}</strong>
                            <p class="text-gray-400 text-[10px] mt-0.5">${rec.reason}</p>
                        </div>
                        <button class="bg-amber-500 hover:bg-amber-600 text-black text-[10px] font-bold px-3 py-1.5 rounded transition" onclick="alert('Initiating smart trade rebalance: Sell portfolio cluster to buy ${rec.redeploy}')">
                            Execute Order
                        </button>
                    </div>`;
                }).join("");
            }

            docModal.classList.remove("hidden");
            logAdminAction("AI Portfolio Doctor ran diagnostics report.");
        });
    }

    const closeDoctorModalBtn = document.getElementById("close-doctor-modal-btn");
    if (closeDoctorModalBtn) {
        closeDoctorModalBtn.addEventListener("click", () => docModal.classList.add("hidden"));
    }


    // --- AI ASSISTANT VIEW ---
    function setupAIAssistantView() {
        // Run Default backtest logic
        runBacktestSimulation();
    }

    // Toggle panels inside workspace
    document.querySelectorAll(".ai-tool-menu-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".ai-tool-menu-btn").forEach(b => b.classList.remove("active", "border-amber-500/20"));
            btn.classList.add("active", "border-amber-500/20");
            
            const tool = btn.getAttribute("data-tool");
            
            document.querySelectorAll(".ai-subtool-panel").forEach(p => p.classList.add("hidden"));
            document.getElementById(`ai-toolpanel-${tool}`).classList.remove("hidden");
        });
    });

    // Run Strategy simulation
    const runBacktestBtn = document.getElementById("run-backtest-btn");
    if (runBacktestBtn) {
        runBacktestBtn.addEventListener("click", runBacktestSimulation);
    }

    function runBacktestSimulation() {
        const symbol = document.getElementById("backtest-symbol").value;
        const short = parseInt(document.getElementById("backtest-short").value);
        const long = parseInt(document.getElementById("backtest-long").value);
        
        if (short >= long) {
            alert("Error: Short MA period must be less than Long MA period.");
            return;
        }

        const res = window.StrategyBacktester.run(symbol, short, long);

        // Update Stats values
        const prof = document.getElementById("bt-res-profit");
        const hasProfit = res.totalProfitPercent >= 0;
        prof.textContent = `${hasProfit ? '+' : ''}${res.totalProfitPercent}%`;
        prof.className = `mt-1 block text-lg font-poppins font-bold ${hasProfit ? 'text-emerald-400' : 'text-red-400'}`;

        document.getElementById("bt-res-capital").textContent = `₹${res.endingCapital.toLocaleString()}`;
        document.getElementById("bt-res-win").textContent = `${res.winRate}%`;

        // Render logs list
        const ledger = document.getElementById("bt-res-ledger");
        ledger.innerHTML = res.tradeLogs.map(log => {
            const isBuy = log.type === "BUY";
            return `<div class="flex justify-between py-1 border-b border-white/5 font-mono">
                <span class="${isBuy ? 'text-emerald-400' : 'text-red-400'} font-bold">[Day ${log.day}] ${log.type}</span>
                <span class="text-white">Price: ₹${log.price}</span>
                <span class="text-gray-500">${
                    isBuy ? 'Capital: ₹' + Math.round(log.capitalBefore).toLocaleString() : 'Profit: ' + log.profitPercent.toFixed(1) + '%'
                }</span>
            </div>`;
        }).join("");

        // RENDER STRATEGY VISUAL CHART
        const canvas = document.getElementById("backtest-chart-canvas");
        const ctx = canvas.getContext("2d");
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        const w = rect.width;
        const h = rect.height;
        ctx.fillStyle = "#09090b";
        ctx.fillRect(0, 0, w, h);

        const prices = res.priceSeries;
        const count = prices.length;

        let minP = Infinity;
        let maxP = -Infinity;
        prices.forEach(p => {
            if (p.price < minP) minP = p.price;
            if (p.price > maxP) maxP = p.price;
        });

        const pRange = maxP - minP || 10;
        const getX = (idx) => 10 + idx * ((w - 20) / (count - 1));
        const getY = (val) => h - 15 - ((val - minP) / pRange) * (h - 30);

        // Draw line chart prices
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(getX(0), getY(prices[0].price));
        for (let i = 1; i < count; i++) ctx.lineTo(getX(i), getY(prices[i].price));
        ctx.stroke();

        // Draw SMA lines
        ctx.strokeStyle = "#f59e0b"; // Orange Short SMA
        ctx.beginPath();
        let sStarted = false;
        for (let i = 0; i < count; i++) {
            const val = res.shortSmaSeries[i];
            if (val !== null) {
                if (!sStarted) { ctx.moveTo(getX(i), getY(val)); sStarted = true; }
                else ctx.lineTo(getX(i), getY(val));
            }
        }
        ctx.stroke();

        ctx.strokeStyle = "#8b5cf6"; // Purple Long SMA
        ctx.beginPath();
        let lStarted = false;
        for (let i = 0; i < count; i++) {
            const val = res.longSmaSeries[i];
            if (val !== null) {
                if (!lStarted) { ctx.moveTo(getX(i), getY(val)); lStarted = true; }
                else ctx.lineTo(getX(i), getY(val));
            }
        }
        ctx.stroke();

        // Draw signal triggers circles
        res.tradeLogs.forEach(log => {
            const idx = log.day - 1;
            const x = getX(idx);
            const y = getY(prices[idx].price);
            
            ctx.fillStyle = log.type === "BUY" ? "#10b981" : "#ef4444";
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, Math.PI * 2);
            ctx.fill();
        });

        document.getElementById("backtest-results-board").classList.remove("hidden");
        logAdminAction(`Strategy backtest simulated on ${symbol}`);
    }

    // Wealth Coach roadmap builder triggers
    const runCoachBtn = document.getElementById("run-coach-btn");
    if (runCoachBtn) {
        runCoachBtn.addEventListener("click", () => {
            const target = document.getElementById("coach-target").value;
            const yrs = document.getElementById("coach-years").value;
            
            // Calculate project compounding
            const monthlySip = (target * 0.0058) / yrs; // mock estimation
            
            document.getElementById("coach-res-monthly").textContent = `₹${Math.round(monthlySip).toLocaleString()} / month`;
            document.getElementById("coach-results-board").classList.remove("hidden");
        });
    }

    // Voice assistant simulation commands listener
    const startVoiceBtn = document.getElementById("voice-start-btn");
    if (startVoiceBtn) {
        startVoiceBtn.addEventListener("click", () => {
            const box = document.getElementById("voice-status-box");
            box.classList.remove("hidden");
            
            // Ping pulses ring
            document.getElementById("voice-pulse-ring").classList.remove("hidden");

            setTimeout(() => {
                box.classList.add("hidden");
                document.getElementById("voice-pulse-ring").classList.add("hidden");
                
                // Trigger a random command
                const queries = ["Show Tata Motors chart", "Explain capital gains tax"];
                const rnd = queries[Math.floor(Math.random() * queries.length)];
                
                executeVoiceCommand(rnd);
            }, 3000);
        });
    }

    document.querySelectorAll(".voice-sim-query-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query");
            executeVoiceCommand(query);
        });
    });

    function executeVoiceCommand(commandText) {
        alert(`Voice assistant decoded command: "${commandText}"`);
        if (commandText.includes("Tata Motors")) {
            window.location.hash = "#company-details/TATAMOTORS";
        } else {
            // Open AI persistent box
            openAIDrawer();
            postAIMessage("user", commandText);
            const resp = window.BullMindAI.getAIResponse(commandText);
            
            setTimeout(() => {
                postAIMessage("ai", resp.text);
                window.BullMindAI.speak(resp.speech);
            }, 1000);
        }
    }


    // --- LEARNING CENTER VIEW ---
    let activeCourseId = "basics";
    let activeSlideIndex = 0;
    
    function setupLearningView() {
        const grid = document.getElementById("learning-grid-container");
        if (!grid) return;

        grid.innerHTML = data.courses.map(co => {
            return `<div class="glass-card p-5 rounded-2xl border border-white/5 space-y-4 flex flex-col justify-between select-none">
                <div class="space-y-2">
                    <span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase ${
                        co.difficulty === 'Beginner' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }">${co.difficulty}</span>
                    <h3 class="font-poppins font-black text-sm text-white">${co.title}</h3>
                    <p class="text-[11px] text-gray-400">Master core components in ${co.lessons} lessons. Includes a certified module quiz.</p>
                </div>
                <button class="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs py-2 rounded-xl transition-all font-poppins start-course-btn" data-id="${co.id}">
                    Start Academy Module
                </button>
            </div>`;
        }).join("");

        lucide.createIcons();

        // Bind start course buttons
        document.querySelectorAll(".start-course-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                activeCourseId = btn.getAttribute("data-id");
                activeSlideIndex = 0;
                launchCourseSlides();
            });
        });
    }

    const courseModal = document.getElementById("course-modal");
    function launchCourseSlides() {
        const course = data.courses.find(c => c.id === activeCourseId);
        if (!course) return;

        document.getElementById("course-modal-title").textContent = course.title;
        renderSlideContent(course);
        courseModal.classList.remove("hidden");
    }

    function renderSlideContent(course) {
        const container = document.getElementById("course-slides-container");
        const ind = document.getElementById("course-page-indicator");
        
        const totalSlides = course.chapters.length + 1; // chapters + quiz slide

        if (activeSlideIndex < course.chapters.length) {
            // Render Text lesson slide
            const ch = course.chapters[activeSlideIndex];
            container.innerHTML = `
                <strong class="text-sm font-poppins text-emerald-400 block">${ch.title}</strong>
                <p class="text-gray-300 leading-relaxed text-xs mt-2">${ch.text}</p>
            `;
            document.getElementById("course-next-btn").textContent = "Next Slide";
        } else {
            // Render interactive Quiz slide
            container.innerHTML = `
                <strong class="text-sm font-poppins text-amber-400 block">🧠 Core Knowledge Quiz</strong>
                <p class="text-gray-400 text-[10px] mb-3">Answer all questions correctly to claim your certification credit.</p>
                <div class="space-y-3" id="quiz-questions-box">
                    ${course.quiz.map((qObj, qIdx) => {
                        return `<div class="space-y-1">
                            <strong class="text-white text-[11px] block">${qIdx+1}. ${qObj.q}</strong>
                            <div class="grid grid-cols-1 gap-1.5 mt-1">
                                ${qObj.a.map((opt, oIdx) => `
                                    <label class="flex items-center gap-2 p-2 rounded bg-zinc-900/60 border border-white/5 hover:border-emerald-500/20 cursor-pointer">
                                        <input type="radio" name="q-${qIdx}" value="${oIdx}" class="accent-emerald-500 font-mono">
                                        <span>${opt}</span>
                                    </label>
                                `).join("")}
                            </div>
                        </div>`;
                    }).join("")}
                </div>
            `;
            document.getElementById("course-next-btn").textContent = "Submit Exam & Certify";
        }

        ind.textContent = `${activeSlideIndex + 1} / ${totalSlides}`;
    }

    // Modal slide controls bindings
    document.getElementById("course-prev-btn").addEventListener("click", () => {
        if (activeSlideIndex > 0) {
            activeSlideIndex--;
            const course = data.courses.find(c => c.id === activeCourseId);
            renderSlideContent(course);
        }
    });

    document.getElementById("course-next-btn").addEventListener("click", () => {
        const course = data.courses.find(c => c.id === activeCourseId);
        const totalSlides = course.chapters.length + 1;

        if (activeSlideIndex < course.chapters.length) {
            activeSlideIndex++;
            renderSlideContent(course);
        } else {
            // Validate exam submission
            let passed = true;
            course.quiz.forEach((qObj, qIdx) => {
                const checked = document.querySelector(`input[name="q-${qIdx}"]:checked`);
                if (!checked || parseInt(checked.value) !== qObj.correct) {
                    passed = false;
                }
            });

            const container = document.getElementById("course-slides-container");
            if (passed) {
                container.innerHTML = `
                    <div class="text-center py-6 space-y-4">
                        <div class="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto text-3xl font-black">✔</div>
                        <div>
                            <strong class="text-lg font-poppins text-white block">Certificate of Completion Granted!</strong>
                            <p class="text-gray-400 text-xs mt-1">Excellent job. You scored 100% on the **${course.title}** module exam.</p>
                        </div>
                        <button class="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-5 py-2.5 rounded-xl transition" onclick="alert('Downloading printable certificate for: Kathan Patel')">
                            Download PDF Certificate
                        </button>
                    </div>
                `;
                document.getElementById("course-next-btn").className = "hidden";
                logAdminAction(`Completed Course Quiz: ${course.id}`);
            } else {
                alert("Fail check: You made some incorrect choices. Review lessons and try again.");
                activeSlideIndex = 0;
                renderSlideContent(course);
            }
        }
    });

    document.getElementById("close-course-modal-btn").addEventListener("click", () => {
        courseModal.classList.add("hidden");
        document.getElementById("course-next-btn").className = "bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-xs px-5 py-2 rounded-xl transition-all";
    });


    // --- INVESTOR COMMUNITY VIEW ---
    function setupCommunityView() {
        const list = document.getElementById("community-feed-list");
        if (!list) return;

        // Render Forum posts
        list.innerHTML = data.community.posts.map(p => {
            return `<div class="glass-card p-5 rounded-2xl border border-white/5 space-y-3.5 select-none">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-zinc-800 text-white font-extrabold text-xs flex items-center justify-center font-poppins border border-white/5">${p.avatar}</div>
                        <div>
                            <div class="flex items-center gap-1.5">
                                <span class="font-bold text-white text-xs">${p.author}</span>
                                <span class="bg-emerald-500/10 text-emerald-400 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase">${p.badge}</span>
                            </div>
                            <span class="text-[9px] text-gray-500 mt-0.5 block">${p.time}</span>
                        </div>
                    </div>
                    <span class="bg-white/5 text-[9px] text-gray-400 font-semibold px-2 py-0.5 rounded border border-white/5 font-mono cursor-pointer" onclick="window.location.hash='#company-details/${p.stockTag}'">$${p.stockTag}</span>
                </div>
                <p class="text-xs text-gray-300 leading-relaxed">${p.content}</p>
                <div class="flex gap-4 text-xs border-t border-white/5 pt-2 text-gray-500 font-semibold">
                    <button class="flex items-center gap-1 hover:text-white transition like-post-btn" data-id="${p.id}">
                        <i data-lucide="thumbs-up" class="w-3.5 h-3.5"></i> <span class="likes-count">${p.likes}</span>
                    </button>
                    <span class="flex items-center gap-1">
                        <i data-lucide="message-square" class="w-3.5 h-3.5"></i> ${p.comments} Comments
                    </span>
                </div>
            </div>`;
        }).join("");

        lucide.createIcons();

        // Bind Likes
        document.querySelectorAll(".like-post-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const id = btn.getAttribute("data-id");
                const nextCount = window.CommunityBoard.likePost(id);
                btn.querySelector(".likes-count").textContent = nextCount;
                btn.classList.add("text-emerald-400");
            });
        });

        // Render Poll
        setupPollWidget();
    }

    function setupPollWidget() {
        const container = document.getElementById("community-poll-box");
        if (!container) return;

        const poll = data.community.polls[0];
        const totalVotes = poll.votes.reduce((a, b) => a + b, 0);

        container.innerHTML = `
            <span class="text-[10px] text-amber-500 font-bold block uppercase tracking-wider">Active Sentiment Poll</span>
            <h4 class="font-poppins font-bold text-xs text-white leading-tight mt-1">${poll.question}</h4>
            <div class="space-y-2 pt-2">
                ${poll.options.map((opt, oIdx) => {
                    const pct = totalVotes > 0 ? ((poll.votes[oIdx] / totalVotes) * 100).toFixed(0) : 0;
                    return `<button class="w-full text-left p-3 border border-white/5 rounded-xl bg-zinc-900/60 hover:bg-zinc-800 flex justify-between items-center text-xs font-semibold group cast-vote-btn" data-idx="${oIdx}">
                        <span class="group-hover:text-emerald-400 transition-colors">${opt}</span>
                        <span class="text-gray-500 font-mono">${pct}%</span>
                    </button>`;
                }).join("")}
            </div>
            <span class="text-[9px] text-gray-500 block text-right mt-1.5">Total: ${totalVotes} votes cast</span>
        `;

        document.querySelectorAll(".cast-vote-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                const idx = parseInt(btn.getAttribute("data-idx"));
                window.CommunityBoard.votePoll(poll.id, idx);
                setupPollWidget();
            });
        });
    }

    // Publish post binders
    const submitPostBtn = document.getElementById("community-post-submit-btn");
    if (submitPostBtn) {
        submitPostBtn.addEventListener("click", () => {
            const txt = document.getElementById("community-new-post-text").value.trim();
            const tag = document.getElementById("community-new-post-tag").value.trim() || "GENERAL";
            
            if (!txt) {
                alert("Cannot post empty comment.");
                return;
            }

            window.CommunityBoard.createPost("Kathan Patel", txt, tag);
            
            document.getElementById("community-new-post-text").value = "";
            document.getElementById("community-new-post-tag").value = "";
            setupCommunityView();
            logAdminAction(`Published Community post tagged: ${tag}`);
        });
    }


    // --- MARKET NEWS VIEW ---
    function setupNewsView() {
        const container = document.getElementById("news-feed-container");
        if (!container) return;

        container.innerHTML = data.news.map(ns => {
            return `<div class="glass-card p-5 rounded-2xl border border-white/5 space-y-3.5 select-none relative overflow-hidden">
                <div class="flex justify-between items-start gap-4">
                    <div>
                        <span class="text-[9px] text-gray-500 font-bold block uppercase">${ns.source} | ${ns.time}</span>
                        <h3 class="font-poppins font-black text-sm text-white leading-snug mt-1.5">${ns.title}</h3>
                    </div>
                    <span class="text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-wider ${
                        ns.sentiment === 'Bullish' ? 'bg-emerald-500/10 text-emerald-400' : ns.sentiment === 'Negative' ? 'bg-red-500/10 text-red-400' : 'bg-zinc-800 text-gray-400'
                    }">${ns.sentiment} Sentiment</span>
                </div>
                
                <!-- Expanding AI analysis summary -->
                <details class="text-xs group border-t border-white/5 pt-3">
                    <summary class="list-none flex items-center justify-between text-amber-500 hover:text-amber-400 font-bold font-poppins cursor-pointer select-none">
                        <span><i data-lucide="brain" class="w-3.5 h-3.5 inline mr-1 text-amber-500"></i> Read AI Summary diagnostic</span>
                        <i data-lucide="chevron-down" class="w-4 h-4 group-open:rotate-180 transition-transform"></i>
                    </summary>
                    <p class="text-gray-300 mt-2 pl-4 border-l-2 border-amber-500/30 leading-relaxed italic">
                        "${ns.aiSummary}"
                    </p>
                </details>
            </div>`;
        }).join("");

        lucide.createIcons();
    }


    // --- AI SCREENER VIEW ---
    const sBtn = document.getElementById("screen-submit-btn");
    const sResetBtn = document.getElementById("screen-reset-btn");
    
    // Bind dynamic values for the sliders
    const screenerParams = ['pe-max', 'roe-min', 'div-min', 'debt-max'];
    screenerParams.forEach(p => {
        const slider = document.getElementById(`screen-${p}`);
        const valEl = document.getElementById(`val-${p}`);
        if(slider && valEl) {
            slider.addEventListener("input", () => {
                valEl.textContent = slider.value;
            });
        }
    });

    // Preset buttons
    const presetBtns = document.querySelectorAll(".screener-preset-btn");
    presetBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const mode = btn.dataset.preset;
            
            const setVal = (id, val) => {
                const el = document.getElementById(`screen-${id}`);
                const vEl = document.getElementById(`val-${id}`);
                if(el) el.value = val;
                if(vEl) vEl.textContent = val;
            }
            
            if(mode === 'dividend') {
                setVal('pe-max', 20); setVal('roe-min', 12); setVal('div-min', 4.5); setVal('debt-max', 1.5);
                document.getElementById("screen-sector").value = "ALL";
            } else if (mode === 'growth') {
                setVal('pe-max', 15); setVal('roe-min', 20); setVal('div-min', 0); setVal('debt-max', 1.0);
                document.getElementById("screen-sector").value = "ALL";
            } else if (mode === 'debtfree') {
                setVal('pe-max', 35); setVal('roe-min', 15); setVal('div-min', 0); setVal('debt-max', 0.1);
                document.getElementById("screen-sector").value = "ALL";
            } else if (mode === 'aipicks') {
                setVal('pe-max', 50); setVal('roe-min', 18); setVal('div-min', 0); setVal('debt-max', 2.0);
                document.getElementById("screen-sector").value = "IT";
            }
            runScreenerEvaluation();
        });
    });

    if (sBtn) {
        sBtn.addEventListener("click", runScreenerEvaluation);
    }
    
    if (sResetBtn) {
        sResetBtn.addEventListener("click", () => {
            const setVal = (id, val) => {
                const el = document.getElementById(`screen-${id}`);
                const vEl = document.getElementById(`val-${id}`);
                if(el) el.value = val;
                if(vEl) vEl.textContent = val;
            }
            setVal('pe-max', 50); setVal('roe-min', 10); setVal('div-min', 0); setVal('debt-max', 2.0);
            document.getElementById("screen-sector").value = "ALL";
            runScreenerEvaluation();
        });
    }

    function setupScreenerView() {
        runScreenerEvaluation();
    }

    function getAiRating(stock) {
        // mock logic for AI rating
        let score = 0;
        if(stock.pe < 20) score += 2;
        if(stock.roe > 15) score += 2;
        if(stock.changePercent > 1) score += 1;
        
        if (score >= 4) return {label: "Strong Buy", color: "text-emerald-400 bg-emerald-500/20"};
        if (score >= 2) return {label: "Hold", color: "text-blue-400 bg-blue-500/20"};
        return {label: "Sell", color: "text-red-400 bg-red-500/20"};
    }

    function runScreenerEvaluation() {
        const tbody = document.getElementById("screener-tbody-results");
        const countBadge = document.getElementById("screener-count-badge");
        if (!tbody) return;

        const maxPe = parseFloat(document.getElementById("screen-pe-max")?.value || 50);
        const minRoe = parseFloat(document.getElementById("screen-roe-min")?.value || 0);
        const minDiv = parseFloat(document.getElementById("screen-div-min")?.value || 0);
        const maxDebt = parseFloat(document.getElementById("screen-debt-max")?.value || 3);
        const sector = document.getElementById("screen-sector")?.value || "ALL";

        // Enrich database if properties are missing (mock simulation)
        if(data.allStocksList && data.allStocksList.length > 0) {
            data.allStocksList.forEach(st => {
                if(st.divYield === undefined) st.divYield = (Math.random() * 6).toFixed(1);
                if(st.debtToEq === undefined) st.debtToEq = (Math.random() * 2.5).toFixed(2);
            });
        }

        // Perform mock scanning filters
        const matches = data.allStocksList.filter(st => {
            const peMatch = st.pe <= maxPe;
            const roeMatch = st.roe >= minRoe;
            const divMatch = parseFloat(st.divYield || 0) >= minDiv;
            const debtMatch = parseFloat(st.debtToEq || 0) <= maxDebt;
            const sectorMatch = sector === "ALL" || st.sector === sector;
            
            return peMatch && roeMatch && divMatch && debtMatch && sectorMatch;
        });
        
        if(countBadge) {
            countBadge.textContent = `${matches.length} Matches`;
        }

        if (matches.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="py-10 text-center text-gray-500">No listed entities matched your parameters. Raise PE or lower ROE constraints.</td></tr>`;
            return;
        }

        tbody.innerHTML = matches.map(st => {
            const ai = getAiRating(st);
            return `<tr class="group hover:bg-white/5 transition-colors cursor-pointer" onclick="window.openStockDetail('${st.symbol}')">
                <td class="p-3 rounded-tl-lg rounded-bl-lg">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center font-bold text-xs text-white">
                            ${st.symbol.substring(0,2)}
                        </div>
                        <div>
                            <div class="font-bold text-white text-xs">${st.symbol}</div>
                            <div class="text-[10px] text-gray-500 truncate w-24 sm:w-32">${st.name}</div>
                        </div>
                    </div>
                </td>
                <td class="p-3 text-right font-mono text-white text-xs">₹${st.price.toFixed(2)}</td>
                <td class="p-3 text-right text-gray-300 text-xs">${st.pe}</td>
                <td class="p-3 text-right text-emerald-400 font-medium text-xs">${st.roe}%</td>
                <td class="p-3 text-right text-blue-400 font-medium text-xs hidden sm:table-cell">${st.divYield}%</td>
                <td class="p-3 text-center">
                    <span class="px-2 py-1 rounded text-[9px] font-bold uppercase ${ai.color}">${ai.label}</span>
                </td>
                <td class="p-3 text-right rounded-tr-lg rounded-br-lg">
                    <button class="bg-white/5 hover:bg-emerald-500/20 text-emerald-400 border border-white/5 hover:border-emerald-500/50 transition-all p-1.5 rounded-lg" onclick="event.stopPropagation(); window.openInvestModal('${st.symbol}','${st.name}',${st.price})">
                        <i data-lucide="plus" class="w-4 h-4"></i>
                    </button>
                </td>
            </tr>`;
        }).join("");
    }


    let activeWatchlistFilter = "all";

    // --- WATCHLIST VIEW ---
    function setupWatchlistView() {
        const grid = document.getElementById("watchlist-grid-list");
        const countSpan = document.getElementById("watchlist-count");
        if (!grid) return;

        const watchlist = data.userState.watchlist;
        if (countSpan) countSpan.textContent = watchlist.length;

        if (watchlist.length === 0) {
            grid.innerHTML = `<div class="col-span-full py-10 text-center text-gray-500">Watchlist is empty. Use Quick Add or search for stocks to track them.</div>`;
            return;
        }

        // Apply active filter
        let filteredList = watchlist;
        if (activeWatchlistFilter === "gainers") {
            filteredList = watchlist.filter(sym => {
                const st = data.allStocksList.find(s => s.symbol === sym) || { changePercent: 0 };
                return st.changePercent >= 0;
            });
        } else if (activeWatchlistFilter === "losers") {
            filteredList = watchlist.filter(sym => {
                const st = data.allStocksList.find(s => s.symbol === sym) || { changePercent: 0 };
                return st.changePercent < 0;
            });
        }

        // Set active class on filter buttons based on state
        document.querySelectorAll(".wl-filter-btn").forEach(btn => {
            const f = btn.getAttribute("data-filter");
            if (f === activeWatchlistFilter) {
                btn.className = "wl-filter-btn px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.05)]";
            } else {
                btn.className = "wl-filter-btn px-3 py-1.5 rounded-xl text-[10px] font-bold tracking-wider transition-all border border-white/5 bg-white/3 text-gray-400 hover:text-white";
            }
        });

        // Bind filter buttons (once via delegation)
        if (!window.wlFiltersBound) {
            document.addEventListener("click", e => {
                const btn = e.target.closest(".wl-filter-btn");
                if (btn) {
                    activeWatchlistFilter = btn.getAttribute("data-filter");
                    setupWatchlistView();
                }
            });
            window.wlFiltersBound = true;
        }

        if (filteredList.length === 0) {
            grid.innerHTML = `<div class="col-span-full py-12 text-center text-gray-500 font-medium">No tracked stocks match the "${activeWatchlistFilter.toUpperCase()}" filter today.</div>`;
            return;
        }

        grid.innerHTML = filteredList.map(sym => {
            const st = data.allStocksList.find(s => s.symbol === sym) || { symbol: sym, price: 900, changePercent: 0, sector: 'Indian Equity' };
            const isPos = st.changePercent >= 0;
            // Generate a fake sparkline based on changePercent
            const points = [];
            let current = isPos ? 20 : 10;
            for(let i=0; i<=100; i+=20) {
                points.push(`${i},${current}`);
                current += (Math.random() * 10 - (isPos ? 6 : 4));
                current = Math.max(2, Math.min(28, current));
            }
            const ptsStr = points.join(" ");

            return `<div class="bg-black/40 border border-white/5 rounded-xl p-4 flex flex-col justify-between hover:border-white/20 transition group cursor-pointer relative overflow-hidden" onclick="window.location.hash='#company-details/${sym}'">
                <div class="absolute inset-0 bg-gradient-to-tr ${isPos ? 'from-emerald-500/5' : 'from-red-500/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <button class="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition p-1.5 z-10 delete-watch-btn bg-black/60 rounded-md backdrop-blur-sm" data-symbol="${sym}" onclick="event.stopPropagation();">
                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                </button>
                <div class="flex justify-between items-start mb-5 relative z-10">
                    <div>
                        <strong class="text-white text-base block font-poppins">${sym}</strong>
                        <span class="text-[9px] text-gray-500 uppercase tracking-wider">${st.sector || 'Equity'}</span>
                    </div>
                    <div class="text-right">
                        <strong class="text-white font-mono text-sm block">₹${st.price.toFixed(2)}</strong>
                        <span class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${isPos ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}">${isPos ? '+' : ''}${st.changePercent.toFixed(2)}%</span>
                    </div>
                </div>
                <div class="w-full h-8 bg-black/50 rounded overflow-hidden relative z-10">
                    <div class="absolute top-1/2 left-0 w-full h-px bg-white/5 border-dashed border-b border-white/5"></div>
                    <svg viewBox="0 0 100 30" class="w-full h-full" preserveAspectRatio="none">
                        <polyline fill="none" stroke="${isPos ? '#10b981' : '#ef4444'}" stroke-width="1.5" points="${ptsStr}" class="opacity-80 drop-shadow-md" />
                    </svg>
                </div>
            </div>`;
        }).join("");

        lucide.createIcons();

        // Bind delete watchlist
        document.querySelectorAll(".delete-watch-btn").forEach(btn => {
            btn.addEventListener("click", async () => {
                const sym = btn.getAttribute("data-symbol");
                await toggleWatchlist(sym);
                setupWatchlistView();
            });
        });

        // Setup alert boxes list
        const alertsContainer = document.getElementById("watchlist-alerts-container");
        if (alertsContainer) {
            alertsContainer.innerHTML = data.userState.alerts.map(al => {
                const isUp = al.direction.toLowerCase() === 'above';
                return `<div class="min-w-[200px] p-3 border border-white/5 rounded-xl bg-black/40 space-y-1.5 select-none relative group hover:border-white/20 transition">
                    <div class="absolute inset-0 bg-gradient-to-br ${isUp ? 'from-emerald-500/5' : 'from-red-500/5'} to-transparent rounded-xl pointer-events-none"></div>
                    <button class="absolute top-2 right-2 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition delete-alert-btn z-10" data-id="${al.id}"><i data-lucide="x" class="w-3.5 h-3.5"></i></button>
                    <div class="relative z-10 flex items-center justify-between">
                        <strong class="text-white text-xs font-poppins">${al.symbol}</strong>
                        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded ${isUp ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'} uppercase">${al.direction}</span>
                    </div>
                    <div class="relative z-10 flex items-end justify-between">
                        <span class="text-[10px] text-gray-400">Target</span>
                        <span class="text-xs text-white font-mono font-bold">₹${al.threshold}</span>
                    </div>
                </div>`;
            }).join("");

            lucide.createIcons();

            document.querySelectorAll(".delete-alert-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const id = parseInt(btn.getAttribute("data-id"));
                    data.userState.alerts = data.userState.alerts.filter(al => al.id !== id);
                    setupWatchlistView();
                });
            });
        }
    }

    function toggleWatchlist(symbol) {
        const watch = data.userState.watchlist;
        const idx = watch.indexOf(symbol);
        if (idx >= 0) {
            watch.splice(idx, 1);
            logAdminAction(`Removed ${symbol} from user Watchlist.`);
        } else {
            watch.push(symbol);
            logAdminAction(`Added ${symbol} to user Watchlist.`);
            // Quick Add Logic
        const quickAddBtn = document.getElementById("btn-quick-add");
        const quickAddInput = document.getElementById("watchlist-quick-add");
        if (quickAddBtn && quickAddInput) {
            // Remove previous listeners by cloning (simple robust way if we re-render)
            const newBtn = quickAddBtn.cloneNode(true);
            quickAddBtn.parentNode.replaceChild(newBtn, quickAddBtn);
            
            newBtn.addEventListener("click", async () => {
                let sym = quickAddInput.value.trim().toUpperCase();
                if (!sym) return;
                
                // Check if symbol is somewhat valid (loose check)
                const exists = data.allStocksList.find(s => s.symbol.toUpperCase() === sym);
                if (!exists) {
                    if (window.showToast) window.showToast(`Symbol ${sym} not found in exchange database.`, 'error');
                    else alert(`Symbol ${sym} not found.`);
                    return;
                }

                if (!data.userState.watchlist.includes(sym)) {
                    await toggleWatchlist(sym);
                    setupWatchlistView();
                    quickAddInput.value = "";
                    if (window.showToast) window.showToast(`${sym} added to Watchlist!`, 'success');
                } else {
                    if (window.showToast) window.showToast(`${sym} is already in Watchlist.`, 'error');
                    quickAddInput.value = "";
                }
            });
            
            // Add on enter key
            quickAddInput.addEventListener("keypress", (e) => {
                if (e.key === "Enter") {
                    newBtn.click();
                }
            });
        }
    }
    }


    // --- ADMIN DASHBOARD VIEW ---
    function setupAdminView() {
        const logBox = document.getElementById("admin-system-logs");
        if (!logBox) return;

        logBox.innerHTML = adminLogs.map(l => {
            const time = new Date().toLocaleTimeString();
            return `<div>[${time}] ${l}</div>`;
        }).join("");
        
        // Auto scroll to bottom
        logBox.scrollTop = logBox.scrollHeight;
    }

    function logAdminAction(actionText) {
        adminLogs.push(actionText);
        // prune if too long
        if (adminLogs.length > 50) adminLogs.shift();
        
        // Live updates if active view is admin
        if (currentActiveView === "admin") setupAdminView();
    }

    // Submit adding stock profile form
    const adminAddBtn = document.getElementById("admin-add-submit-btn");
    if (adminAddBtn) {
        adminAddBtn.addEventListener("click", () => {
            const sym = document.getElementById("admin-add-symbol").value.toUpperCase().trim();
            const name = document.getElementById("admin-add-name").value.trim();
            const price = parseFloat(document.getElementById("admin-add-price").value);
            const sector = document.getElementById("admin-add-sector").value;
            
            if (!sym || !name || isNaN(price)) {
                alert("Please fill all properties.");
                return;
            }

            // Register into simple stocks list
            const exists = data.allStocksList.some(st => st.symbol === sym);
            if (exists) {
                alert("Error: Stock is already registered on exchange.");
                return;
            }

            const newStock = {
                symbol: sym,
                name: name,
                price: price,
                changePercent: 0.00,
                pe: 18.5,
                roe: 16.5,
                cap: "Mid",
                sector: sector
            };

            data.allStocksList.push(newStock);
            
            // Build detailed placeholder dictionary item
            data.stocks[sym] = {
                symbol: sym,
                name: name,
                logo: "https://companieslogo.com/img/orig/TATAMOTORS.NS_BIG-7707c57c.png?t=1596841261",
                industry: "Industrial Manufacturing",
                sector: sector,
                ceo: "Internal Board",
                price: price,
                prevClose: price,
                change: 0.0,
                changePercent: 0.0,
                volume: 500000,
                marketCap: "5,000 Cr",
                faceValue: 10,
                bookValue: 100.0,
                peRatio: 18.5,
                pbRatio: 2.5,
                roe: 15.0,
                roce: 14.5,
                eps: 5.0,
                dividendYield: 1.0,
                debtToEquity: 0.1,
                freeCashFlow: "50 Cr",
                holdings: { promoter: 51.0, fii: 10.0, dii: 15.0, retail: 24.0 },
                quarterlyResults: [ { quarter: "Q4 FY26", sales: 120, netProfit: 15 } ],
                balanceSheet: { liabilities: [ { item: "Capital", value: 50 } ], assets: [ { item: "Fixed Assets", value: 50 } ] },
                profitAndLoss: [ { year: "FY26", revenue: 450, profit: 50 } ],
                cashFlow: { operating: 50, investing: -30, financing: -10, netChange: 10 },
                corporateActions: { dividends: [], bonus: [], splits: [] },
                news: [ { date: "Today", title: "IPO details listed successfully", sentiment: "Neutral" } ],
                peers: [],
                aiScore: {
                    targetPrice: `₹${Math.round(price * 1.15)}`,
                    riskScore: "Medium (3.0/5)",
                    investmentScore: "75/100 (Neutral/Buy)",
                    esgScore: "68/100",
                    dna: { growth: 70, valuation: 70, profitability: 70, stability: 70, risk: 50, governance: 75 },
                    analysis: `${name} is newly added via platform administration. Financial fundamentals are estimated as balanced.`
                }
            };

            // Clear inputs
            document.getElementById("admin-add-symbol").value = "";
            document.getElementById("admin-add-name").value = "";
            document.getElementById("admin-add-price").value = "";
            
            alert(`Stock ${sym} published successfully to BullVerse Exchange!`);
            logAdminAction(`Exchange registry added: $${sym} (${name})`);
        });
    }


    // --- NOTIFICATION UTILITIES ---
    function triggerPriceAlert(alertObj, currentVal) {
        const parent = document.getElementById("noti-list");
        if (!parent) return;

        // Verify it isn't duplicate trigger
        if (alertObj.triggered) return;
        alertObj.triggered = true;

        const notiBadge = document.getElementById("noti-badge");
        notiBadge.classList.remove("hidden"); // highlight red dot

        const html = `<div class="p-2.5 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-1 select-none animate-bounce">
            <div class="flex justify-between font-bold text-white">
                <span>🔔 Price Alert: ${alertObj.symbol}</span>
                <span class="text-amber-500">₹${currentVal.toFixed(2)}</span>
            </div>
            <p class="text-[10px] text-gray-300 leading-relaxed">${alertObj.msg}</p>
            <span class="text-[9px] text-gray-500 font-poppins block italic">${alertObj.explanation}</span>
        </div>`;

        parent.insertAdjacentHTML("afterbegin", html);
        
        // Push simple admin log
        logAdminAction(`Price Alert triggered: ${alertObj.symbol} crossed threshold value.`);
    }

    // Pre-populate notifications tray with premium startup alerts
    const initialAlerts = [
        {
            symbol: "TATAMOTORS",
            msg: "BullMind AI Alert: TATAMOTORS crossed threshold above ₹980. Trend: Bullish",
            explanation: "Triggered on target breakout. Expected near-term resistance at ₹1,010."
        },
        {
            symbol: "NIFTY",
            msg: "NIFTY 50 target reached: Index touched 23,900 resistance band.",
            explanation: "Short-term momentum is overbought. Consider trailing stop losses."
        },
        {
            symbol: "BTC",
            msg: "Crypto Volatility Trigger: Bitcoin spiked +1.85% in past 15 minutes.",
            explanation: "Volume momentum is strong. Trend indicator shows high momentum."
        }
    ];

    const notiList = document.getElementById("noti-list");
    const notiBadge = document.getElementById("noti-badge");
    
    if (notiList && initialAlerts.length > 0) {
        notiList.innerHTML = initialAlerts.map(alertObj => `
            <div class="p-2.5 rounded-lg bg-white/3 border border-white/5 space-y-1 hover:bg-white/5 transition-all text-[11px]">
                <div class="flex items-center justify-between font-poppins">
                    <span class="font-bold text-white uppercase">${alertObj.symbol} alert</span>
                    <span class="text-[8px] text-emerald-400 font-bold uppercase tracking-wider">active alert</span>
                </div>
                <p class="text-[10px] text-gray-300 leading-relaxed">${alertObj.msg}</p>
                <span class="text-[9px] text-gray-500 font-poppins block italic">${alertObj.explanation}</span>
            </div>
        `).join("");
        if (notiBadge) notiBadge.classList.remove("hidden"); // show red notification dot
    }

    // Bind notification dropdown box
    const notiBtn = document.getElementById("noti-dropdown-btn");
    const notiBox = document.getElementById("noti-dropdown-box");
    if (notiBtn) {
        notiBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (profileBox) profileBox.classList.add("hidden"); // Close profile dropdown
            notiBox.classList.toggle("hidden");
            if (notiBadge) notiBadge.classList.add("hidden"); // clear dot
        });
    }

    // Bind User Profile dropdown box
    const profileBtn = document.getElementById("profile-dropdown-btn");
    const profileBox = document.getElementById("profile-dropdown-box");
    if (profileBtn) {
        profileBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            if (notiBox) notiBox.classList.add("hidden"); // Close notification dropdown
            profileBox.classList.toggle("hidden");
        });
    }

    // Bind Sign Out / Log Out button inside dropdown & on profile page
    const profileSignoutBtn = document.getElementById("profile-signout-btn");
    const profilePageSignoutBtn = document.getElementById("profile-page-signout-btn");
    
    const handleSignout = (e) => {
        if (e) e.stopPropagation();
        if (profileBox) profileBox.classList.add("hidden");
        logoutUser();
        if (window.showToast) window.showToast("Signed out successfully. Your SQLite session token has been cleared.", "success");
        else alert("Signed out successfully. Your SQLite session token has been cleared.");
    };

    if (profileSignoutBtn) {
        profileSignoutBtn.addEventListener("click", handleSignout);
    }
    if (profilePageSignoutBtn) {
        profilePageSignoutBtn.addEventListener("click", handleSignout);
    }

    // Dismiss click outside dropdowns
    document.addEventListener("click", () => {
        if (notiBox) notiBox.classList.add("hidden");
        if (profileBox) profileBox.classList.add("hidden");
    });

    const notiClearBtn = document.getElementById("noti-clear-btn");
    if (notiClearBtn) {
        notiClearBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            document.getElementById("noti-list").innerHTML = `<div class="text-center text-gray-500 text-[10px] py-4">No active notifications logs.</div>`;
        });
    }


    // =========================================================================
    // 5. CMD + K QUICK SEARCH SYSTEM
    // =========================================================================
    const searchTrigger = document.getElementById("quick-search-trigger");
    const searchModal = document.getElementById("search-modal");
    const searchModalInput = document.getElementById("search-modal-input");
    const searchSuggestionsList = document.getElementById("search-suggestions-list");

    searchTrigger.addEventListener("click", openSearchModal);
    
    // Bind global key listeners
    document.addEventListener("keydown", (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === "k") {
            e.preventDefault();
            openSearchModal();
        }
        if (e.key === "Escape") {
            closeSearchModal();
        }
    });

    function openSearchModal() {
        searchModal.classList.remove("hidden");
        searchModalInput.value = "";
        searchSuggestionsList.innerHTML = `<div class="text-gray-500 py-3 text-center">Type stock code, page, or sector tag...</div>`;
        searchModalInput.focus();
    }

    function closeSearchModal() {
        searchModal.classList.add("hidden");
    }

    document.getElementById("close-search-modal-btn").addEventListener("click", closeSearchModal);

    searchModalInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase().trim();
        if (!val) {
            searchSuggestionsList.innerHTML = ``;
            return;
        }

        const suggestions = [];

        // 1. Search stocks list
        data.allStocksList.forEach(st => {
            if (st.symbol.toLowerCase().includes(val) || st.name.toLowerCase().includes(val)) {
                suggestions.push({
                    title: `$${st.symbol} - ${st.name}`,
                    subtitle: `Indian Listed Stock | Price: ₹${st.price} | PE: ${st.pe}`,
                    route: `#company-details/${st.symbol}`
                });
            }
        });

        // 2. Search cryptocurrency list
        if (data.cryptos) {
            data.cryptos.forEach(cry => {
                if (cry.symbol.toLowerCase().includes(val) || cry.name.toLowerCase().includes(val)) {
                    suggestions.push({
                        title: `🪙 ${cry.symbol} - ${cry.name}`,
                        subtitle: `Cryptocurrency Coin | Price: $${cry.priceUSD.toLocaleString()} | Category: ${cry.category}`,
                        route: `#crypto`,
                        cryptoSymbol: cry.symbol
                    });
                }
            });
        }

        // 3. Search application sections routes
        const routes = [
            { name: "Home Dashboard", keyword: "home dashboard index screen", target: "#home" },
            { name: "Indian Markets Center", keyword: "markets indices commodities SENSEX NIFTY", target: "#markets" },
            { name: "Listed Stocks Catalog", keyword: "stocks list exchange", target: "#stocks" },
            { name: "Demat Portfolio Assets", keyword: "portfolio shares value goals transactions", target: "#portfolio" },
            { name: "IPO Center Hub", keyword: "ipo grey market gmp allotment subscription", target: "#ipo" },
            { name: "Mutual Funds Calculator", keyword: "mutual funds sip swp nav direct", target: "#mutual-funds" },
            { name: "Exchange Traded Funds", keyword: "etf goldbees bankbees niftybees", target: "#etfs" },
            { name: "BullMind AI Assistant", keyword: "ai assistant backtest strategy wealth coach voice", target: "#ai-assistant" },
            { name: "Screener Scanner Panel", keyword: "screener stock scanner filters pe roe roce", target: "#screeners" },
            { name: "Learning Academy Quiz", keyword: "learning lessons course basics options candlesticks", target: "#learning" },
            { name: "Crypto Trading & Staking Center", keyword: "crypto center savings staking bitcoin ethereum futures perpetual leverage earn apy coins altcoins binance", target: "#crypto" }
        ];

        routes.forEach(r => {
            if (r.name.toLowerCase().includes(val) || r.keyword.toLowerCase().includes(val)) {
                suggestions.push({
                    title: r.name,
                    subtitle: `Application View Shortcut`,
                    route: r.target
                });
            }
        });

        if (suggestions.length === 0) {
            searchSuggestionsList.innerHTML = `<div class="text-gray-500 py-3 text-center">No matches found. Try "tata", "btc", or "screener"</div>`;
            return;
        }

        searchSuggestionsList.innerHTML = suggestions.slice(0, 7).map(s => {
            const clickAction = s.cryptoSymbol 
                ? `window.location.hash='${s.route}'; setTimeout(() => { if (typeof window.filterCryptoBySymbol === 'function') { window.filterCryptoBySymbol('${s.cryptoSymbol}'); } }, 150);`
                : `window.location.hash='${s.route}';`;
            return `<div class="p-3 border-b border-white/2 hover:bg-emerald-500/10 cursor-pointer rounded transition flex flex-col justify-between" onclick="${clickAction} document.getElementById('search-modal').classList.add('hidden');">
                <span class="font-bold text-white text-xs">${s.title}</span>
                <span class="text-[10px] text-gray-400 mt-0.5">${s.subtitle}</span>
            </div>`;
        }).join("");
    });


    // =========================================================================
    // 6. PERSISTENT FLOATING CHAT DRAWER CONTROLS
    // =========================================================================
    const chatBubble = document.getElementById("ai-chat-bubble-trigger");
    const chatDrawer = document.getElementById("ai-chat-drawer");
    const closeChatBtn = document.getElementById("close-chat-drawer");

    chatBubble.addEventListener("click", openAIDrawer);
    closeChatBtn.addEventListener("click", closeAIDrawer);

    function openAIDrawer() {
        chatDrawer.classList.remove("translate-y-[520px]");
        chatBubble.classList.add("hidden");
        
        // Initial bot greeting if list is empty
        const list = document.getElementById("chat-history-pane");
        if (list.children.length === 0) {
            postAIMessage("ai", `🧠 **Welcome to BullMind AI!**\n\nI am your live intelligent advisor. Click one of the shortcuts below or type a custom question. (e.g. "Analyze Tata Motors" or "Review my portfolio")`);
        }
    }

    function closeAIDrawer() {
        chatDrawer.classList.add("translate-y-[520px]");
        chatBubble.classList.remove("hidden");
    }

    // Post messaging utility — proper markdown rendering
    function postAIMessage(role, markdownText) {
        const history = document.getElementById("chat-history-pane");
        if (!history) return;

        const isUser = role === "user";
        let html = '';

        if (isUser) {
            html = '<div class="flex gap-2.5 justify-end"><div class="p-3 rounded-2xl max-w-[85%] text-xs leading-relaxed bg-emerald-500 text-black font-semibold rounded-tr-none">' +
                markdownText.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div></div>';
        } else {
            // Parse markdown for AI responses
            const lines = markdownText.split('\n');
            let output = '';
            let inTable = false;
            let tableRows = [];

            function flushTable() {
                if (tableRows.length > 1) {
                    output += '<table class="w-full border-collapse text-[10px] my-2 bg-black/20 rounded overflow-hidden">';
                    tableRows.forEach((row, idx) => {
                        if (row.replace(/[|\-:\s]/g, '') === '') return; // separator row
                        const cols = row.split('|').map(c => c.trim()).filter(c => c !== '');
                        const tag = idx === 0 ? 'th' : 'td';
                        const cls = idx === 0 ? 'bg-white/5 text-gray-300 font-bold' : 'text-gray-200';
                        output += '<tr>' + cols.map(c => {
                            // Bold in table cells
                            c = c.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                            return '<' + tag + ' class="border border-white/10 px-1.5 py-1 ' + cls + '">' + c + '</' + tag + '>';
                        }).join('') + '</tr>';
                    });
                    output += '</table>';
                }
                tableRows = [];
                inTable = false;
            }

            lines.forEach(line => {
                // Table rows
                if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
                    inTable = true;
                    tableRows.push(line.trim());
                    return;
                } else if (inTable) {
                    flushTable();
                }

                // Headings
                if (line.startsWith('### ')) {
                    output += '<div class="font-poppins font-bold text-sm text-white mt-2 mb-1">' + line.substring(4) + '</div>';
                    return;
                }
                if (line.startsWith('## ')) {
                    output += '<div class="font-poppins font-bold text-base text-white mt-2 mb-1">' + line.substring(3) + '</div>';
                    return;
                }

                // Blockquotes
                if (line.startsWith('> ')) {
                    output += '<div class="border-l-2 border-amber-500/50 pl-2 text-gray-300 italic my-1">' + line.substring(2) + '</div>';
                    return;
                }

                // List items
                if (line.startsWith('- ')) {
                    let content = line.substring(2);
                    content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
                    content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
                    output += '<div class="flex gap-1.5 ml-1 my-0.5"><span class="text-emerald-400 flex-shrink-0">•</span><span>' + content + '</span></div>';
                    return;
                }

                // Empty line
                if (line.trim() === '') {
                    output += '<div class="h-1.5"></div>';
                    return;
                }

                // Regular text with inline formatting
                let text = line;
                text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>');
                text = text.replace(/\*(.*?)\*/g, '<em class="text-amber-300/80">$1</em>');
                output += '<div class="my-0.5">' + text + '</div>';
            });

            // Flush any remaining table
            if (inTable) flushTable();

            html = '<div class="flex gap-2.5 justify-start">' +
                '<div class="w-5 h-5 rounded-md bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5"><span class="text-[8px] font-black text-black">AI</span></div>' +
                '<div class="p-3 rounded-2xl max-w-[90%] text-xs leading-relaxed bg-white/5 border border-white/5 text-gray-100 rounded-tl-none">' +
                output + '</div></div>';
        }

        history.insertAdjacentHTML("beforeend", html);
        
        // Auto scroll to bottom
        history.scrollTop = history.scrollHeight;
    }

    // Submit messages triggers
    const sendBtn = document.getElementById("chat-send-btn");
    const inputField = document.getElementById("chat-text-input");
    
    if (sendBtn) {
        sendBtn.addEventListener("click", processChatSubmit);
    }
    if (inputField) {
        inputField.addEventListener("keydown", (e) => {
            if (e.key === "Enter") processChatSubmit();
        });
    }

    function processChatSubmit() {
        const query = inputField.value.trim();
        if (!query) return;

        postAIMessage("user", query);
        inputField.value = "";

        // Trigger typing indicators
        setTimeout(() => {
            const response = window.BullMindAI.getAIResponse(query);
            postAIMessage("ai", response.text);
            
            // Speak voice synthesis if checked
            const doSpeak = document.getElementById("settings-notif-check") ? document.getElementById("settings-notif-check").checked : true;
            if (doSpeak) {
                window.BullMindAI.speak(response.speech);
            }
        }, 800);
    }

    // Shortcuts binding
    document.querySelectorAll(".chat-shortcut-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const query = btn.getAttribute("data-query");
            postAIMessage("user", query);
            
            setTimeout(() => {
                const response = window.BullMindAI.getAIResponse(query);
                postAIMessage("ai", response.text);
            }, 800);
        });
    });

    // Voice simulation inside chat drawer
    const voiceBtn = document.getElementById("chat-voice-btn");
    if (voiceBtn) {
        voiceBtn.addEventListener("click", () => {
            voiceBtn.classList.add("text-amber-400");
            setTimeout(() => {
                voiceBtn.classList.remove("text-amber-400");
                const list = ["Show Tata Motors chart", "Explain capital gains tax"];
                const rnd = list[Math.floor(Math.random() * list.length)];
                inputField.value = rnd;
                processChatSubmit();
            }, 2000);
        });
    }


    // --- SIDEBAR TOGGLE ---
    const toggleSidebarBtn = document.getElementById("toggle-sidebar");
    const sidebar = document.getElementById("app-sidebar");
    
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener("click", () => {
            sidebar.classList.toggle("w-64");
            sidebar.classList.toggle("w-20");
            
            const isCollapsed = sidebar.classList.contains("w-20");
            
            // Toggle icons directions
            toggleSidebarBtn.innerHTML = isCollapsed ? `<i data-lucide="chevron-right" class="w-4 h-4"></i>` : `<i data-lucide="chevron-left" class="w-4 h-4"></i>`;
            
            // Hide nav labels text
            document.querySelectorAll(".sidebar-text").forEach(el => {
                if (isCollapsed) el.classList.add("hidden");
                else el.classList.remove("hidden");
            });

            lucide.createIcons();
        });
    }

    // Settings Pro Toggle
    const premBtn = document.getElementById("settings-premium-toggle");
    if (premBtn) {
        premBtn.addEventListener("click", () => {
            data.userState.settings.isPremium = !data.userState.settings.isPremium;
            const state = data.userState.settings.isPremium;
            
            alert(`Premium Account ${state ? 'ENABLED' : 'DISABLED'}. You now have access to advanced backtesters.`);
            
            premBtn.textContent = state ? "Downgrade Pro Account" : "Toggle Pro Account";
            
            logAdminAction(`Premium Status toggled: ${state}`);
        });
    }

    // Upgrade btn sidebar
    const upgradeSidebar = document.getElementById("upgrade-btn-sidebar");
    if (upgradeSidebar) {
        upgradeSidebar.addEventListener("click", () => {
            window.location.hash = "#settings";
            alert("Redirected to subscription configurations inside Settings view.");
        });
    }

    // =========================================================================
    // 7. FULL-STACK API WORKSPACE & CRYPTO MANAGEMENT
    // =========================================================================

    // Setup connection to backend
    async function checkBackendConnection() {
        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: "ping", password: "ping" })
            });
            // Even a 400 means server is online and listening
            isOfflineSandbox = false;
            console.log("Full-stack API SQLite Gateway active.");
            logAdminAction("Express backend SQLite database connection established.");
        } catch (e) {
            isOfflineSandbox = true;
            console.warn("Express server offline. Falling back to local frontend sandbox.");
            logAdminAction("Server offline: running in offline sandbox environment.");
        }
        setupAuthenticationState();
    }

    // Toggles Login overlays lockscreen
    async function setupAuthenticationState() {
        const overlay = document.getElementById("auth-overlay");
        const authPassed = sessionStorage.getItem("auth_passed") === "true";

        if (!authPassed && !userToken) {
            if (overlay) overlay.classList.remove("hidden");
            updateProfileWidget();
            return;
        }

        if (overlay) overlay.classList.add("hidden");

        if (!isOfflineSandbox && userToken) {
            await syncPortfolioWithBackend();
        }

        const cwb = document.getElementById("crypto-wallet-balance");
        if (cwb) cwb.textContent = "₹" + Math.round(data.userState.portfolio.cash).toLocaleString();
        updateProfileWidget();
    }

    function updateProfileWidget() {
        const storedEmail = localStorage.getItem("bv_email") || userEmail || "guest@bullverse.in";
        const isGuest = isOfflineSandbox || !storedEmail || storedEmail === "guest@bullverse.in" || !userToken;
        
        const avatarInitials = document.getElementById("profile-avatar-initials");
        const displayName = document.getElementById("profile-display-name");
        const dropdownEmail = document.getElementById("profile-dropdown-email");
        const displayRole = document.getElementById("profile-display-role");

        if (avatarInitials && displayName && dropdownEmail && displayRole) {
            if (isGuest) {
                avatarInitials.textContent = "GS";
                avatarInitials.className = "w-8 h-8 rounded-full bg-gradient-to-br from-gray-500 to-zinc-600 text-white font-extrabold text-xs flex items-center justify-center font-poppins shadow-md";
                displayName.textContent = "Guest Mode";
                displayRole.textContent = "Sandbox Access";
                dropdownEmail.textContent = "guest@bullverse.in";
            } else {
                const prefix = storedEmail.split("@")[0].toUpperCase();
                const initials = prefix.substring(0, 2);
                avatarInitials.textContent = initials;
                avatarInitials.className = "w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 text-black font-extrabold text-xs flex items-center justify-center font-poppins shadow-md shadow-emerald-500/10";
                displayName.textContent = storedEmail.split("@")[0];
                displayRole.textContent = "Verified Investor";
                dropdownEmail.textContent = storedEmail;
            }
        }
    }

    async function syncPortfolioWithBackend() {
        if (isOfflineSandbox || !userToken) return;
        try {
            const res = await fetch(`${API_URL}/api/portfolio`, {
                headers: { "Authorization": `Bearer ${userToken}` }
            });
            if (res.ok) {
                const apiData = await res.json();
                data.userState.portfolio.cash = apiData.cash;
                data.userState.portfolio.holdings = (apiData.holdings || []).map(function(h) {
                    return {
                        symbol: h.symbol,
                        shares: h.shares,
                        avgCost: h.avg_cost !== undefined ? h.avg_cost : (h.avgCost || 0)
                    };
                });
                data.userState.portfolio.transactions = apiData.transactions;
                data.userState.watchlist = apiData.watchlist;
            } else if (res.status === 401 || res.status === 403) {
                logoutUser();
            }
        } catch (e) {
            console.error("SQLite portfolio synchronization failure:", e);
        }
    }

    function logoutUser() {
        localStorage.removeItem("bv_token");
        localStorage.removeItem("bv_email");
        sessionStorage.removeItem("auth_passed");
        userToken = null;
        userEmail = null;
        setupAuthenticationState();
    }

    // Hook BUY/SELL transactions to Express Backend if online
    const originalAddTransaction = window.PortfolioManager.addTransaction;
    window.PortfolioManager.addTransaction = async function(type, symbol, shares, price, assetType = "STOCK") {
        if (isOfflineSandbox || !userToken) {
            return originalAddTransaction(type, symbol, shares, price);
        }

        try {
            const res = await fetch(`${API_URL}/api/trade`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify({ action: type, symbol, shares, price, assetType })
            });
            const resData = await res.json();
            if (res.ok) {
                await syncPortfolioWithBackend();
                
                // Sync Limits UI with new server state
                const uState = data.userState.portfolio;
                const availableMargin = uState.cash + 285000;
                
                const dashAvailEl = document.getElementById("lim-avail-margin");
                if (dashAvailEl) dashAvailEl.textContent = "₹" + availableMargin.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                const dashCashEl = document.getElementById("lim-cash-bal");
                if (dashCashEl) dashCashEl.textContent = "₹" + uState.cash.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                
                const dashMarginUsedEl = document.getElementById("lim-margin-used");
                if (dashMarginUsedEl) {
                     const marginUsed = uState.cash < 0 ? Math.abs(uState.cash) : 0;
                     dashMarginUsedEl.innerHTML = `₹${marginUsed.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span class="text-[10px] text-gray-500 font-normal">(${(marginUsed/285000*100).toFixed(1)}%)</span>`;
                }
                
                return { success: true, msg: resData.message };
            } else {
                return { success: false, msg: resData.error || "Order execution failed." };
            }
        } catch (e) {
            return { success: false, msg: "SQLite API server connection lost." };
        }
    };

    // Hook Watchlist toggles to Express Backend if online
    const originalToggleWatchlist = toggleWatchlist;
    toggleWatchlist = async function(symbol) {
        if (isOfflineSandbox || !userToken) {
            return originalToggleWatchlist(symbol);
        }

        try {
            const res = await fetch(`${API_URL}/api/watchlist/toggle`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`
                },
                body: JSON.stringify({ symbol })
            });
            if (res.ok) {
                await syncPortfolioWithBackend();
            }
        } catch (e) {
            console.error("Watchlist API error:", e);
        }
    };

    // Hook Admin panel view to request active db logs
    const originalSetupAdminView = setupAdminView;
    setupAdminView = async function() {
        if (isOfflineSandbox || !userToken) {
            return originalSetupAdminView();
        }

        try {
            const res = await fetch(`${API_URL}/api/admin/dashboard`, {
                headers: { "Authorization": `Bearer ${userToken}` }
            });
            if (res.ok) {
                const adminData = await res.json();
                
                // Populate system logs
                const logBox = document.getElementById("admin-system-logs");
                if (logBox) {
                     logBox.innerHTML = adminData.logs.map(l => {
                         const time = new Date(l.timestamp).toLocaleTimeString();
                         return `<div>[${time}] User (${l.user_email}): ${l.action}</div>`;
                     }).join("");
                     logBox.scrollTop = logBox.scrollHeight;
                }
            }
        } catch (e) {
            console.error("Admin dashboard loading error:", e);
        }
    };

    // Renders cryptocurrency spots list (legacy view — only runs if old elements exist)
    function setupCryptoView() {
        const tbody = document.getElementById("crypto-tbody-list");
        if (!tbody) return;

        tbody.innerHTML = data.cryptos.map(cry => {
            const isPos = cry.changePercent >= 0;
            return `<tr>
                <td class="py-3.5 font-bold text-white flex items-center gap-1.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span> ${cry.symbol}
                </td>
                <td class="py-3.5 text-gray-400">${cry.name}</td>
                <td class="py-3.5 font-mono font-semibold text-white">₹${cry.price.toLocaleString('en-IN')}</td>
                <td class="py-3.5 font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-red-400'}">
                    ${isPos ? '+' : ''}${cry.changePercent.toFixed(2)}%
                </td>
                <td class="py-3.5 text-right">
                    <button class="bg-white/5 border border-white/10 hover:bg-emerald-500 hover:text-black hover:border-emerald-500 text-[10px] font-bold px-3.5 py-1 rounded transition" onclick="document.getElementById('crypto-trade-select').value='${cry.symbol}';">
                        Select Asset
                    </button>
                </td>
            </tr>`;
        }).join("");

        const walletBal = document.getElementById("crypto-wallet-balance");
        if (walletBal) walletBal.textContent = "₹" + Math.round(data.userState.portfolio.cash).toLocaleString();
    }

    // Bind spot cryptos BUY/SELL terminal buttons (null-safe)
    const cryptoBuyBtn = document.getElementById("crypto-buy-btn");
    if (cryptoBuyBtn) {
        cryptoBuyBtn.addEventListener("click", async () => {
            const sym = document.getElementById("crypto-trade-select").value;
            const shares = parseFloat(document.getElementById("crypto-trade-shares").value);
            const cry = data.cryptos.find(c => c.symbol === sym);
            
            if (isNaN(shares) || shares <= 0) return alert("Enter valid coins amount.");

            const res = await window.PortfolioManager.addTransaction("BUY", sym, shares, cry.price, "CRYPTO");
            alert(res.msg);
            setupCryptoView();
        });
    }

    const cryptoSellBtn = document.getElementById("crypto-sell-btn");
    if (cryptoSellBtn) {
        cryptoSellBtn.addEventListener("click", async () => {
            const sym = document.getElementById("crypto-trade-select").value;
            const shares = parseFloat(document.getElementById("crypto-trade-shares").value);
            const cry = data.cryptos.find(c => c.symbol === sym);
            
            if (isNaN(shares) || shares <= 0) return alert("Enter valid coins amount.");

            const res = await window.PortfolioManager.addTransaction("SELL", sym, shares, cry.price, "CRYPTO");
            alert(res.msg);
            setupCryptoView();
        });
    }

    // =========================================================================
    // AUTHENTICATION EVENT LISTENERS (fully null-safe with offline fallback)
    // =========================================================================

    // Helper: local offline auth storage
    function getLocalUsers() {
        try { return JSON.parse(localStorage.getItem("bv_local_users") || "{}"); } catch(e) { return {}; }
    }
    function saveLocalUsers(users) {
        localStorage.setItem("bv_local_users", JSON.stringify(users));
    }
    function generateLocalToken(email) {
        return "local_" + btoa(email + ":" + Date.now()) + "_" + Math.random().toString(36).substr(2, 9);
    }

    // Panel switching
    const toSignupBtn = document.getElementById("to-signup-btn");
    if (toSignupBtn) {
        toSignupBtn.addEventListener("click", () => {
            const loginPanel = document.getElementById("auth-login-panel");
            const signupPanel = document.getElementById("auth-signup-panel");
            if (loginPanel) loginPanel.classList.add("hidden");
            if (signupPanel) signupPanel.classList.remove("hidden");
        });
    }

    const toLoginBtn = document.getElementById("to-login-btn");
    if (toLoginBtn) {
        toLoginBtn.addEventListener("click", () => {
            const signupPanel = document.getElementById("auth-signup-panel");
            const loginPanel = document.getElementById("auth-login-panel");
            if (signupPanel) signupPanel.classList.add("hidden");
            if (loginPanel) loginPanel.classList.remove("hidden");
        });
    }

    // Sandbox bypass
    const authBypassBtn = document.getElementById("auth-bypass-btn");
    if (authBypassBtn) {
        authBypassBtn.addEventListener("click", () => {
            isOfflineSandbox = true;
            sessionStorage.setItem("auth_passed", "true");
            const overlay = document.getElementById("auth-overlay");
            if (overlay) overlay.classList.add("hidden");
            if (window.showToast) window.showToast("Welcome! Running in offline sandbox guest mode.", "success");
            else alert("Running in guest mode. Data will NOT persist in backend SQLite DB.");
            setupCryptoView();
        });
    }

    // Toggle Login Password Visibility
    let showLoginPw = false;
    const toggleLoginPwBtn = document.getElementById("toggle-login-pw");
    if (toggleLoginPwBtn) {
        toggleLoginPwBtn.addEventListener("click", () => {
            showLoginPw = !showLoginPw;
            const input = document.getElementById("login-password");
            const icon = toggleLoginPwBtn.querySelector("i");
            if (input) input.type = showLoginPw ? "text" : "password";
            if (icon) {
                icon.setAttribute("data-lucide", showLoginPw ? "eye-off" : "eye");
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        });
    }

    // Password Strength Checker for Sign Up
    const signupPasswordInput = document.getElementById("signup-password");
    if (signupPasswordInput) {
        signupPasswordInput.addEventListener("input", () => {
            const val = signupPasswordInput.value;
            const bar = document.getElementById("pw-strength-bar");
            const label = document.getElementById("pw-strength-label");
            if (!bar || !label) return;
            
            let strength = 0;
            if (val.length >= 6) strength += 25;
            if (/[A-Z]/.test(val)) strength += 25;
            if (/[0-9]/.test(val)) strength += 25;
            if (/[^A-Za-z0-9]/.test(val)) strength += 25;

            bar.style.width = strength + "%";
            if (strength <= 25) {
                bar.className = "h-full rounded-full transition-all duration-300 bg-red-500";
                label.textContent = val.length > 0 ? "Weak password" : "";
                label.className = "text-[8px] text-red-400 font-bold";
            } else if (strength <= 75) {
                bar.className = "h-full rounded-full transition-all duration-300 bg-amber-500";
                label.textContent = "Moderate strength";
                label.className = "text-[8px] text-amber-400 font-bold";
            } else {
                bar.className = "h-full rounded-full transition-all duration-300 bg-emerald-500";
                label.textContent = "Strong password (biometric ready)";
                label.className = "text-[8px] text-emerald-400 font-bold";
            }
        });
    }

    // Sign Up Click (with backend + local fallback)
    const signupSubmitBtn = document.getElementById("signup-submit-btn");
    if (signupSubmitBtn) {
        signupSubmitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const emailEl = document.getElementById("signup-email");
            const passEl = document.getElementById("signup-password");
            const email = emailEl ? emailEl.value.trim() : "";
            const password = passEl ? passEl.value.trim() : "";

            if (!email || !password) {
                if (window.showToast) window.showToast("Please specify email and password.", "error");
                else alert("Please specify email and password.");
                return;
            }
            if (password.length < 6) {
                if (window.showToast) window.showToast("Password must be at least 6 characters.", "error");
                else alert("Password must be at least 6 characters.");
                return;
            }

            let registered = false;

            // Try backend first if not in sandbox
            if (!isOfflineSandbox) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000);
                    
                    const res = await fetch(`${API_URL}/api/auth/register`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    
                    const apiData = await res.json();
                    if (res.ok) {
                        registered = true;
                        const acceptBiometric = confirm("Account created successfully!\n\nWould you like to enroll this device's Touch ID / Face ID for faster login next time?");
                        if (acceptBiometric && apiData.biometricId) {
                            localStorage.setItem(`bv_biometric_${email}`, apiData.biometricId);
                            if (window.showToast) window.showToast("Biometric enrolled successfully.", "success");
                            else alert("Biometric enrolled successfully. You can now use your fingerprint to sign in!");
                        }
                    } else {
                        if (window.showToast) window.showToast(apiData.error || "Registration failed.", "error");
                        else alert(apiData.error || "Registration failed.");
                        return;
                    }
                } catch (e) {
                    console.warn("Backend unreachable for signup, using local fallback.");
                }
            }

            // Local fallback if backend failed
            if (!registered) {
                const localUsers = getLocalUsers();
                if (localUsers[email]) {
                    if (window.showToast) window.showToast("An account with this email already exists. Please sign in.", "error");
                    else alert("An account with this email already exists. Please sign in.");
                } else {
                    localUsers[email] = { password: btoa(password), createdAt: Date.now() };
                    saveLocalUsers(localUsers);
                    registered = true;
                    if (window.showToast) window.showToast("Account created successfully! (Local mode)", "success");
                    else alert("Account created successfully! (Local mode)");
                }
            }

            if (registered) {
                const signupPanel = document.getElementById("auth-signup-panel");
                const loginPanel = document.getElementById("auth-login-panel");
                if (signupPanel) signupPanel.classList.add("hidden");
                if (loginPanel) loginPanel.classList.remove("hidden");
                const loginEmail = document.getElementById("login-email");
                const loginPass = document.getElementById("login-password");
                if (loginEmail) loginEmail.value = email;
                if (loginPass) loginPass.value = "";
            }
        });
    }

    // Password Login Click (with backend + local fallback)
    const loginSubmitBtn = document.getElementById("login-submit-btn");
    const emailEl = document.getElementById("login-email");
    const passEl = document.getElementById("login-password");
    
    // Add Enter key support
    const handleEnterPress = (e) => {
        if (e.key === "Enter" && loginSubmitBtn) {
            loginSubmitBtn.click();
        }
    };
    if (emailEl) emailEl.addEventListener("keydown", handleEnterPress);
    if (passEl) passEl.addEventListener("keydown", handleEnterPress);

    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener("click", async (e) => {
            e.preventDefault();
            const email = emailEl ? emailEl.value.trim() : "";
            const password = passEl ? passEl.value.trim() : "";

            if (!email || !password) {
                if (window.showToast) window.showToast("Please enter both email and password.", "error");
                else alert("Please specify email and password.");
                return;
            }

            let loggedIn = false;

            // Try backend first if not in sandbox
            if (!isOfflineSandbox) {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2 second timeout
                    
                    const res = await fetch(`${API_URL}/api/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, password }),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);
                    
                    const apiData = await res.json();

                    if (res.ok) {
                        localStorage.setItem("bv_token", apiData.token);
                        localStorage.setItem("bv_email", apiData.email);
                        userToken = apiData.token;
                        userEmail = apiData.email;
                        loggedIn = true;
                    } else {
                        if (window.showToast) window.showToast("Login Failed: " + (apiData.error || "Invalid credentials"), "error");
                        else alert("Login Failed: " + (apiData.error || "Invalid credentials"));
                        return;
                    }
                } catch (e) {
                    console.warn("Backend unreachable for login, trying local fallback.", e.message);
                }
            }

            // Local fallback
            if (!loggedIn) {
                const localUsers = getLocalUsers();
                const localUser = localUsers[email];
                
                // In prototype mode, auto-register or overwrite to ALWAYS allow login
                const localUsersNew = getLocalUsers();
                localUsersNew[email] = { password: btoa(password), createdAt: Date.now() };
                saveLocalUsers(localUsersNew);
                
                const token = generateLocalToken(email);
                localStorage.setItem("bv_token", token);
                localStorage.setItem("bv_email", email);
                userToken = token;
                userEmail = email;
                loggedIn = true;
            }

            if (loggedIn) {
                sessionStorage.setItem("auth_passed", "true");
                const overlay = document.getElementById("auth-overlay");
                if (overlay) overlay.classList.add("hidden");
                if (window.showToast) window.showToast("Sign-in successful. Welcome to BullVerse!", "success");
                else alert("Sign-in successful. Welcome to BullVerse!");
                updateProfileWidget();
                try { await syncPortfolioWithBackend(); } catch(e) {}
                navigateTo("home");
            }
        });
    }

    // Biometric Login Click
    const biometricLoginBtn = document.getElementById("biometric-login-btn");
    if (biometricLoginBtn) {
        biometricLoginBtn.addEventListener("click", async () => {
            const emailEl = document.getElementById("login-email");
            const email = emailEl ? emailEl.value.trim() : "";

            if (!email) {
                return alert("Please enter your email address to authenticate with biometrics.");
            }

            const storedBiometricId = localStorage.getItem(`bv_biometric_${email}`);
            if (!storedBiometricId) {
                return alert("No biometric credential found for this email on this device. Please sign in with your password first to configure Touch ID / Face ID.");
            }

            // Show scanning animation
            const formContent = document.querySelectorAll("#auth-login-panel > :not(#biometric-scan-container)");
            const scanner = document.getElementById("biometric-scan-container");
            const scannerRing = document.querySelector(".biometric-scanner-ring");
            
            formContent.forEach(el => el.classList.add("pointer-events-none", "opacity-20"));
            if (scanner) scanner.classList.remove("hidden");

            // Wait 1.5 seconds for mock scanner
            setTimeout(async () => {
                let loggedIn = false;
                try {
                    const res = await fetch(`${API_URL}/api/auth/biometric/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email, biometricId: storedBiometricId })
                    });
                    const apiData = await res.json();

                    if (res.ok) {
                        loggedIn = true;
                        if (scannerRing) {
                            scannerRing.classList.add("biometric-success");
                            const icon = scannerRing.querySelector("i");
                            if (icon) {
                                icon.setAttribute("data-lucide", "check");
                                if (typeof lucide !== 'undefined') lucide.createIcons();
                            }
                        }

                        setTimeout(() => {
                            localStorage.setItem("bv_token", apiData.token);
                            localStorage.setItem("bv_email", apiData.email);
                            userToken = apiData.token;
                            userEmail = apiData.email;
                            sessionStorage.setItem("auth_passed", "true");

                            // Reset UI elements
                            const overlay = document.getElementById("auth-overlay");
                            if (overlay) overlay.classList.add("hidden");
                            if (scanner) scanner.classList.add("hidden");
                            formContent.forEach(el => el.classList.remove("pointer-events-none", "opacity-20"));
                            
                            updateProfileWidget();
                            if (window.showToast) window.showToast("Biometric Authentication successful. Welcome!", "success");
                            syncPortfolioWithBackend().then(() => navigateTo("home"));
                        }, 500);
                    } else {
                        alert(apiData.error || "Biometric validation failed.");
                        if (scanner) scanner.classList.add("hidden");
                        formContent.forEach(el => el.classList.remove("pointer-events-none", "opacity-20"));
                    }
                } catch (e) {
                    // Local fallback for biometrics
                    console.warn("Backend unreachable for biometric login, using local mode.");
                    loggedIn = true;
                    if (scannerRing) {
                        scannerRing.classList.add("biometric-success");
                        const icon = scannerRing.querySelector("i");
                        if (icon) {
                            icon.setAttribute("data-lucide", "check");
                            if (typeof lucide !== 'undefined') lucide.createIcons();
                        }
                    }
                    setTimeout(() => {
                        const token = generateLocalToken(email);
                        localStorage.setItem("bv_token", token);
                        localStorage.setItem("bv_email", email);
                        userToken = token;
                        userEmail = email;
                        sessionStorage.setItem("auth_passed", "true");

                        const overlay = document.getElementById("auth-overlay");
                        if (overlay) overlay.classList.add("hidden");
                        if (scanner) scanner.classList.add("hidden");
                        formContent.forEach(el => el.classList.remove("pointer-events-none", "opacity-20"));
                        
                        updateProfileWidget();
                        if (window.showToast) window.showToast("Biometric Authentication successful. Welcome!", "success");
                        navigateTo("home");
                    }, 500);
                }
            }, 1500);
        });
    }


    // Simulates crypto price ticks every interval
    setInterval(() => {
        if (data.cryptos) {
            data.cryptos.forEach(cry => {
                const move = (Math.random() - 0.5) * 1.5;
                cry.priceUSD = parseFloat((cry.priceUSD * (1 + move / 100)).toFixed(4));
                cry.price = parseFloat((cry.priceUSD * 84).toFixed(2));
                cry.changePercent = parseFloat((cry.changePercent + move).toFixed(2));
            });
        }

        if (currentActiveView === "crypto") {
            setupCryptoView();
            if (typeof renderCryptoTableFiltered === "function") {
                renderCryptoTableFiltered();
            }
            if (typeof renderCryptoHighlights === "function") {
                renderCryptoHighlights();
            }
        }
    }, 3000);

    // Run connections check on start
    checkBackendConnection();

    // ============================================
    // JM PRO-INSPIRED SECTIONS — Interactive JS
    // ============================================

    // FAQ Accordion Toggle
    document.querySelectorAll('.faq-question-jm').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isOpen = faqItem.classList.contains('open');
            
            // Close all other FAQs
            document.querySelectorAll('.faq-item-jm').forEach(item => {
                item.classList.remove('open');
            });
            
            // Toggle current
            if (!isOpen) {
                faqItem.classList.add('open');
            }
        });
    });

    // Scroll Reveal Animation — IntersectionObserver
    const scrollRevealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all scroll-reveal elements
    document.querySelectorAll('.scroll-reveal').forEach(el => {
        scrollRevealObserver.observe(el);
    });

    // Re-initialize Lucide icons for the new JM sections (they use data-lucide attributes)
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        setTimeout(() => {
            lucide.createIcons();
        }, 100);
    }

    // ================== CRYPTO CENTER (BINANCE INSPIRED) LOGIC ==================
    const cryptoMarketData = {
        spot: data.cryptos,
        futures: data.cryptos.map(c => ({
            ...c,
            symbol: c.symbol + "USDT",
            name: c.name + " Perpetual",
            priceUSD: c.priceUSD + (Math.random() - 0.5) * 5,
            vol: (parseFloat(c.vol) * 1.4).toFixed(1) + "B",
            mcap: "-"
        })),
        aiSelect: data.cryptos.filter(c => c.category === "AI & Big Data" || c.symbol === "SOL" || c.symbol === "SUI"),
        earn: [
            { symbol: 'BTC', name: 'Bitcoin', apy: 4.8, minStake: 0.001, duration: 'Flexible / 30d / 60d / 90d', status: 'High Yield', category: "Layer 1/Layer 2" },
            { symbol: 'ETH', name: 'Ethereum', apy: 5.6, minStake: 0.01, duration: 'Flexible / 60d / 120d', status: 'Trending', category: "Layer 1/Layer 2" },
            { symbol: 'SOL', name: 'Solana', apy: 8.2, minStake: 0.1, duration: 'Flexible / 30d / 90d', status: 'High Yield', category: "Layer 1/Layer 2" },
            { symbol: 'BNB', name: 'BNB', apy: 6.8, minStake: 0.05, duration: 'Flexible / 30d / 90d', status: 'Trending', category: "Layer 1/Layer 2" },
            { symbol: 'DOT', name: 'Polkadot', apy: 12.4, minStake: 1.0, duration: '30d / 60d / 120d Locked', status: 'Hot', category: "Layer 1/Layer 2" },
            { symbol: 'LINK', name: 'Chainlink', apy: 5.2, minStake: 1.0, duration: 'Flexible / 30d', status: 'Stable', category: "DeFi" },
            { symbol: 'UNI', name: 'Uniswap', apy: 7.5, minStake: 2.0, duration: 'Flexible / 60d', status: 'Stable', category: "DeFi" },
            { symbol: 'PEPE', name: 'Pepe', apy: 18.2, minStake: 100000, duration: 'Flexible Savings', status: 'Meme Special', category: "Meme Coins" },
            { symbol: 'FET', name: 'Fetch.ai', apy: 11.5, minStake: 10, duration: '30d / 90d Locked', status: 'AI Special', category: "AI & Big Data" },
            { symbol: 'RNDR', name: 'Render', apy: 9.6, minStake: 5, duration: 'Flexible / 60d', status: 'AI Special', category: "AI & Big Data" },
            { symbol: 'SUI', name: 'Sui', apy: 8.5, minStake: 1.0, duration: '30d / 90d Locked', status: 'Hot', category: "Layer 1/Layer 2" }
        ]
    };

    let activeCryptoTab = 'spot';
    let activeCryptoCategory = 'All';
    let cryptoSearchQuery = '';

    const cryptoTbody = document.getElementById('market-table-body');
    const cryptoTabs = document.querySelectorAll('.market-tab');
    const cryptoTableContainer = document.getElementById('table-view');
    const cryptoFeatureViews = document.querySelectorAll('.feature-view');
    const cryptoSearchInput = document.getElementById('crypto-search-input');
    const cryptoCatBtns = document.querySelectorAll('.crypto-cat-btn');

    // Function to render table rows with filtering
    function renderCryptoTableFiltered() {
        if (!cryptoTbody) return;
        
        let list = cryptoMarketData[activeCryptoTab] || [];
        
        // Filter by category
        if (activeCryptoCategory !== 'All') {
            list = list.filter(coin => {
                let targetSym = coin.symbol;
                if (activeCryptoTab === 'futures') {
                    targetSym = coin.symbol.replace("USDT", "");
                }
                const spotCoin = data.cryptos.find(c => c.symbol === targetSym);
                return spotCoin && spotCoin.category === activeCryptoCategory;
            });
        }
        
        // Filter by search query
        if (cryptoSearchQuery) {
            list = list.filter(coin => {
                return coin.symbol.toLowerCase().includes(cryptoSearchQuery) || 
                       coin.name.toLowerCase().includes(cryptoSearchQuery);
            });
        }

        // Dynamically alter headers based on current active tab
        const headerRow = document.querySelector('#table-view table thead tr');
        if (headerRow) {
            if (activeCryptoTab === 'earn') {
                headerRow.innerHTML = `
                    <th class="pb-3 text-left">Asset</th>
                    <th class="pb-3 text-left">Estimated APY</th>
                    <th class="pb-3 text-left">Duration Options</th>
                    <th class="pb-3 text-left">Min. Staking</th>
                    <th class="pb-3 text-left">Status</th>
                    <th class="pb-3 text-right pr-6">Action</th>
                `;
            } else {
                headerRow.innerHTML = `
                    <th class="pb-3 text-left">Name</th>
                    <th class="pb-3 text-left">Price</th>
                    <th class="pb-3 text-left">24h Change</th>
                    <th class="pb-3 text-left">24h Volume</th>
                    <th class="pb-3 text-left">Market Cap</th>
                    <th class="pb-3 text-right pr-4">Action</th>
                `;
            }
        }
        
        cryptoTbody.innerHTML = '';
        if (list.length === 0) {
            cryptoTbody.innerHTML = `<tr><td colspan="6" class="py-10 text-center text-gray-500">No matching assets found. Try a different search.</td></tr>`;
            return;
        }

        if (activeCryptoTab === 'earn') {
            list.forEach(coin => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="col-name">
                            <div class="coin-icon" style="background: linear-gradient(135deg, #10b981, #047857)">${coin.symbol.charAt(0)}</div>
                            <span class="coin-symbol">${coin.symbol}</span>
                            <span class="coin-name-full">${coin.name}</span>
                        </div>
                    </td>
                    <td class="col-price font-bold text-emerald-400">${coin.apy.toFixed(1)}% APY</td>
                    <td>${coin.duration}</td>
                    <td>${coin.minStake.toLocaleString()} ${coin.symbol}</td>
                    <td>
                        <span class="bg-emerald-500/10 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded">${coin.status}</span>
                    </td>
                    <td class="col-action pr-6 text-right">
                        <button class="bg-emerald-500 text-black text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-emerald-600 transition-all inline-block" onclick="window.openCryptoStakeModal('${coin.symbol}', ${coin.apy})">Stake</button>
                    </td>
                `;
                cryptoTbody.appendChild(tr);
            });
        } else {
            list.forEach(coin => {
                let spotCoin = coin;
                if (activeCryptoTab === 'futures') {
                    const targetSym = coin.symbol.replace("USDT", "");
                    spotCoin = data.cryptos.find(c => c.symbol === targetSym) || coin;
                }
                
                const changePercent = coin.changePercent || coin.change || 0;
                const changeClass = changePercent >= 0 ? 'text-up' : 'text-down';
                const changePrefix = changePercent > 0 ? '+' : '';
                const coinPriceUSD = coin.priceUSD || coin.price;
                
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>
                        <div class="col-name">
                            <div class="coin-icon" style="background: linear-gradient(135deg, ${activeCryptoTab === 'aiSelect' ? '#8b5cf6, #3b82f6' : '#FCD535, #f39c12'})">${coin.symbol.charAt(0)}</div>
                            <span class="coin-symbol">${coin.symbol}</span>
                            <span class="coin-name-full">${coin.name}</span>
                            ${activeCryptoTab === 'aiSelect' ? `<span class="bg-purple-500/20 text-purple-400 text-[9px] font-bold px-1.5 py-0.5 rounded ml-1">AI PICK</span>` : ''}
                        </div>
                    </td>
                    <td class="col-price">$${coinPriceUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</td>
                    <td class="col-change ${changeClass}">${changePrefix}${changePercent.toFixed(2)}%</td>
                    <td>$${coin.vol}</td>
                    <td>${coin.mcap === '-' ? '-' : '$' + coin.mcap}</td>
                    <td class="col-action pr-4">
                        <a href="javascript:void(0)" class="trade-btn text-emerald-400 hover:text-emerald-300 font-bold" onclick="window.openCryptoTradeModal('${spotCoin.symbol}', ${spotCoin.price})">Trade</a>
                    </td>
                `;
                cryptoTbody.appendChild(tr);
            });
        }
    }

    // Trade Modal Prefill Handlers
    window.openCryptoTradeModal = function(symbol, priceInINR) {
        const txModal = document.getElementById("tx-modal");
        if (!txModal) return;

        const drop = document.getElementById("tx-symbol-select");
        if (drop) {
            drop.innerHTML = `<option value="${symbol}">${symbol} (Crypto)</option>` + 
                data.allStocksList.map(st => `<option value="${st.symbol}">${st.symbol}</option>`).join("");
            drop.value = symbol;
        }

        const priceInput = document.getElementById("tx-price-input");
        if (priceInput) {
            priceInput.value = priceInINR.toFixed(2);
        }

        const actionSelect = document.getElementById("tx-action-select");
        if (actionSelect) actionSelect.value = "BUY";

        txModal.classList.remove("hidden");
    };

    window.openStockTradeModal = function(symbol, price) {
        const txModal = document.getElementById("tx-modal");
        if (!txModal) return;

        const drop = document.getElementById("tx-symbol-select");
        if (drop) {
            drop.innerHTML = data.allStocksList.map(st => `<option value="${st.symbol}">${st.symbol}</option>`).join("");
            drop.value = symbol;
        }

        const priceInput = document.getElementById("tx-price-input");
        if (priceInput) {
            priceInput.value = price.toFixed(2);
        }

        const actionSelect = document.getElementById("tx-action-select");
        if (actionSelect) actionSelect.value = "BUY";

        txModal.classList.remove("hidden");
    };

    // ETF Trade Modal Prefill Handler
    window.openEtfTradeModal = function(symbol, name, price) {
        const txModal = document.getElementById("tx-modal");
        if (!txModal) return;

        const drop = document.getElementById("tx-symbol-select");
        if (drop) {
            // Build categorized dropdown with optgroups
            let html = '';
            // ETFs group (with the selected ETF first)
            html += '<optgroup label="── ETFs ──">';
            html += `<option value="${symbol}" selected>${symbol} - ${name}</option>`;
            if (data.etfs) {
                data.etfs.forEach(e => {
                    if (e.symbol !== symbol) {
                        html += `<option value="${e.symbol}">${e.symbol} - ${e.name}</option>`;
                    }
                });
            }
            html += '</optgroup>';
            // Stocks group
            html += '<optgroup label="── Stocks ──">';
            data.allStocksList.forEach(st => {
                html += `<option value="${st.symbol}">${st.symbol}</option>`;
            });
            html += '</optgroup>';
            // Cryptos group
            if (data.cryptos) {
                html += '<optgroup label="── Crypto ──">';
                data.cryptos.forEach(c => {
                    html += `<option value="${c.symbol}">${c.symbol} (Crypto)</option>`;
                });
                html += '</optgroup>';
            }
            drop.innerHTML = html;
            drop.value = symbol;
        }

        const priceInput = document.getElementById("tx-price-input");
        if (priceInput) {
            priceInput.value = price.toFixed(2);
        }

        const lblSymbol = document.getElementById("lbl-tx-symbol");
        if (lblSymbol) lblSymbol.innerText = "ETF Basket";
        const lblShares = document.getElementById("lbl-tx-shares");
        if (lblShares) lblShares.innerText = "Units Count";
        const lblPrice = document.getElementById("lbl-tx-price");
        if (lblPrice) lblPrice.innerText = "NAV / Price (₹)";

        const actionSelect = document.getElementById("tx-action-select");
        if (actionSelect) actionSelect.value = "BUY";

        txModal.classList.remove("hidden");
        if (window.lucide) lucide.createIcons();
    };

    // Staking Earn Modal elements & Logic
    const stakeModal = document.getElementById('stake-modal');
    const closeStakeModalBtn = document.getElementById('close-stake-modal-btn');
    const stakeCoinName = document.getElementById('stake-coin-name');
    const stakeCoinApy = document.getElementById('stake-coin-apy');
    const stakeUserBalance = document.getElementById('stake-user-balance');
    const stakeDurationSelect = document.getElementById('stake-duration-select');
    const stakeAmountInput = document.getElementById('stake-amount-input');
    const stakeMaxBtn = document.getElementById('stake-max-btn');
    const submitStakeBtn = document.getElementById('submit-stake-btn');

    let currentStakingAsset = null;
    let currentStakingApy = 0;
    let currentStakingMax = 0;

    window.openCryptoStakeModal = function(symbol, apy) {
        if (!stakeModal) return;
        currentStakingAsset = symbol;
        currentStakingApy = apy;

        stakeCoinName.textContent = `${symbol} Locked Savings`;
        stakeCoinApy.textContent = `${apy.toFixed(1)}% APY`;

        // Retrieve user holdings of this specific crypto asset
        const holdings = data.userState.portfolio.holdings;
        const matchingHolding = holdings.find(h => h.symbol === symbol);
        currentStakingMax = matchingHolding ? matchingHolding.shares : 0;

        stakeUserBalance.textContent = `${currentStakingMax.toLocaleString(undefined, {maximumFractionDigits: 6})} ${symbol}`;
        stakeAmountInput.value = '';
        
        stakeModal.classList.remove('hidden');
    };

    if (closeStakeModalBtn) {
        closeStakeModalBtn.addEventListener('click', () => {
            stakeModal.classList.add('hidden');
        });
    }

    if (stakeMaxBtn) {
        stakeMaxBtn.addEventListener('click', () => {
            stakeAmountInput.value = currentStakingMax;
        });
    }

    if (submitStakeBtn) {
        submitStakeBtn.addEventListener('click', () => {
            const amount = parseFloat(stakeAmountInput.value);
            if (isNaN(amount) || amount <= 0) {
                alert("Please enter a valid staking amount.");
                return;
            }
            if (amount > currentStakingMax) {
                alert(`Insufficient holdings to stake. You only own ${currentStakingMax} ${currentStakingAsset}. Go to Spot tab to buy some first!`);
                return;
            }

            // Deduct from portfolio holdings!
            const holdings = data.userState.portfolio.holdings;
            const matchingHolding = holdings.find(h => h.symbol === currentStakingAsset);
            
            if (matchingHolding) {
                matchingHolding.shares -= amount;
                
                // If shares is now 0, remove the holding
                if (matchingHolding.shares <= 0.000001) {
                    data.userState.portfolio.holdings = holdings.filter(h => h.symbol !== currentStakingAsset);
                }

                alert(`Successfully staked ${amount} ${currentStakingAsset} at ${currentStakingApy}% APY for locked period ${stakeDurationSelect.value}!`);
                
                stakeModal.classList.add('hidden');

                // Trigger portfolio recalculations and redraws
                setupPortfolioView();
                
                // Redraw crypto table to refresh trade/stake buttons
                renderCryptoTableFiltered();
            }
        });
    }

    // Initialize with spot data if table exists
    if (cryptoTbody) {
        renderCryptoTableFiltered();
    }

    // Tab Switching Logic
    cryptoTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            cryptoTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            activeCryptoTab = tab.getAttribute('data-target');
            
            if (cryptoTableContainer) cryptoTableContainer.style.display = 'none';
            cryptoFeatureViews.forEach(view => view.classList.remove('active'));

            if (activeCryptoTab === 'spot' || activeCryptoTab === 'futures' || activeCryptoTab === 'aiSelect' || activeCryptoTab === 'earn') {
                if (cryptoTableContainer) cryptoTableContainer.style.display = 'block';
                renderCryptoTableFiltered();
            } else {
                const activeView = document.getElementById(`view-${activeCryptoTab}`);
                if (activeView) activeView.classList.add('active');
            }
        });
    });

    // Category Filter Buttons Event Listeners
    cryptoCatBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            cryptoCatBtns.forEach(b => {
                b.classList.remove('bg-white/5', 'text-white');
                b.classList.add('bg-transparent', 'text-gray-400');
            });
            btn.classList.add('bg-white/5', 'text-white');
            btn.classList.remove('bg-transparent', 'text-gray-400');

            activeCryptoCategory = btn.getAttribute('data-category');
            renderCryptoTableFiltered();
        });
    });

    // Search Input Event Listener
    if (cryptoSearchInput) {
        cryptoSearchInput.addEventListener('input', (e) => {
            cryptoSearchQuery = e.target.value.toLowerCase().trim();
            renderCryptoTableFiltered();
        });
    }

    // Dynamic Highlights (Hot Coins, Top Gainers, AI Picks) Renderer
    function renderCryptoHighlights() {
        const hotList = document.getElementById('highlight-hot-list');
        const gainersList = document.getElementById('highlight-gainers-list');
        const aiList = document.getElementById('highlight-ai-list');

        if (!data.cryptos) return;

        // 1. Hot Coins
        if (hotList) {
            const hotSymbols = ["BTC", "ETH", "SOL", "BNB"];
            const hotCoins = data.cryptos.filter(c => hotSymbols.includes(c.symbol));
            hotList.innerHTML = hotCoins.map((coin, index) => {
                const change = coin.changePercent || 0;
                const isPos = change >= 0;
                return `
                    <a href="javascript:void(0)" class="highlight-item" onclick="window.filterCryptoBySymbol('${coin.symbol}')">
                        <div class="hl-coin"><span class="text-gray-400 text-xs w-4">${index + 1}</span> ${coin.symbol}</div>
                        <div class="hl-price">$${coin.priceUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
                        <div class="${isPos ? 'text-up' : 'text-down'} font-bold">${isPos ? '+' : ''}${change.toFixed(2)}%</div>
                    </a>
                `;
            }).join("");
        }

        // 2. Top Gainers
        if (gainersList) {
            const sortedGainers = [...data.cryptos].sort((a, b) => (b.changePercent || 0) - (a.changePercent || 0)).slice(0, 3);
            gainersList.innerHTML = sortedGainers.map((coin, index) => {
                const change = coin.changePercent || 0;
                const isPos = change >= 0;
                return `
                    <a href="javascript:void(0)" class="highlight-item" onclick="window.filterCryptoBySymbol('${coin.symbol}')">
                        <div class="hl-coin"><span class="text-gray-400 text-xs w-4">${index + 1}</span> ${coin.symbol}</div>
                        <div class="hl-price">$${coin.priceUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
                        <div class="${isPos ? 'text-up' : 'text-down'} font-bold">${isPos ? '+' : ''}${change.toFixed(2)}%</div>
                    </a>
                `;
            }).join("");
        }

        // 3. AI Picks
        if (aiList) {
            const aiSymbols = ["FET", "RNDR", "AGIX"];
            const aiCoins = data.cryptos.filter(c => aiSymbols.includes(c.symbol));
            const aiTags = {
                "FET": { tag: "STRONG BUY", tagClass: "bg-amber-500/20 text-amber-500" },
                "RNDR": { tag: "ACCUMULATE", tagClass: "bg-blue-500/20 text-blue-400" },
                "AGIX": { tag: "STRONG BUY", tagClass: "bg-amber-500/20 text-amber-500" }
            };
            aiList.innerHTML = aiCoins.map(coin => {
                const change = coin.changePercent || 0;
                const isPos = change >= 0;
                const tagInfo = aiTags[coin.symbol] || { tag: "HOLD", tagClass: "bg-gray-500/20 text-gray-400" };
                return `
                    <a href="javascript:void(0)" class="highlight-item" onclick="window.filterCryptoBySymbol('${coin.symbol}')">
                        <div class="hl-coin">
                            ${coin.symbol}
                            <span class="text-[9px] px-1.5 py-0.5 rounded font-bold ml-1.5 ${tagInfo.tagClass}">${tagInfo.tag}</span>
                        </div>
                        <div class="hl-price">$${coin.priceUSD.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 4})}</div>
                        <div class="${isPos ? 'text-up' : 'text-down'} font-bold">${isPos ? '+' : ''}${change.toFixed(2)}%</div>
                    </a>
                `;
            }).join("");
        }
    }

    // Highlight item click filter callback
    window.filterCryptoBySymbol = function(symbol) {
        if (cryptoSearchInput) {
            cryptoSearchInput.value = symbol;
            cryptoSearchQuery = symbol.toLowerCase().trim();
            renderCryptoTableFiltered();
        }
        const marketsSection = document.querySelector('.markets-section');
        if (marketsSection) {
            marketsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    // Render highlights initially
    if (cryptoTbody) {
        renderCryptoHighlights();
    }

});
