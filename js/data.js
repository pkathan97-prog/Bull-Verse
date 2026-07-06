// BullVerse India Mock Database

// Helper to generate financial series data
function generateFinancialSeries(baseVal, growthRate, years = 3) {
    const series = [];
    let current = baseVal;
    for (let i = 0; i < years; i++) {
        series.unshift({
            year: 2024 - i,
            value: Math.round(current)
        });
        current = current / (1 + growthRate);
    }
    return series;
}

window.BullVerseData = {
    // 1. Detailed Indian Stock Database
    stocks: {
        "TATAMOTORS": {
            symbol: "TATAMOTORS",
            name: "Tata Motors Limited",
            logo: "https://companieslogo.com/img/orig/TATAMOTORS.NS_BIG-7707c57c.png?t=1596841261",
            industry: "Automobile",
            sector: "Auto - Cars & Utility Vehicles",
            ceo: "Guenter Butschek",
            price: 353.20,
            prevClose: 349.70,
            change: 3.50,
            changePercent: 1.00,
            volume: 8524000,
            marketCap: "3,27,450 Cr",
            faceValue: 2,
            bookValue: 184.20,
            peRatio: 18.5,
            pbRatio: 5.34,
            roe: 28.4,
            roce: 22.8,
            eps: 53.21,
            dividendYield: 0.81,
            debtToEquity: 1.12,
            freeCashFlow: "18,450 Cr",
            holdings: {
                promoter: 46.36,
                fii: 19.20,
                dii: 16.44,
                retail: 18.00
            },
            quarterlyResults: [
                { quarter: "Q4 FY24", sales: 119980, netProfit: 17407 },
                { quarter: "Q3 FY24", sales: 110600, netProfit: 7025 },
                { quarter: "Q2 FY24", sales: 105128, netProfit: 3764 },
                { quarter: "Q1 FY24", sales: 102236, netProfit: 3203 }
            ],
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 766 },
                    { item: "Reserves & Surplus", value: 68140 },
                    { item: "Long Term Debt", value: 45200 },
                    { item: "Other Liabilities", value: 58240 }
                ],
                assets: [
                    { item: "Fixed Assets", value: 89450 },
                    { item: "Investments", value: 34120 },
                    { item: "Cash Equivalents", value: 18500 },
                    { item: "Other Assets", value: 30276 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: 437920, profit: 31807 },
                { year: "FY23", revenue: 345960, profit: 2414 },
                { year: "FY22", revenue: 278454, profit: -11309 }
            ],
            cashFlow: {
                operating: 45600,
                investing: -28400,
                financing: -12200,
                netChange: 5000
            },
            corporateActions: {
                dividends: [
                    { date: "22-Jun-2024", type: "Final", amount: "₹6.00" },
                    { date: "15-Jul-2023", type: "Final", amount: "₹2.00" }
                ],
                bonus: [
                    { date: "None Recents", ratio: "N/A" }
                ],
                splits: [
                    { date: "12-Sep-2011", ratio: "5:1" }
                ]
            },
            news: [
                { date: "Today", title: "Tata Motors EV sales jump 24% YoY in June", sentiment: "Bullish" },
                { date: "2 days ago", title: "Brokerages raise target price on strong commercial vehicle demand", sentiment: "Bullish" }
            ],
            peers: [
                { name: "M&M", price: 2840.15, pe: 24.3, marketCap: "3,53,000 Cr" },
                { name: "Maruti Suzuki", price: 12150.00, pe: 29.5, marketCap: "3,82,000 Cr" }
            ],
            aiScore: {
                targetPrice: "₹1,150",
                riskScore: "Medium (3.2/5)",
                investmentScore: "88/100 (Strong Buy)",
                esgScore: "78/100",
                dna: {
                    growth: 92,
                    valuation: 65,
                    profitability: 85,
                    stability: 72,
                    risk: 55,
                    governance: 88
                },
                analysis: "Tata Motors is showing excellent turnaround strength led by its JLR division and leadership in the domestic EV segment. Margin expansion in commercial vehicles serves as a core catalyst. Debt reduction targets are on track, making it a stellar long-term bet, though valuations are becoming rich."
            }
        },
        "RELIANCE": {
            symbol: "RELIANCE",
            name: "Reliance Industries Limited",
            logo: "https://companieslogo.com/img/orig/RELIANCE.NS_BIG-0a86d267.png?t=1602766861",
            industry: "Oil & Gas, Retail, Telecom",
            sector: "Conglomerates",
            ceo: "Mukesh Ambani",
            price: 1318.10,
            prevClose: 1325.40,
            change: -7.30,
            changePercent: -0.55,
            volume: 4562000,
            marketCap: "19,95,430 Cr",
            faceValue: 10,
            bookValue: 1420.50,
            peRatio: 26.8,
            pbRatio: 2.08,
            roe: 9.8,
            roce: 10.4,
            eps: 110.12,
            dividendYield: 0.34,
            debtToEquity: 0.38,
            freeCashFlow: "42,100 Cr",
            holdings: {
                promoter: 50.39,
                fii: 22.10,
                dii: 16.50,
                retail: 11.01
            },
            quarterlyResults: [
                { quarter: "Q4 FY24", sales: 240715, netProfit: 18951 },
                { quarter: "Q3 FY24", sales: 225086, netProfit: 17264 },
                { quarter: "Q2 FY24", sales: 231886, netProfit: 17394 },
                { quarter: "Q1 FY24", sales: 207559, netProfit: 16011 }
            ],
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 6765 },
                    { item: "Reserves & Surplus", value: 785600 },
                    { item: "Long Term Debt", value: 294500 },
                    { item: "Other Liabilities", value: 185000 }
                ],
                assets: [
                    { item: "Fixed Assets", value: 895600 },
                    { item: "Investments", value: 154000 },
                    { item: "Cash Equivalents", value: 92265 },
                    { item: "Other Assets", value: 130000 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: 902400, profit: 69624 },
                { year: "FY23", revenue: 877200, profit: 66702 },
                { year: "FY22", revenue: 699900, profit: 58440 }
            ],
            cashFlow: {
                operating: 115200,
                investing: -78000,
                financing: -30200,
                netChange: 7000
            },
            corporateActions: {
                dividends: [
                    { date: "18-Aug-2023", type: "Final", amount: "₹9.00" },
                    { date: "19-Aug-2022", type: "Final", amount: "₹8.00" }
                ],
                bonus: [
                    { date: "07-Sep-2017", ratio: "1:1" }
                ],
                splits: [
                    { date: "26-Nov-1997", ratio: "2:1" }
                ]
            },
            news: [
                { date: "3 days ago", title: "Jio Infocomm tariff hikes to boost ARPU by 15%", sentiment: "Bullish" },
                { date: "Last week", title: "Reliance Retail adds 300 new stores in Q4", sentiment: "Bullish" }
            ],
            peers: [
                { name: "ONGC", price: 268.40, pe: 8.2, marketCap: "3,37,000 Cr" },
                { name: "Coal India", price: 472.00, pe: 11.4, marketCap: "2,91,000 Cr" }
            ],
            aiScore: {
                targetPrice: "₹3,350",
                riskScore: "Low (1.8/5)",
                investmentScore: "82/100 (Buy)",
                esgScore: "74/100",
                dna: {
                    growth: 78,
                    valuation: 75,
                    profitability: 80,
                    stability: 95,
                    risk: 20,
                    governance: 92
                },
                analysis: "Reliance offers unmatched stability as the giant of the Indian stock market. The recent telecom tariff hikes by Jio and robust retail performance cushion the cyclical oil-to-chemicals (O2C) segment. High capital expenditure in green energy represents a major future catalyst."
            }
        },
        "HDFCBANK": {
            symbol: "HDFCBANK",
            name: "HDFC Bank Limited",
            logo: "https://companieslogo.com/img/orig/HDB_BIG-1fcfbf5f.png?t=1651475141",
            industry: "Financial Services",
            sector: "Banks - Private Sector",
            ceo: "Sashidhar Jagdishan",
            price: 796.30,
            prevClose: 788.50,
            change: 7.80,
            changePercent: 0.99,
            volume: 9125000,
            marketCap: "12,74,210 Cr",
            faceValue: 1,
            bookValue: 540.30,
            peRatio: 19.2,
            pbRatio: 3.10,
            roe: 17.5,
            roce: 18.2,
            eps: 87.25,
            dividendYield: 1.15,
            debtToEquity: 6.84, // High due to banking model
            freeCashFlow: "22,400 Cr",
            holdings: {
                promoter: 0.00, // No promoter holding post-merger
                fii: 52.30,
                dii: 30.60,
                retail: 17.10
            },
            quarterlyResults: [
                { quarter: "Q4 FY24", sales: 74200, netProfit: 16511 },
                { quarter: "Q3 FY24", sales: 71700, netProfit: 16372 },
                { quarter: "Q2 FY24", sales: 68100, netProfit: 15976 },
                { quarter: "Q1 FY24", sales: 57800, netProfit: 11952 }
            ],
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 757 },
                    { item: "Reserves & Surplus", value: 412500 },
                    { item: "Deposits", value: 2380000 },
                    { item: "Borrowings & Other", value: 345000 }
                ],
                assets: [
                    { item: "Cash & Balances", value: 185000 },
                    { item: "Investments", value: 680000 },
                    { item: "Advances (Loans)", value: 2480000 },
                    { item: "Other Assets", value: 93257 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: 271500, profit: 60811 },
                { year: "FY23", revenue: 192230, profit: 44108 },
                { year: "FY22", revenue: 157260, profit: 36961 }
            ],
            cashFlow: {
                operating: 48900,
                investing: -12000,
                financing: -32000,
                netChange: 4900
            },
            corporateActions: {
                dividends: [
                    { date: "10-May-2024", type: "Final", amount: "₹19.50" },
                    { date: "16-May-2023", type: "Final", amount: "₹19.00" }
                ],
                bonus: [
                    { date: "None", ratio: "N/A" }
                ],
                splits: [
                    { date: "19-Sep-2019", ratio: "2:1" }
                ]
            },
            news: [
                { date: "Yesterday", title: "HDFC Bank core net interest margin stabilizes at 3.4%", sentiment: "Bullish" },
                { date: "Last week", title: "FII holding in HDFC bank declines slightly to 52.3%", sentiment: "Neutral" }
            ],
            peers: [
                { name: "ICICI Bank", price: 1180.20, pe: 18.2, marketCap: "8,28,000 Cr" },
                { name: "Axis Bank", price: 1220.45, pe: 15.6, marketCap: "3,75,000 Cr" }
            ],
            aiScore: {
                targetPrice: "₹1,950",
                riskScore: "Low (1.5/5)",
                investmentScore: "90/100 (Strong Buy)",
                esgScore: "85/100",
                dna: {
                    growth: 82,
                    valuation: 88,
                    profitability: 90,
                    stability: 98,
                    risk: 15,
                    governance: 96
                },
                analysis: "Post-merger synergies are starting to play out for HDFC Bank. The loan book expansion combined with deposit growth is outpacing private banking peers. Its valuations are historically cheap at a forward PE of 16x. An absolute fortress investment for long-term compounders."
            }
        },
        "INFY": {
            symbol: "INFY",
            name: "Infosys Limited",
            logo: "https://companieslogo.com/img/orig/INFY_BIG-37604fdf.png?t=1651475141",
            industry: "IT Services",
            sector: "Technology - IT Consulting & Software",
            ceo: "Salil Parekh",
            price: 1041.20,
            prevClose: 1058.60,
            change: -17.40,
            changePercent: -1.64,
            volume: 3824000,
            marketCap: "6,39,120 Cr",
            faceValue: 5,
            bookValue: 198.40,
            peRatio: 24.2,
            pbRatio: 7.76,
            roe: 30.2,
            roce: 38.5,
            eps: 63.60,
            dividendYield: 2.45,
            debtToEquity: 0.08,
            freeCashFlow: "21,500 Cr",
            holdings: {
                promoter: 14.80,
                fii: 33.40,
                dii: 35.20,
                retail: 16.60
            },
            quarterlyResults: [
                { quarter: "Q4 FY24", sales: 37923, netProfit: 7969 },
                { quarter: "Q3 FY24", sales: 38821, netProfit: 6106 },
                { quarter: "Q2 FY24", sales: 38994, netProfit: 6212 },
                { quarter: "Q1 FY24", sales: 37933, netProfit: 5945 }
            ],
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 2075 },
                    { item: "Reserves & Surplus", value: 81400 },
                    { item: "Long Term Debt", value: 6500 },
                    { item: "Other Liabilities", value: 18500 }
                ],
                assets: [
                    { item: "Fixed Assets", value: 34120 },
                    { item: "Investments", value: 24200 },
                    { item: "Cash Equivalents", value: 16400 },
                    { item: "Other Assets", value: 33755 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: 153670, profit: 26232 },
                { year: "FY23", revenue: 146767, profit: 24095 },
                { year: "FY22", revenue: 121641, profit: 22110 }
            ],
            cashFlow: {
                operating: 25400,
                investing: -8000,
                financing: -16400,
                netChange: 1000
            },
            corporateActions: {
                dividends: [
                    { date: "31-May-2024", type: "Final", amount: "₹20.00" },
                    { date: "27-Oct-2023", type: "Interim", amount: "₹18.00" }
                ],
                bonus: [
                    { date: "04-Sep-2018", ratio: "1:1" }
                ],
                splits: [
                    { date: "02-Jul-1999", ratio: "2:1" }
                ]
            },
            news: [
                { date: "Last week", title: "Infosys signs multi-million dollar AI automation deal with global retail giant", sentiment: "Bullish" },
                { date: "2 weeks ago", title: "Attrition rate drops further to 12.6% in Infosys", sentiment: "Bullish" }
            ],
            peers: [
                { name: "TCS", price: 3850.50, pe: 28.1, marketCap: "14,02,000 Cr" },
                { name: "Wipro", price: 485.60, pe: 21.4, marketCap: "2,53,000 Cr" }
            ],
            aiScore: {
                targetPrice: "₹1,780",
                riskScore: "Low (2.0/5)",
                investmentScore: "78/100 (Hold/Buy)",
                esgScore: "92/100",
                dna: {
                    growth: 65,
                    valuation: 68,
                    profitability: 95,
                    stability: 90,
                    risk: 25,
                    governance: 98
                },
                analysis: "Infosys is experiencing slower discretionary spend from US banking and tech clients, leading to single-digit revenue growth guides. However, high margins, massive free cash flows, zero debt, and their rising Generative AI capabilities (Infosys Topaz) protect downside. High dividend yield provides a strong valuation floor."
            }
        },
        "ITC": {
            symbol: "ITC",
            name: "ITC Limited",
            logo: "https://companieslogo.com/img/orig/ITC.NS-59929226.png?t=1602766861",
            industry: "Cigarettes, FMCG, Hotels",
            sector: "FMCG - Cigarettes",
            ceo: "Sanjiv Puri",
            price: 290.00,
            prevClose: 288.40,
            change: 1.60,
            changePercent: 0.55,
            volume: 6150000,
            marketCap: "5,38,400 Cr",
            faceValue: 1,
            bookValue: 62.40,
            peRatio: 26.1,
            pbRatio: 6.92,
            roe: 27.6,
            roce: 36.8,
            eps: 16.55,
            dividendYield: 3.18,
            debtToEquity: 0.00,
            freeCashFlow: "16,800 Cr",
            holdings: {
                promoter: 0.00, // No promoter, institutional-led
                fii: 43.10,
                dii: 42.20,
                retail: 14.70
            },
            quarterlyResults: [
                { quarter: "Q4 FY24", sales: 17540, netProfit: 5020 },
                { quarter: "Q3 FY24", sales: 17200, netProfit: 5088 },
                { quarter: "Q2 FY24", sales: 16850, netProfit: 4927 },
                { quarter: "Q1 FY24", sales: 16100, netProfit: 4902 }
            ],
            balanceSheet: {
                liabilities: [
                    { item: "Share Capital", value: 1248 },
                    { item: "Reserves & Surplus", value: 76500 },
                    { item: "Long Term Debt", value: 0 },
                    { item: "Other Liabilities", value: 8500 }
                ],
                assets: [
                    { item: "Fixed Assets", value: 28400 },
                    { item: "Investments", value: 31200 },
                    { item: "Cash Equivalents", value: 12400 },
                    { item: "Other Assets", value: 14248 }
                ]
            },
            profitAndLoss: [
                { year: "FY24", revenue: 69400, profit: 20422 },
                { year: "FY23", revenue: 67100, profit: 18753 },
                { year: "FY22", revenue: 59100, profit: 15058 }
            ],
            cashFlow: {
                operating: 18900,
                investing: -4200,
                financing: -14500,
                netChange: 200
            },
            corporateActions: {
                dividends: [
                    { date: "04-Jun-2024", type: "Final", amount: "₹7.50" },
                    { date: "08-Feb-2024", type: "Interim", amount: "₹6.25" }
                ],
                bonus: [
                    { date: "04-Jul-2016", ratio: "1:2" }
                ],
                splits: [
                    { date: "28-Sep-2005", ratio: "10:1" }
                ]
            },
            news: [
                { date: "Yesterday", title: "ITC demerger of hotel business on track, gets shareholder approval", sentiment: "Bullish" },
                { date: "3 days ago", title: "FMCG margins expand as raw material inflation eases", sentiment: "Bullish" }
            ],
            peers: [
                { name: "HUL", price: 2480.00, pe: 54.2, marketCap: "5,82,000 Cr" },
                { name: "Nestle India", price: 2510.00, pe: 72.8, marketCap: "2,42,000 Cr" }
            ],
            aiScore: {
                targetPrice: "₹490",
                riskScore: "Low (1.2/5)",
                investmentScore: "85/100 (Buy)",
                esgScore: "89/100",
                dna: {
                    growth: 70,
                    valuation: 80,
                    profitability: 95,
                    stability: 98,
                    risk: 10,
                    governance: 95
                },
                analysis: "ITC represents a premier defensive business with a high dividend payload. The upcoming hotel division spin-off will unlock substantial capital. Strong volume performance in cigarettes, alongside consistent scaling in FMCG margins, positions it beautifully as a low-volatility compounder."
            }
        }
    },

    // 2. Extra Simplified Stocks for Screener/Search Lists
    allStocksList: [
        { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', price: 353.20, prevClose: 349.70, changePercent: 1.00, pe: 18.5, roe: 28.4, marketCap: '1,29,800 Cr', high52w: 520.00, low52w: 310.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'RELIANCE', name: 'Reliance Industries Ltd.', price: 1318.10, prevClose: 1325.40, changePercent: -0.55, pe: 26.8, roe: 9.8, marketCap: '17,83,000 Cr', high52w: 1609.00, low52w: 1115.00, cap: 'Large', sector: 'Energy' },
        { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', price: 796.30, prevClose: 788.50, changePercent: 0.99, pe: 19.2, roe: 17.5, marketCap: '12,14,000 Cr', high52w: 940.00, low52w: 680.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'INFY', name: 'Infosys Ltd.', price: 1041.20, prevClose: 1058.60, changePercent: -1.64, pe: 24.2, roe: 30.2, marketCap: '4,32,000 Cr', high52w: 1520.00, low52w: 920.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'ITC', name: 'ITC Ltd.', price: 290.00, prevClose: 288.40, changePercent: 0.55, pe: 26.1, roe: 27.6, marketCap: '3,62,000 Cr', high52w: 345.00, low52w: 260.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'ICICIBANK', name: 'ICICI Bank Ltd.', price: 1387.50, prevClose: 1373.60, changePercent: 1.01, pe: 18.2, roe: 18.5, marketCap: '9,78,000 Cr', high52w: 1520.00, low52w: 1050.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'SBIN', name: 'State Bank of India', price: 1045.40, prevClose: 1034.60, changePercent: 1.04, pe: 10.4, roe: 16.8, marketCap: '9,34,000 Cr', high52w: 1190.00, low52w: 750.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'KOTAKBANK', name: 'Kotak Mahindra Bank Ltd.', price: 409.00, prevClose: 405.95, changePercent: 0.75, pe: 19.5, roe: 14.2, marketCap: '4,08,000 Cr', high52w: 480.00, low52w: 350.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'AXISBANK', name: 'Axis Bank Ltd.', price: 1377.20, prevClose: 1384.50, changePercent: -0.53, pe: 15.6, roe: 16.1, marketCap: '4,28,000 Cr', high52w: 1510.00, low52w: 1040.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd.', price: 980.40, prevClose: 990.90, changePercent: -1.06, pe: 32.4, roe: 22.8, marketCap: '6,05,000 Cr', high52w: 1130.00, low52w: 780.00, cap: 'Large', sector: 'NBFC' },
        { symbol: 'BAJAJFINSV', name: 'Bajaj Finserv Ltd.', price: 1764.60, prevClose: 1748.20, changePercent: 0.94, pe: 28.1, roe: 14.5, marketCap: '2,82,000 Cr', high52w: 2080.00, low52w: 1480.00, cap: 'Large', sector: 'NBFC' },
        { symbol: 'CHOLAFIN', name: 'Cholamandalam Investment', price: 1210.50, prevClose: 1215.35, changePercent: -0.40, pe: 25.4, roe: 19.2, marketCap: '1,00,000 Cr', high52w: 1652.00, low52w: 1011.40, cap: 'Large', sector: 'NBFC' },
        { symbol: 'MUTHOOTFIN', name: 'Muthoot Finance Ltd.', price: 1740.00, prevClose: 1734.80, changePercent: 0.30, pe: 14.2, roe: 18.1, marketCap: '70,000 Cr', high52w: 2050.00, low52w: 1260.00, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'TCS', name: 'Tata Consultancy Services Ltd.', price: 2096.90, prevClose: 2078.40, changePercent: 0.89, pe: 28.1, roe: 39.1, marketCap: '7,58,000 Cr', high52w: 2580.00, low52w: 1740.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'HCLTECH', name: 'HCL Technologies Ltd.', price: 1100.70, prevClose: 1092.40, changePercent: 0.76, pe: 22.4, roe: 28.2, marketCap: '2,99,000 Cr', high52w: 1360.00, low52w: 880.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'WIPRO', name: 'Wipro Ltd.', price: 175.00, prevClose: 176.40, changePercent: -0.79, pe: 21.4, roe: 15.6, marketCap: '1,83,000 Cr', high52w: 210.00, low52w: 140.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'TECHM', name: 'Tech Mahindra Ltd.', price: 1437.10, prevClose: 1420.50, changePercent: 1.17, pe: 25.8, roe: 18.4, marketCap: '1,40,000 Cr', high52w: 1680.00, low52w: 1100.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'LTIM', name: 'LTIMindtree Ltd.', price: 3762.60, prevClose: 3804.20, changePercent: -1.09, pe: 30.5, roe: 26.4, marketCap: '1,12,000 Cr', high52w: 4500.00, low52w: 3100.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'TATAELXSI', name: 'Tata Elxsi Ltd.', price: 7210.00, prevClose: 7378.50, changePercent: -2.30, pe: 58.2, roe: 35.8, marketCap: '44,800 Cr', high52w: 9614.00, low52w: 6008.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'M&M', name: 'Mahindra & Mahindra Ltd.', price: 3182.20, prevClose: 3148.50, changePercent: 1.07, pe: 24.3, roe: 19.5, marketCap: '3,96,000 Cr', high52w: 3680.00, low52w: 2400.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'MARUTI', name: 'Maruti Suzuki India Ltd.', price: 13745.00, prevClose: 13680.40, changePercent: 0.47, pe: 29.5, roe: 14.2, marketCap: '4,32,000 Cr', high52w: 15200.00, low52w: 11500.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'BAJAJ-AUTO', name: 'Bajaj Auto Ltd.', price: 9843.00, prevClose: 9902.40, changePercent: -0.60, pe: 28.4, roe: 25.1, marketCap: '2,76,000 Cr', high52w: 11500.00, low52w: 8200.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'EICHERMOT', name: 'Eicher Motors Ltd.', price: 7598.00, prevClose: 7508.40, changePercent: 1.19, pe: 26.5, roe: 21.8, marketCap: '2,08,000 Cr', high52w: 8600.00, low52w: 5800.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'TVSMOTOR', name: 'TVS Motor Company Ltd.', price: 2120.40, prevClose: 2069.70, changePercent: 2.50, pe: 42.1, roe: 28.5, marketCap: '1,00,000 Cr', high52w: 2958.15, low52w: 1656.00, cap: 'Large', sector: 'Automobile' },
        { symbol: 'MOTHERSON', name: 'Samvardhana Motherson', price: 145.20, prevClose: 142.62, changePercent: 1.80, pe: 35.4, roe: 12.5, marketCap: '50,000 Cr', high52w: 221.00, low52w: 120.05, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'HINDUNILVR', name: 'Hindustan Unilever Ltd.', price: 2174.20, prevClose: 2178.50, changePercent: -0.20, pe: 54.2, roe: 20.4, marketCap: '5,11,000 Cr', high52w: 2600.00, low52w: 1980.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'NESTLEIND', name: 'Nestle India Ltd.', price: 1402.60, prevClose: 1400.50, changePercent: 0.15, pe: 72.8, roe: 108.5, marketCap: '1,35,000 Cr', high52w: 1680.00, low52w: 1200.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'BRITANNIA', name: 'Britannia Industries Ltd.', price: 5237.00, prevClose: 5164.60, changePercent: 1.40, pe: 52.4, roe: 55.2, marketCap: '1,26,000 Cr', high52w: 6200.00, low52w: 4500.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'TATACONSUM', name: 'Tata Consumer Products', price: 1120.20, prevClose: 1125.82, changePercent: -0.50, pe: 65.2, roe: 8.4, marketCap: '1,10,000 Cr', high52w: 1282.00, low52w: 924.25, cap: 'Large', sector: 'FMCG' },
        { symbol: 'ASIANPAINT', name: 'Asian Paints Ltd.', price: 2645.20, prevClose: 2624.10, changePercent: 0.80, pe: 55.4, roe: 28.5, marketCap: '2,54,000 Cr', high52w: 3100.00, low52w: 2200.00, cap: 'Large', sector: 'Consumer Durables' },
        { symbol: 'TITAN', name: 'Titan Company Ltd.', price: 4291.30, prevClose: 4312.80, changePercent: -0.50, pe: 78.4, roe: 31, marketCap: '3,81,000 Cr', high52w: 4950.00, low52w: 3500.00, cap: 'Large', sector: 'Consumer Durables' },
        { symbol: 'LT', name: 'Larsen & Toubro Ltd.', price: 4216.40, prevClose: 4254.50, changePercent: -0.90, pe: 32.5, roe: 14.2, marketCap: '5,80,000 Cr', high52w: 4900.00, low52w: 3500.00, cap: 'Large', sector: 'Infrastructure' },
        { symbol: 'ULTRACEMCO', name: 'UltraTech Cement Ltd.', price: 11489.00, prevClose: 11352.50, changePercent: 1.20, pe: 42.5, roe: 12.8, marketCap: '3,32,000 Cr', high52w: 13200.00, low52w: 9500.00, cap: 'Large', sector: 'Cement' },
        { symbol: 'GRASIM', name: 'Grasim Industries Ltd.', price: 2420.50, prevClose: 2408.40, changePercent: 0.50, pe: 28.4, roe: 11.2, marketCap: '1,59,000 Cr', high52w: 2849.00, low52w: 1855.00, cap: 'Large', sector: 'Cement' },
        { symbol: 'AMBUJACEM', name: 'Ambuja Cements Ltd.', price: 640.20, prevClose: 626.70, changePercent: 2.10, pe: 38.4, roe: 9.5, marketCap: '1,28,000 Cr', high52w: 736.25, low52w: 484.00, cap: 'Large', sector: 'Cement' },
        { symbol: 'DLF', name: 'DLF Ltd.', price: 621.35, prevClose: 600.34, changePercent: 3.50, pe: 65.2, roe: 7.2, marketCap: '1,54,000 Cr', high52w: 780.00, low52w: 520.00, cap: 'Large', sector: 'Real Estate' },
        { symbol: 'GODREJPROP', name: 'Godrej Properties Ltd.', price: 2840.50, prevClose: 2875.00, changePercent: -1.20, pe: 85.4, roe: 6.8, marketCap: '79,000 Cr', high52w: 3409.00, low52w: 1875.55, cap: 'Large', sector: 'Real Estate' },
        { symbol: 'SUNPHARMA', name: 'Sun Pharmaceutical Inds.', price: 1862.80, prevClose: 1835.20, changePercent: 1.50, pe: 32.4, roe: 15.2, marketCap: '4,47,000 Cr', high52w: 2200.00, low52w: 1480.00, cap: 'Large', sector: 'Pharmaceuticals' },
        { symbol: 'CIPLA', name: 'Cipla Ltd.', price: 1440.10, prevClose: 1445.90, changePercent: -0.40, pe: 28.5, roe: 14.8, marketCap: '1,16,000 Cr', high52w: 1700.00, low52w: 1150.00, cap: 'Large', sector: 'Pharmaceuticals' },
        { symbol: 'DRREDDY', name: 'Dr. Reddys Laboratories', price: 1350.50, prevClose: 1322.70, changePercent: 2.10, pe: 22.4, roe: 18.5, marketCap: '1,12,800 Cr', high52w: 1580.00, low52w: 1080.00, cap: 'Large', sector: 'Pharmaceuticals' },
        { symbol: 'DIVISLAB', name: 'Divi\'s Laboratories Ltd.', price: 4210.80, prevClose: 4275.13, changePercent: -1.50, pe: 52.4, roe: 16.2, marketCap: '1,11,800 Cr', high52w: 5336.00, low52w: 3350.00, cap: 'Large', sector: 'Pharmaceuticals' },
        { symbol: 'APOLLOHOSP', name: 'Apollo Hospitals Ent.', price: 5920.40, prevClose: 5872.80, changePercent: 0.80, pe: 82.5, roe: 12.4, marketCap: '85,000 Cr', high52w: 7545.00, low52w: 5100.00, cap: 'Large', sector: 'Healthcare' },
        { symbol: 'ONGC', name: 'Oil & Natural Gas Corp.', price: 233.10, prevClose: 230.30, changePercent: 1.22, pe: 8.2, roe: 14.5, marketCap: '2,93,000 Cr', high52w: 290.00, low52w: 180.00, cap: 'Large', sector: 'Energy' },
        { symbol: 'NTPC', name: 'NTPC Ltd.', price: 352.05, prevClose: 353.80, changePercent: -0.49, pe: 14.5, roe: 12.8, marketCap: '3,42,000 Cr', high52w: 420.00, low52w: 275.00, cap: 'Large', sector: 'Energy' },
        { symbol: 'POWERGRID', name: 'Power Grid Corp of India', price: 284.50, prevClose: 282.24, changePercent: 0.80, pe: 12.4, roe: 18.2, marketCap: '2,64,000 Cr', high52w: 340.00, low52w: 220.00, cap: 'Large', sector: 'Energy' },
        { symbol: 'TATASTEEL', name: 'Tata Steel Ltd.', price: 188.71, prevClose: 191.10, changePercent: -1.25, pe: 15.2, roe: 8.5, marketCap: '2,36,000 Cr', high52w: 220.00, low52w: 140.00, cap: 'Large', sector: 'Metals' },
        { symbol: 'HINDALCO', name: 'Hindalco Industries Ltd.', price: 953.20, prevClose: 930.82, changePercent: 2.40, pe: 14.8, roe: 11.5, marketCap: '2,14,000 Cr', high52w: 1100.00, low52w: 700.00, cap: 'Large', sector: 'Metals' },
        { symbol: 'JSWSTEEL', name: 'JSW Steel Ltd.', price: 1231.00, prevClose: 1240.95, changePercent: -0.80, pe: 18.5, roe: 14.2, marketCap: '2,98,000 Cr', high52w: 1450.00, low52w: 950.00, cap: 'Large', sector: 'Metals' },
        { symbol: 'COALINDIA', name: 'Coal India Ltd.', price: 435.40, prevClose: 432.36, changePercent: 0.70, pe: 11.4, roe: 45.2, marketCap: '2,68,000 Cr', high52w: 520.00, low52w: 350.00, cap: 'Large', sector: 'Mining' },
        { symbol: 'ADANIENT', name: 'Adani Enterprises Ltd.', price: 3038.00, prevClose: 2915.75, changePercent: 4.19, pe: 95.4, roe: 10.2, marketCap: '3,46,000 Cr', high52w: 3700.00, low52w: 2100.00, cap: 'Large', sector: 'Conglomerate' },
        { symbol: 'ADANIPORTS', name: 'Adani Ports & SEZ Ltd.', price: 1796.00, prevClose: 1747.09, changePercent: 2.80, pe: 35.2, roe: 14.8, marketCap: '3,88,000 Cr', high52w: 2100.00, low52w: 1300.00, cap: 'Large', sector: 'Infrastructure' },
        { symbol: 'ADANIGREEN', name: 'Adani Green Energy Ltd.', price: 1840.20, prevClose: 1752.57, changePercent: 5.00, pe: 120.4, roe: 12.5, marketCap: '2,91,000 Cr', high52w: 2174.00, low52w: 879.00, cap: 'Large', sector: 'Energy' },
        { symbol: 'ADANIPOWER', name: 'Adani Power Ltd.', price: 720.40, prevClose: 709.75, changePercent: 1.50, pe: 12.8, roe: 35.4, marketCap: '2,78,000 Cr', high52w: 900.00, low52w: 421.90, cap: 'Large', sector: 'Energy' },
        { symbol: 'ZOMATO', name: 'Zomato (Eternal) Ltd.', price: 255.15, prevClose: 246.62, changePercent: 3.46, pe: 120.4, roe: 4.2, marketCap: '2,47,000 Cr', high52w: 310.00, low52w: 170.00, cap: 'Large', sector: 'Internet' },
        { symbol: 'PAYTM', name: 'One97 Communications', price: 410.50, prevClose: 428.49, changePercent: -4.20, pe: 0, roe: -12.4, marketCap: '26,000 Cr', high52w: 998.30, low52w: 310.00, cap: 'Mid', sector: 'Fintech' },
        { symbol: 'JIOFIN', name: 'Jio Financial Services', price: 350.20, prevClose: 346.00, changePercent: 1.20, pe: 85.4, roe: 2.4, marketCap: '2,22,000 Cr', high52w: 394.70, low52w: 215.70, cap: 'Large', sector: 'NBFC' },
        { symbol: 'BHARTIARTL', name: 'Bharti Airtel Ltd.', price: 1850.70, prevClose: 1829.50, changePercent: 1.16, pe: 54.3, roe: 12.4, marketCap: '10,98,000 Cr', high52w: 2200.00, low52w: 1500.00, cap: 'Large', sector: 'Telecom' },
        { symbol: 'IRCTC', name: 'Indian Railway Catering', price: 1010.50, prevClose: 1030.42, changePercent: -1.95, pe: 65.2, roe: 44.5, marketCap: '81,000 Cr', high52w: 1110.00, low52w: 714.00, cap: 'Mid', sector: 'Railways' },
        { symbol: 'CDSL', name: 'Central Depository Services', price: 2150.00, prevClose: 2041.84, changePercent: 5.20, pe: 55.4, roe: 31.5, marketCap: '22,500 Cr', high52w: 2392.00, low52w: 1021.40, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'BSE', name: 'BSE Limited', price: 2540.25, prevClose: 2378.60, changePercent: 6.80, pe: 45.8, roe: 22.4, marketCap: '34,500 Cr', high52w: 2973.00, low52w: 638.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'HAL', name: 'Hindustan Aeronautics Ltd.', price: 4368.70, prevClose: 4168.56, changePercent: 4.80, pe: 42.1, roe: 26.4, marketCap: '2,92,000 Cr', high52w: 5200.00, low52w: 3400.00, cap: 'Large', sector: 'Defense' },
        { symbol: 'BEL', name: 'Bharat Electronics Ltd.', price: 407.20, prevClose: 398.84, changePercent: 2.10, pe: 45.2, roe: 24.5, marketCap: '2,98,000 Cr', high52w: 480.00, low52w: 280.00, cap: 'Large', sector: 'Defense' },
        { symbol: 'AUROPHARMA', name: 'Aurobindo Pharma Ltd.', price: 1180.40, prevClose: 1172.30, changePercent: 0.69, pe: 18.5, roe: 12.6, marketCap: '69,000 Cr', high52w: 1592.00, low52w: 960.00, cap: 'Large', sector: 'Pharma' },
        { symbol: 'BIOCON', name: 'Biocon Ltd.', price: 340.50, prevClose: 345.20, changePercent: -1.36, pe: 38.2, roe: 8.5, marketCap: '41,000 Cr', high52w: 442.00, low52w: 236.70, cap: 'Large', sector: 'Pharma' },
        { symbol: 'LUPIN', name: 'Lupin Ltd.', price: 1780.60, prevClose: 1755.20, changePercent: 1.45, pe: 28.5, roe: 14.8, marketCap: '81,000 Cr', high52w: 2302.00, low52w: 1180.00, cap: 'Large', sector: 'Pharma' },
        { symbol: 'TORNTPHARM', name: 'Torrent Pharmaceuticals Ltd.', price: 3250.00, prevClose: 3220.40, changePercent: 0.92, pe: 52.1, roe: 28.5, marketCap: '1,10,000 Cr', high52w: 3842.80, low52w: 2360.00, cap: 'Large', sector: 'Pharma' },
        { symbol: 'ALKEM', name: 'Alkem Laboratories Ltd.', price: 5640.25, prevClose: 5580.10, changePercent: 1.08, pe: 26.8, roe: 18.2, marketCap: '67,000 Cr', high52w: 6590.00, low52w: 4295.00, cap: 'Large', sector: 'Pharma' },
        { symbol: 'LAURUSLABS', name: 'Laurus Labs Ltd.', price: 520.40, prevClose: 528.10, changePercent: -1.46, pe: 35.2, roe: 12.4, marketCap: '28,000 Cr', high52w: 682.00, low52w: 345.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'GLENMARK', name: 'Glenmark Pharmaceuticals', price: 1450.20, prevClose: 1435.60, changePercent: 1.02, pe: 18.4, roe: 14.5, marketCap: '41,000 Cr', high52w: 1830.00, low52w: 730.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'IPCALAB', name: 'IPCA Laboratories Ltd.', price: 1320.50, prevClose: 1304.80, changePercent: 1.20, pe: 32.5, roe: 13.8, marketCap: '33,500 Cr', high52w: 1665.00, low52w: 985.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'FORTIS', name: 'Fortis Healthcare Ltd.', price: 520.30, prevClose: 515.80, changePercent: 0.87, pe: 55.2, roe: 10.5, marketCap: '39,000 Cr', high52w: 686.75, low52w: 364.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'MAXHEALTH', name: 'Max Healthcare Institute', price: 880.50, prevClose: 870.20, changePercent: 1.18, pe: 68.4, roe: 14.2, marketCap: '85,500 Cr', high52w: 1060.00, low52w: 545.00, cap: 'Large', sector: 'Healthcare' },
        { symbol: 'VEDL', name: 'Vedanta Ltd.', price: 450.20, prevClose: 442.10, changePercent: 1.83, pe: 8.5, roe: 24.5, marketCap: '1,67,000 Cr', high52w: 528.00, low52w: 208.25, cap: 'Large', sector: 'Metals' },
        { symbol: 'NMDC', name: 'NMDC Ltd.', price: 225.40, prevClose: 220.50, changePercent: 2.22, pe: 9.5, roe: 22.5, marketCap: '66,000 Cr', high52w: 286.35, low52w: 180.50, cap: 'Large', sector: 'Mining' },
        { symbol: 'NATIONALUM', name: 'National Aluminium Company', price: 175.20, prevClose: 172.80, changePercent: 1.39, pe: 12.4, roe: 18.2, marketCap: '32,000 Cr', high52w: 262.00, low52w: 92.50, cap: 'Mid', sector: 'Metals' },
        { symbol: 'SAIL', name: 'Steel Authority of India', price: 130.50, prevClose: 128.80, changePercent: 1.32, pe: 14.5, roe: 8.5, marketCap: '54,000 Cr', high52w: 175.35, low52w: 95.10, cap: 'Large', sector: 'Metals' },
        { symbol: 'SHREECEM', name: 'Shree Cement Ltd.', price: 27150.00, prevClose: 27020.50, changePercent: 0.48, pe: 42.5, roe: 12.8, marketCap: '97,800 Cr', high52w: 29400.00, low52w: 23900.00, cap: 'Large', sector: 'Cement' },
        { symbol: 'ACC', name: 'ACC Ltd.', price: 2420.30, prevClose: 2395.50, changePercent: 1.04, pe: 24.8, roe: 12.4, marketCap: '45,500 Cr', high52w: 2844.00, low52w: 1820.00, cap: 'Large', sector: 'Cement' },
        { symbol: 'DALBHARAT', name: 'Dalmia Bharat Ltd.', price: 1820.50, prevClose: 1805.20, changePercent: 0.85, pe: 28.4, roe: 8.5, marketCap: '34,200 Cr', high52w: 2520.00, low52w: 1590.00, cap: 'Mid', sector: 'Cement' },
        { symbol: 'RAMCOCEM', name: 'The Ramco Cements Ltd.', price: 910.40, prevClose: 898.50, changePercent: 1.33, pe: 32.8, roe: 9.8, marketCap: '21,500 Cr', high52w: 1120.00, low52w: 740.00, cap: 'Mid', sector: 'Cement' },
        { symbol: 'BPCL', name: 'Bharat Petroleum Corp Ltd.', price: 620.40, prevClose: 612.50, changePercent: 1.29, pe: 4.5, roe: 32.4, marketCap: '1,35,000 Cr', high52w: 720.00, low52w: 370.80, cap: 'Large', sector: 'Oil & Gas' },
        { symbol: 'IOC', name: 'Indian Oil Corporation Ltd.', price: 165.20, prevClose: 162.80, changePercent: 1.47, pe: 4.2, roe: 18.5, marketCap: '2,33,000 Cr', high52w: 196.80, low52w: 115.00, cap: 'Large', sector: 'Oil & Gas' },
        { symbol: 'GAIL', name: 'GAIL (India) Ltd.', price: 195.40, prevClose: 192.60, changePercent: 1.45, pe: 12.5, roe: 14.8, marketCap: '1,28,000 Cr', high52w: 246.30, low52w: 120.65, cap: 'Large', sector: 'Oil & Gas' },
        { symbol: 'PETRONET', name: 'Petronet LNG Ltd.', price: 340.20, prevClose: 336.80, changePercent: 1.01, pe: 14.8, roe: 20.5, marketCap: '51,000 Cr', high52w: 392.00, low52w: 218.00, cap: 'Large', sector: 'Oil & Gas' },
        { symbol: 'HINDPETRO', name: 'Hindustan Petroleum Corp.', price: 410.50, prevClose: 405.20, changePercent: 1.31, pe: 3.8, roe: 28.5, marketCap: '58,000 Cr', high52w: 480.00, low52w: 225.00, cap: 'Large', sector: 'Oil & Gas' },
        { symbol: 'TATAPOWER', name: 'Tata Power Company Ltd.', price: 420.50, prevClose: 414.80, changePercent: 1.37, pe: 42.5, roe: 10.5, marketCap: '1,34,000 Cr', high52w: 490.00, low52w: 268.00, cap: 'Large', sector: 'Power' },
        { symbol: 'NHPC', name: 'NHPC Ltd.', price: 92.40, prevClose: 90.80, changePercent: 1.76, pe: 24.5, roe: 12.2, marketCap: '92,800 Cr', high52w: 118.45, low52w: 51.50, cap: 'Large', sector: 'Power' },
        { symbol: 'SJVN', name: 'SJVN Ltd.', price: 118.50, prevClose: 116.20, changePercent: 1.98, pe: 42.5, roe: 8.4, marketCap: '46,500 Cr', high52w: 168.00, low52w: 62.00, cap: 'Mid', sector: 'Power' },
        { symbol: 'RECLTD', name: 'REC Ltd.', price: 520.40, prevClose: 512.80, changePercent: 1.48, pe: 8.5, roe: 18.5, marketCap: '1,37,000 Cr', high52w: 654.00, low52w: 257.00, cap: 'Large', sector: 'Power' },
        { symbol: 'PFC', name: 'Power Finance Corporation', price: 440.20, prevClose: 434.50, changePercent: 1.31, pe: 6.8, roe: 18.2, marketCap: '1,45,000 Cr', high52w: 580.00, low52w: 228.60, cap: 'Large', sector: 'Power' },
        { symbol: 'IREDA', name: 'Indian Renewable Energy Dev.', price: 225.40, prevClose: 220.10, changePercent: 2.41, pe: 42.5, roe: 14.2, marketCap: '60,500 Cr', high52w: 310.00, low52w: 50.00, cap: 'Mid', sector: 'Power' },
        { symbol: 'SBILIFE', name: 'SBI Life Insurance Company', price: 1620.50, prevClose: 1605.40, changePercent: 0.94, pe: 72.5, roe: 14.2, marketCap: '1,62,000 Cr', high52w: 1810.00, low52w: 1244.15, cap: 'Large', sector: 'Insurance' },
        { symbol: 'HDFCLIFE', name: 'HDFC Life Insurance Company', price: 680.40, prevClose: 674.20, changePercent: 0.92, pe: 85.4, roe: 10.5, marketCap: '1,46,000 Cr', high52w: 761.20, low52w: 511.00, cap: 'Large', sector: 'Insurance' },
        { symbol: 'ICICIPRULI', name: 'ICICI Prudential Life Insurance', price: 680.20, prevClose: 672.50, changePercent: 1.15, pe: 14.5, roe: 8.5, marketCap: '98,000 Cr', high52w: 792.00, low52w: 467.30, cap: 'Large', sector: 'Insurance' },
        { symbol: 'ICICIGI', name: 'ICICI Lombard General Insurance', price: 1840.50, prevClose: 1825.20, changePercent: 0.84, pe: 38.5, roe: 18.4, marketCap: '90,500 Cr', high52w: 2014.60, low52w: 1358.00, cap: 'Large', sector: 'Insurance' },
        { symbol: 'NIACL', name: 'New India Assurance Company', price: 245.20, prevClose: 242.80, changePercent: 0.99, pe: 15.2, roe: 8.5, marketCap: '40,400 Cr', high52w: 325.00, low52w: 135.05, cap: 'Mid', sector: 'Insurance' },
        { symbol: 'LICI', name: 'Life Insurance Corp of India', price: 980.40, prevClose: 972.20, changePercent: 0.84, pe: 12.5, roe: 45.2, marketCap: '6,20,000 Cr', high52w: 1222.00, low52w: 595.80, cap: 'Large', sector: 'Insurance' },
        { symbol: 'OBEROIRLTY', name: 'Oberoi Realty Ltd.', price: 1720.50, prevClose: 1705.40, changePercent: 0.89, pe: 25.4, roe: 14.5, marketCap: '62,600 Cr', high52w: 2241.95, low52w: 1085.00, cap: 'Large', sector: 'Real Estate' },
        { symbol: 'PHOENIXLTD', name: 'The Phoenix Mills Ltd.', price: 3450.20, prevClose: 3420.80, changePercent: 0.86, pe: 48.5, roe: 12.4, marketCap: '61,500 Cr', high52w: 4156.00, low52w: 1505.00, cap: 'Large', sector: 'Real Estate' },
        { symbol: 'BRIGADE', name: 'Brigade Enterprises Ltd.', price: 1180.40, prevClose: 1165.20, changePercent: 1.30, pe: 38.5, roe: 14.2, marketCap: '27,200 Cr', high52w: 1553.85, low52w: 570.00, cap: 'Mid', sector: 'Real Estate' },
        { symbol: 'PRESTIGE', name: 'Prestige Estates Projects', price: 1450.20, prevClose: 1435.60, changePercent: 1.02, pe: 42.5, roe: 10.5, marketCap: '58,200 Cr', high52w: 1825.00, low52w: 720.00, cap: 'Large', sector: 'Real Estate' },
        { symbol: 'SIEMENS', name: 'Siemens Ltd.', price: 5820.40, prevClose: 5780.20, changePercent: 0.70, pe: 85.4, roe: 15.2, marketCap: '2,07,000 Cr', high52w: 7485.00, low52w: 3562.00, cap: 'Large', sector: 'Infrastructure' },
        { symbol: 'ABB', name: 'ABB India Ltd.', price: 7250.20, prevClose: 7180.40, changePercent: 0.97, pe: 92.5, roe: 22.4, marketCap: '1,54,000 Cr', high52w: 8820.00, low52w: 3892.00, cap: 'Large', sector: 'Infrastructure' },
        { symbol: 'HAVELLS', name: 'Havells India Ltd.', price: 1620.50, prevClose: 1608.40, changePercent: 0.75, pe: 65.4, roe: 22.5, marketCap: '1,02,000 Cr', high52w: 1905.00, low52w: 1245.50, cap: 'Large', sector: 'Electricals' },
        { symbol: 'POLYCAB', name: 'Polycab India Ltd.', price: 5420.40, prevClose: 5380.20, changePercent: 0.75, pe: 42.5, roe: 22.4, marketCap: '81,300 Cr', high52w: 7605.00, low52w: 3980.00, cap: 'Large', sector: 'Electricals' },
        { symbol: 'VOLTAS', name: 'Voltas Ltd.', price: 1520.20, prevClose: 1505.40, changePercent: 0.98, pe: 55.4, roe: 10.5, marketCap: '50,300 Cr', high52w: 1945.00, low52w: 772.60, cap: 'Large', sector: 'Consumer Durables' },
        { symbol: 'CROMPTON', name: 'Crompton Greaves CGL', price: 385.40, prevClose: 380.20, changePercent: 1.37, pe: 42.5, roe: 18.4, marketCap: '24,500 Cr', high52w: 458.15, low52w: 265.00, cap: 'Mid', sector: 'Electricals' },
        { symbol: 'PIDILITIND', name: 'Pidilite Industries Ltd.', price: 2940.50, prevClose: 2920.40, changePercent: 0.69, pe: 72.5, roe: 28.4, marketCap: '1,49,000 Cr', high52w: 3414.00, low52w: 2410.00, cap: 'Large', sector: 'Chemicals' },
        { symbol: 'SRF', name: 'SRF Ltd.', price: 2340.20, prevClose: 2322.50, changePercent: 0.76, pe: 42.5, roe: 14.2, marketCap: '69,400 Cr', high52w: 2750.00, low52w: 2015.00, cap: 'Large', sector: 'Chemicals' },
        { symbol: 'ATUL', name: 'Atul Ltd.', price: 6850.40, prevClose: 6795.20, changePercent: 0.81, pe: 38.5, roe: 12.5, marketCap: '20,200 Cr', high52w: 8410.00, low52w: 5450.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'DEEPAKFERT', name: 'Deepak Fertilizers & Petro', price: 580.20, prevClose: 572.40, changePercent: 1.36, pe: 8.5, roe: 18.2, marketCap: '7,340 Cr', high52w: 820.00, low52w: 420.00, cap: 'Small', sector: 'Chemicals' },
        { symbol: 'CLEAN', name: 'Clean Science & Technology', price: 1380.50, prevClose: 1365.20, changePercent: 1.12, pe: 52.5, roe: 25.4, marketCap: '14,600 Cr', high52w: 1820.00, low52w: 1037.60, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'AARTIIND', name: 'Aarti Industries Ltd.', price: 580.40, prevClose: 575.20, changePercent: 0.90, pe: 35.4, roe: 12.5, marketCap: '21,000 Cr', high52w: 752.00, low52w: 487.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'UPL', name: 'UPL Ltd.', price: 540.20, prevClose: 535.80, changePercent: 0.82, pe: 18.5, roe: 8.4, marketCap: '40,600 Cr', high52w: 698.00, low52w: 434.10, cap: 'Large', sector: 'Chemicals' },
        { symbol: 'COLPAL', name: 'Colgate-Palmolive India', price: 2780.50, prevClose: 2762.40, changePercent: 0.66, pe: 52.4, roe: 82.5, marketCap: '75,600 Cr', high52w: 3150.00, low52w: 2240.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'MARICO', name: 'Marico Ltd.', price: 620.40, prevClose: 616.20, changePercent: 0.68, pe: 52.5, roe: 38.4, marketCap: '80,200 Cr', high52w: 725.00, low52w: 473.50, cap: 'Large', sector: 'FMCG' },
        { symbol: 'DABUR', name: 'Dabur India Ltd.', price: 580.20, prevClose: 576.40, changePercent: 0.66, pe: 55.4, roe: 22.5, marketCap: '1,03,000 Cr', high52w: 659.40, low52w: 499.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'GODREJCP', name: 'Godrej Consumer Products', price: 1340.50, prevClose: 1328.40, changePercent: 0.91, pe: 48.5, roe: 18.5, marketCap: '1,37,000 Cr', high52w: 1594.00, low52w: 1033.50, cap: 'Large', sector: 'FMCG' },
        { symbol: 'EMAMILTD', name: 'Emami Ltd.', price: 720.40, prevClose: 714.20, changePercent: 0.87, pe: 32.5, roe: 28.4, marketCap: '31,600 Cr', high52w: 830.50, low52w: 420.00, cap: 'Mid', sector: 'FMCG' },
        { symbol: 'PGHH', name: 'Procter & Gamble Hygiene', price: 15420.00, prevClose: 15350.40, changePercent: 0.45, pe: 72.5, roe: 75.4, marketCap: '50,100 Cr', high52w: 18290.00, low52w: 13575.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'VBL', name: 'Varun Beverages Ltd.', price: 1580.20, prevClose: 1565.40, changePercent: 0.95, pe: 72.5, roe: 25.4, marketCap: '2,05,000 Cr', high52w: 1702.55, low52w: 1110.00, cap: 'Large', sector: 'FMCG' },
        { symbol: 'IDEA', name: 'Vodafone Idea Ltd.', price: 14.20, prevClose: 13.85, changePercent: 2.53, pe: 0, roe: -35.4, marketCap: '69,500 Cr', high52w: 19.18, low52w: 6.60, cap: 'Large', sector: 'Telecom' },
        { symbol: 'TTML', name: 'Tata Teleservices Maharashtra', price: 82.40, prevClose: 80.50, changePercent: 2.36, pe: 0, roe: -12.5, marketCap: '16,200 Cr', high52w: 112.00, low52w: 52.00, cap: 'Small', sector: 'Telecom' },
        { symbol: 'ZEEL', name: 'Zee Entertainment Enterprises', price: 145.20, prevClose: 142.50, changePercent: 1.89, pe: 18.5, roe: 4.5, marketCap: '14,000 Cr', high52w: 298.50, low52w: 118.70, cap: 'Mid', sector: 'Media' },
        { symbol: 'PVR', name: 'PVR INOX Ltd.', price: 1540.50, prevClose: 1525.20, changePercent: 1.00, pe: 75.4, roe: 4.5, marketCap: '15,200 Cr', high52w: 1972.00, low52w: 1213.10, cap: 'Mid', sector: 'Media' },
        { symbol: 'SUNTV', name: 'Sun TV Network Ltd.', price: 720.40, prevClose: 714.80, changePercent: 0.78, pe: 18.5, roe: 28.5, marketCap: '28,400 Cr', high52w: 893.50, low52w: 524.20, cap: 'Mid', sector: 'Media' },
        { symbol: 'PAGEIND', name: 'Page Industries Ltd.', price: 42800.00, prevClose: 42500.40, changePercent: 0.71, pe: 72.5, roe: 42.5, marketCap: '47,700 Cr', high52w: 47415.00, low52w: 29500.00, cap: 'Large', sector: 'Textiles' },
        { symbol: 'TRENT', name: 'Trent Ltd.', price: 5420.50, prevClose: 5350.20, changePercent: 1.31, pe: 145.2, roe: 18.5, marketCap: '1,93,000 Cr', high52w: 7600.00, low52w: 2345.00, cap: 'Large', sector: 'Textiles' },
        { symbol: 'RAYMOND', name: 'Raymond Ltd.', price: 1620.40, prevClose: 1605.20, changePercent: 0.95, pe: 32.5, roe: 14.2, marketCap: '10,900 Cr', high52w: 3496.00, low52w: 1250.00, cap: 'Mid', sector: 'Textiles' },
        { symbol: 'PNB', name: 'Punjab National Bank', price: 115.20, prevClose: 113.40, changePercent: 1.59, pe: 10.5, roe: 8.5, marketCap: '1,27,000 Cr', high52w: 142.90, low52w: 65.70, cap: 'Large', sector: 'Banking' },
        { symbol: 'BANKBARODA', name: 'Bank of Baroda', price: 265.40, prevClose: 261.80, changePercent: 1.38, pe: 7.5, roe: 14.2, marketCap: '1,37,000 Cr', high52w: 299.70, low52w: 155.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'CANBK', name: 'Canara Bank', price: 110.20, prevClose: 108.40, changePercent: 1.66, pe: 5.8, roe: 15.4, marketCap: '1,00,000 Cr', high52w: 128.90, low52w: 62.50, cap: 'Large', sector: 'Banking' },
        { symbol: 'UNIONBANK', name: 'Union Bank of India', price: 130.50, prevClose: 128.40, changePercent: 1.64, pe: 6.5, roe: 14.8, marketCap: '89,000 Cr', high52w: 163.90, low52w: 72.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'INDIANB', name: 'Indian Bank', price: 540.20, prevClose: 532.80, changePercent: 1.39, pe: 7.2, roe: 14.5, marketCap: '68,500 Cr', high52w: 605.00, low52w: 280.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'IOB', name: 'Indian Overseas Bank', price: 55.40, prevClose: 54.20, changePercent: 2.21, pe: 22.5, roe: 8.5, marketCap: '78,000 Cr', high52w: 74.90, low52w: 27.50, cap: 'Mid', sector: 'Banking' },
        { symbol: 'BANKINDIA', name: 'Bank of India', price: 118.20, prevClose: 116.40, changePercent: 1.55, pe: 8.5, roe: 10.5, marketCap: '48,600 Cr', high52w: 154.70, low52w: 65.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'MAHABANK', name: 'Bank of Maharashtra', price: 62.40, prevClose: 61.20, changePercent: 1.96, pe: 8.5, roe: 18.5, marketCap: '44,200 Cr', high52w: 73.90, low52w: 31.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'CENTRALBK', name: 'Central Bank of India', price: 58.20, prevClose: 57.10, changePercent: 1.93, pe: 18.5, roe: 6.5, marketCap: '50,600 Cr', high52w: 76.00, low52w: 27.50, cap: 'Mid', sector: 'Banking' },
        { symbol: 'UCOBANK', name: 'UCO Bank', price: 48.50, prevClose: 47.60, changePercent: 1.89, pe: 14.5, roe: 8.4, marketCap: '57,800 Cr', high52w: 68.35, low52w: 24.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'INDUSINDBK', name: 'IndusInd Bank Ltd.', price: 1480.50, prevClose: 1462.40, changePercent: 1.24, pe: 12.5, roe: 14.5, marketCap: '1,15,000 Cr', high52w: 1694.50, low52w: 1005.00, cap: 'Large', sector: 'Banking' },
        { symbol: 'FEDERALBNK', name: 'Federal Bank Ltd.', price: 168.20, prevClose: 165.40, changePercent: 1.69, pe: 12.5, roe: 12.8, marketCap: '41,200 Cr', high52w: 208.10, low52w: 132.50, cap: 'Mid', sector: 'Banking' },
        { symbol: 'IDFCFIRSTB', name: 'IDFC First Bank Ltd.', price: 82.40, prevClose: 81.20, changePercent: 1.48, pe: 22.5, roe: 10.5, marketCap: '58,200 Cr', high52w: 99.90, low52w: 62.60, cap: 'Mid', sector: 'Banking' },
        { symbol: 'BANDHANBNK', name: 'Bandhan Bank Ltd.', price: 195.40, prevClose: 192.80, changePercent: 1.35, pe: 8.5, roe: 12.4, marketCap: '31,500 Cr', high52w: 262.00, low52w: 168.25, cap: 'Mid', sector: 'Banking' },
        { symbol: 'RBLBANK', name: 'RBL Bank Ltd.', price: 275.40, prevClose: 272.20, changePercent: 1.18, pe: 18.5, roe: 8.5, marketCap: '16,600 Cr', high52w: 306.00, low52w: 170.00, cap: 'Mid', sector: 'Banking' },
        { symbol: 'MANAPPURAM', name: 'Manappuram Finance Ltd.', price: 195.40, prevClose: 192.20, changePercent: 1.66, pe: 8.5, roe: 18.4, marketCap: '16,500 Cr', high52w: 228.89, low52w: 135.00, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'SHRIRAMFIN', name: 'Shriram Finance Ltd.', price: 2620.40, prevClose: 2595.20, changePercent: 0.97, pe: 14.5, roe: 14.2, marketCap: '98,500 Cr', high52w: 3052.00, low52w: 1770.00, cap: 'Large', sector: 'NBFC' },
        { symbol: 'M&MFIN', name: 'Mahindra & Mahindra Financial', price: 280.40, prevClose: 276.20, changePercent: 1.52, pe: 14.5, roe: 10.5, marketCap: '34,700 Cr', high52w: 342.00, low52w: 232.10, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'POONAWALLA', name: 'Poonawalla Fincorp Ltd.', price: 420.50, prevClose: 414.80, changePercent: 1.37, pe: 35.4, roe: 12.5, marketCap: '32,300 Cr', high52w: 567.00, low52w: 310.50, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'LICHSGFIN', name: 'LIC Housing Finance Ltd.', price: 620.40, prevClose: 612.80, changePercent: 1.24, pe: 8.5, roe: 12.4, marketCap: '34,100 Cr', high52w: 780.00, low52w: 382.00, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'ANGELONE', name: 'Angel One Ltd.', price: 3150.50, prevClose: 3120.40, changePercent: 0.96, pe: 22.5, roe: 42.5, marketCap: '28,000 Cr', high52w: 3896.00, low52w: 1912.55, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'HDFCAMC', name: 'HDFC Asset Management Co.', price: 4250.20, prevClose: 4220.40, changePercent: 0.71, pe: 42.5, roe: 32.4, marketCap: '90,800 Cr', high52w: 4864.00, low52w: 2870.00, cap: 'Large', sector: 'Financial Services' },
        { symbol: 'NIPPONLIFE', name: 'Nippon Life India AMC', price: 650.40, prevClose: 644.20, changePercent: 0.96, pe: 32.5, roe: 28.4, marketCap: '40,600 Cr', high52w: 750.00, low52w: 380.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'BOSCHLTD', name: 'Bosch Ltd.', price: 32500.00, prevClose: 32250.40, changePercent: 0.77, pe: 42.5, roe: 14.2, marketCap: '95,800 Cr', high52w: 38489.00, low52w: 17700.00, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'MRF', name: 'MRF Ltd.', price: 125400.00, prevClose: 124800.00, changePercent: 0.48, pe: 28.5, roe: 12.4, marketCap: '53,200 Cr', high52w: 148800.00, low52w: 102380.00, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'APOLLOTYRE', name: 'Apollo Tyres Ltd.', price: 495.20, prevClose: 490.40, changePercent: 0.98, pe: 18.5, roe: 14.2, marketCap: '31,400 Cr', high52w: 562.00, low52w: 348.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'BALKRISIND', name: 'Balkrishna Industries Ltd.', price: 2780.50, prevClose: 2755.20, changePercent: 0.92, pe: 32.5, roe: 18.4, marketCap: '53,800 Cr', high52w: 3216.45, low52w: 2080.00, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'BHARATFORG', name: 'Bharat Forge Ltd.', price: 1420.50, prevClose: 1405.20, changePercent: 1.09, pe: 55.4, roe: 14.5, marketCap: '66,200 Cr', high52w: 1768.00, low52w: 1000.05, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'ENDURANCE', name: 'Endurance Technologies Ltd.', price: 2150.40, prevClose: 2130.20, changePercent: 0.95, pe: 42.5, roe: 14.2, marketCap: '30,200 Cr', high52w: 2694.70, low52w: 1555.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'BERGEPAINT', name: 'Berger Paints India Ltd.', price: 580.40, prevClose: 575.20, changePercent: 0.90, pe: 62.5, roe: 22.4, marketCap: '56,400 Cr', high52w: 686.00, low52w: 475.00, cap: 'Large', sector: 'Paints' },
        { symbol: 'KANSAINER', name: 'Kansai Nerolac Paints', price: 310.20, prevClose: 307.80, changePercent: 0.78, pe: 45.5, roe: 14.2, marketCap: '16,700 Cr', high52w: 408.00, low52w: 268.00, cap: 'Mid', sector: 'Paints' },
        { symbol: 'INDIGO', name: 'Indigo Paints Ltd.', price: 1680.40, prevClose: 1665.20, changePercent: 0.91, pe: 55.4, roe: 12.5, marketCap: '8,000 Cr', high52w: 2230.00, low52w: 1226.00, cap: 'Mid', sector: 'Paints' },
        { symbol: 'INTERGLOBE', name: 'InterGlobe Aviation Ltd.', price: 4520.40, prevClose: 4480.20, changePercent: 0.90, pe: 22.5, roe: 45.2, marketCap: '1,74,000 Cr', high52w: 5175.00, low52w: 2372.00, cap: 'Large', sector: 'Aviation' },
        { symbol: 'SPICEJET', name: 'SpiceJet Ltd.', price: 62.40, prevClose: 61.20, changePercent: 1.96, pe: 0, roe: -55.4, marketCap: '4,900 Cr', high52w: 84.00, low52w: 28.20, cap: 'Small', sector: 'Aviation' },
        { symbol: 'INDHOTEL', name: 'Indian Hotels Company Ltd.', price: 620.50, prevClose: 612.40, changePercent: 1.32, pe: 72.5, roe: 12.5, marketCap: '88,200 Cr', high52w: 720.00, low52w: 332.00, cap: 'Large', sector: 'Hotels' },
        { symbol: 'LEMONTRE', name: 'Lemon Tree Hotels Ltd.', price: 120.50, prevClose: 118.40, changePercent: 1.77, pe: 55.4, roe: 14.2, marketCap: '9,560 Cr', high52w: 154.70, low52w: 79.00, cap: 'Small', sector: 'Hotels' },
        { symbol: 'DELHIVERY', name: 'Delhivery Ltd.', price: 420.50, prevClose: 415.20, changePercent: 1.28, pe: 0, roe: -4.5, marketCap: '30,600 Cr', high52w: 498.00, low52w: 312.00, cap: 'Mid', sector: 'Logistics' },
        { symbol: 'CONCOR', name: 'Container Corp of India', price: 920.40, prevClose: 910.80, changePercent: 1.05, pe: 32.5, roe: 12.4, marketCap: '56,200 Cr', high52w: 1195.00, low52w: 640.00, cap: 'Large', sector: 'Logistics' },
        { symbol: 'COROMANDEL', name: 'Coromandel International Ltd.', price: 1420.50, prevClose: 1408.20, changePercent: 0.87, pe: 18.5, roe: 25.4, marketCap: '41,800 Cr', high52w: 1790.00, low52w: 950.00, cap: 'Mid', sector: 'Fertilizer' },
        { symbol: 'UBL', name: 'United Breweries Ltd.', price: 1880.40, prevClose: 1865.20, changePercent: 0.81, pe: 62.5, roe: 14.2, marketCap: '49,700 Cr', high52w: 2095.55, low52w: 1445.10, cap: 'Large', sector: 'FMCG' },
        { symbol: 'JUBLFOOD', name: 'Jubilant FoodWorks Ltd.', price: 540.20, prevClose: 535.40, changePercent: 0.90, pe: 95.4, roe: 12.5, marketCap: '35,600 Cr', high52w: 685.00, low52w: 403.15, cap: 'Large', sector: 'FMCG' },
        { symbol: 'IRFC', name: 'Indian Railway Finance Corp', price: 175.40, prevClose: 172.20, changePercent: 1.86, pe: 32.5, roe: 12.4, marketCap: '2,29,000 Cr', high52w: 229.00, low52w: 57.30, cap: 'Large', sector: 'Financial Services' },
        { symbol: 'BHEL', name: 'Bharat Heavy Electricals', price: 225.40, prevClose: 220.80, changePercent: 2.08, pe: 55.4, roe: 4.5, marketCap: '78,500 Cr', high52w: 335.35, low52w: 82.00, cap: 'Large', sector: 'Capital Goods' },
        { symbol: 'RVNL', name: 'Rail Vikas Nigam Ltd.', price: 310.50, prevClose: 305.20, changePercent: 1.74, pe: 45.2, roe: 18.4, marketCap: '65,200 Cr', high52w: 647.00, low52w: 110.05, cap: 'Mid', sector: 'Railways' },
        { symbol: 'NBCC', name: 'NBCC (India) Ltd.', price: 115.20, prevClose: 112.80, changePercent: 2.13, pe: 62.5, roe: 14.2, marketCap: '20,700 Cr', high52w: 188.80, low52w: 42.50, cap: 'Mid', sector: 'Infrastructure' },
        { symbol: 'NLC', name: 'NLC India Ltd.', price: 265.40, prevClose: 261.20, changePercent: 1.61, pe: 18.5, roe: 10.5, marketCap: '36,800 Cr', high52w: 324.00, low52w: 120.00, cap: 'Mid', sector: 'Power' },
        { symbol: 'HUDCO', name: 'Housing & Urban Dev Corp', price: 265.40, prevClose: 260.80, changePercent: 1.76, pe: 14.5, roe: 12.4, marketCap: '53,100 Cr', high52w: 353.80, low52w: 56.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'COCHINSHIP', name: 'Cochin Shipyard Ltd.', price: 1820.50, prevClose: 1795.40, changePercent: 1.40, pe: 32.5, roe: 18.4, marketCap: '24,000 Cr', high52w: 2979.20, low52w: 500.00, cap: 'Mid', sector: 'Defense' },
        { symbol: 'GRSE', name: 'Garden Reach Shipbuilders', price: 1920.40, prevClose: 1895.20, changePercent: 1.33, pe: 45.2, roe: 22.5, marketCap: '22,000 Cr', high52w: 2834.45, low52w: 376.00, cap: 'Mid', sector: 'Defense' },
        { symbol: 'MAZAGON', name: 'Mazagon Dock Shipbuilders', price: 3820.50, prevClose: 3780.40, changePercent: 1.06, pe: 28.5, roe: 28.4, marketCap: '77,100 Cr', high52w: 4700.00, low52w: 1130.00, cap: 'Large', sector: 'Defense' },
        { symbol: 'SOLARINDS', name: 'Solar Industries India', price: 9250.40, prevClose: 9180.20, changePercent: 0.76, pe: 72.5, roe: 25.4, marketCap: '83,600 Cr', high52w: 12400.00, low52w: 5800.00, cap: 'Large', sector: 'Defense' },
        { symbol: 'DATAPATTNS', name: 'Data Patterns India Ltd.', price: 2580.50, prevClose: 2550.40, changePercent: 1.18, pe: 65.4, roe: 18.5, marketCap: '14,500 Cr', high52w: 3525.00, low52w: 1660.00, cap: 'Mid', sector: 'Defense' },
        { symbol: 'PERSISTENT', name: 'Persistent Systems Ltd.', price: 4520.40, prevClose: 4480.20, changePercent: 0.90, pe: 55.4, roe: 22.5, marketCap: '69,200 Cr', high52w: 6462.00, low52w: 3525.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'COFORGE', name: 'Coforge Ltd.', price: 5250.40, prevClose: 5210.20, changePercent: 0.77, pe: 38.5, roe: 28.4, marketCap: '32,800 Cr', high52w: 7340.00, low52w: 4200.00, cap: 'Large', sector: 'IT Services' },
        { symbol: 'MPHASIS', name: 'Mphasis Ltd.', price: 2520.50, prevClose: 2498.40, changePercent: 0.88, pe: 28.5, roe: 18.4, marketCap: '47,500 Cr', high52w: 3190.00, low52w: 2110.20, cap: 'Large', sector: 'IT Services' },
        { symbol: 'CYIENT', name: 'Cyient Ltd.', price: 1680.40, prevClose: 1665.20, changePercent: 0.91, pe: 25.4, roe: 14.2, marketCap: '18,500 Cr', high52w: 2373.65, low52w: 1295.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'BIRLASOFT', name: 'Birlasoft Ltd.', price: 650.20, prevClose: 642.80, changePercent: 1.15, pe: 22.5, roe: 18.4, marketCap: '18,000 Cr', high52w: 867.00, low52w: 485.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'MOTILALOSF', name: 'Motilal Oswal Financial', price: 2150.40, prevClose: 2130.20, changePercent: 0.95, pe: 18.5, roe: 22.4, marketCap: '32,000 Cr', high52w: 2850.00, low52w: 1170.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'IIFL', name: 'IIFL Finance Ltd.', price: 420.50, prevClose: 415.20, changePercent: 1.28, pe: 12.5, roe: 14.2, marketCap: '16,000 Cr', high52w: 560.00, low52w: 280.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'DMART', name: 'Avenue Supermarts Ltd.', price: 4250.20, prevClose: 4220.40, changePercent: 0.71, pe: 95.4, roe: 14.2, marketCap: '2,77,000 Cr', high52w: 5300.00, low52w: 3380.00, cap: 'Large', sector: 'Retail' },
        { symbol: 'NYKAA', name: 'FSN E-Commerce Ventures', price: 182.40, prevClose: 180.20, changePercent: 1.22, pe: 750.4, roe: 2.5, marketCap: '52,300 Cr', high52w: 228.50, low52w: 132.55, cap: 'Large', sector: 'Retail' },
        { symbol: 'CARTRADE', name: 'CarTrade Tech Ltd.', price: 1020.50, prevClose: 1008.40, changePercent: 1.20, pe: 55.4, roe: 4.5, marketCap: '4,900 Cr', high52w: 1350.00, low52w: 500.00, cap: 'Small', sector: 'Retail' },
        { symbol: 'VEDL2', name: 'Vedant Fashions Ltd.', price: 1320.50, prevClose: 1305.20, changePercent: 1.17, pe: 72.5, roe: 38.4, marketCap: '32,100 Cr', high52w: 1450.00, low52w: 820.00, cap: 'Mid', sector: 'Retail' },
        { symbol: 'BSOFT', name: 'KPIT Technologies Ltd.', price: 1520.40, prevClose: 1505.20, changePercent: 1.01, pe: 62.5, roe: 22.4, marketCap: '41,200 Cr', high52w: 1972.00, low52w: 1058.25, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'HAPPSTMNDS', name: 'Happiest Minds Technologies', price: 780.50, prevClose: 772.40, changePercent: 1.05, pe: 42.5, roe: 22.4, marketCap: '11,700 Cr', high52w: 1070.00, low52w: 615.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'GLAND', name: 'Gland Pharma Ltd.', price: 1580.40, prevClose: 1565.20, changePercent: 0.97, pe: 22.5, roe: 12.4, marketCap: '25,800 Cr', high52w: 2185.00, low52w: 1290.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'SYNGENE', name: 'Syngene International Ltd.', price: 820.50, prevClose: 812.40, changePercent: 1.00, pe: 42.5, roe: 14.2, marketCap: '32,900 Cr', high52w: 990.00, low52w: 612.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'JKCEMENT', name: 'JK Cement Ltd.', price: 4120.40, prevClose: 4085.20, changePercent: 0.86, pe: 32.5, roe: 14.2, marketCap: '31,800 Cr', high52w: 4817.00, low52w: 2965.00, cap: 'Mid', sector: 'Cement' },
        { symbol: 'INDIACEM', name: 'India Cements Ltd.', price: 310.20, prevClose: 305.40, changePercent: 1.57, pe: 42.5, roe: 2.5, marketCap: '9,600 Cr', high52w: 420.00, low52w: 188.00, cap: 'Small', sector: 'Cement' },
        { symbol: 'SUNTECK', name: 'Sunteck Realty Ltd.', price: 520.40, prevClose: 515.20, changePercent: 1.01, pe: 35.4, roe: 6.5, marketCap: '7,200 Cr', high52w: 702.00, low52w: 342.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'SOBHA', name: 'Sobha Ltd.', price: 1580.50, prevClose: 1565.20, changePercent: 0.98, pe: 28.5, roe: 10.5, marketCap: '15,000 Cr', high52w: 2275.95, low52w: 645.00, cap: 'Mid', sector: 'Real Estate' },
        { symbol: 'IBREALEST', name: 'Indiabulls Real Estate', price: 145.20, prevClose: 142.80, changePercent: 1.68, pe: 0, roe: -8.5, marketCap: '6,800 Cr', high52w: 210.00, low52w: 62.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'MCX', name: 'Multi Commodity Exchange', price: 4250.40, prevClose: 4215.20, changePercent: 0.84, pe: 35.4, roe: 8.5, marketCap: '21,700 Cr', high52w: 4492.00, low52w: 2252.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'KFINTECH', name: 'KFin Technologies Ltd.', price: 720.50, prevClose: 712.40, changePercent: 1.14, pe: 42.5, roe: 22.4, marketCap: '12,300 Cr', high52w: 864.00, low52w: 346.25, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'CAMS', name: 'Computer Age Mgmt Services', price: 3450.20, prevClose: 3420.40, changePercent: 0.87, pe: 42.5, roe: 35.4, marketCap: '16,900 Cr', high52w: 4208.00, low52w: 2160.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'IIFLWAM', name: 'IIFL Wealth Management', price: 1620.50, prevClose: 1605.20, changePercent: 0.95, pe: 22.5, roe: 18.4, marketCap: '14,200 Cr', high52w: 2065.00, low52w: 1220.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'JBCHEPHARM', name: 'JB Chemicals & Pharma', price: 1820.40, prevClose: 1805.20, changePercent: 0.84, pe: 28.5, roe: 22.4, marketCap: '28,200 Cr', high52w: 2225.00, low52w: 1410.00, cap: 'Mid', sector: 'Pharma' },
        { symbol: 'ZYDUSLIFE', name: 'Zydus Lifesciences Ltd.', price: 880.50, prevClose: 872.40, changePercent: 0.93, pe: 22.5, roe: 18.4, marketCap: '88,600 Cr', high52w: 1080.00, low52w: 608.70, cap: 'Large', sector: 'Pharma' },
        { symbol: 'ASTRAL', name: 'Astral Ltd.', price: 1980.40, prevClose: 1965.20, changePercent: 0.77, pe: 82.5, roe: 18.4, marketCap: '53,200 Cr', high52w: 2478.00, low52w: 1568.00, cap: 'Large', sector: 'Building Materials' },
        { symbol: 'SUPREMEIND', name: 'Supreme Industries Ltd.', price: 5280.50, prevClose: 5240.20, changePercent: 0.77, pe: 42.5, roe: 22.4, marketCap: '67,100 Cr', high52w: 6422.00, low52w: 3862.00, cap: 'Large', sector: 'Building Materials' },
        { symbol: 'APLAPOLLO', name: 'APL Apollo Tubes Ltd.', price: 1620.40, prevClose: 1605.20, changePercent: 0.95, pe: 48.5, roe: 22.4, marketCap: '44,900 Cr', high52w: 1973.00, low52w: 1278.00, cap: 'Mid', sector: 'Building Materials' },
        { symbol: 'CERA', name: 'Cera Sanitaryware Ltd.', price: 8250.40, prevClose: 8180.20, changePercent: 0.86, pe: 42.5, roe: 18.4, marketCap: '10,700 Cr', high52w: 10740.00, low52w: 6052.00, cap: 'Mid', sector: 'Building Materials' },
        { symbol: 'KAJARIA', name: 'Kajaria Ceramics Ltd.', price: 1380.50, prevClose: 1365.20, changePercent: 1.12, pe: 42.5, roe: 18.4, marketCap: '21,900 Cr', high52w: 1630.00, low52w: 1058.10, cap: 'Mid', sector: 'Building Materials' },
        { symbol: 'GRINDWELL', name: 'Grindwell Norton Ltd.', price: 2280.40, prevClose: 2262.20, changePercent: 0.81, pe: 55.4, roe: 22.4, marketCap: '25,200 Cr', high52w: 2800.00, low52w: 1875.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'THERMAX', name: 'Thermax Ltd.', price: 4520.50, prevClose: 4485.20, changePercent: 0.79, pe: 62.5, roe: 14.2, marketCap: '53,900 Cr', high52w: 5735.00, low52w: 2325.00, cap: 'Large', sector: 'Capital Goods' },
        { symbol: 'CUMMINSIND', name: 'Cummins India Ltd.', price: 3250.40, prevClose: 3220.20, changePercent: 0.94, pe: 48.5, roe: 28.4, marketCap: '90,100 Cr', high52w: 4191.00, low52w: 1630.00, cap: 'Large', sector: 'Capital Goods' },
        { symbol: 'HONAUT', name: 'Honeywell Automation India', price: 48500.00, prevClose: 48150.00, changePercent: 0.73, pe: 82.5, roe: 22.4, marketCap: '43,000 Cr', high52w: 58490.00, low52w: 35050.00, cap: 'Large', sector: 'Capital Goods' },
        { symbol: 'SCHAEFFLER', name: 'Schaeffler India Ltd.', price: 3420.50, prevClose: 3395.20, changePercent: 0.75, pe: 42.5, roe: 18.4, marketCap: '53,400 Cr', high52w: 4530.00, low52w: 2620.00, cap: 'Large', sector: 'Auto Ancillary' },
        { symbol: 'TIMKEN', name: 'Timken India Ltd.', price: 3350.40, prevClose: 3322.20, changePercent: 0.85, pe: 55.4, roe: 18.4, marketCap: '25,100 Cr', high52w: 4450.00, low52w: 2690.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'SKFINDIA', name: 'SKF India Ltd.', price: 5250.20, prevClose: 5210.40, changePercent: 0.76, pe: 42.5, roe: 22.4, marketCap: '26,000 Cr', high52w: 6560.00, low52w: 3750.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'SUNDRMFAST', name: 'Sundram Fasteners Ltd.', price: 1080.40, prevClose: 1068.20, changePercent: 1.14, pe: 32.5, roe: 18.4, marketCap: '22,700 Cr', high52w: 1383.40, low52w: 880.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'ELGIEQUIP', name: 'Elgi Equipments Ltd.', price: 680.50, prevClose: 674.20, changePercent: 0.93, pe: 55.4, roe: 18.4, marketCap: '21,600 Cr', high52w: 842.00, low52w: 462.25, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'RATNAMANI', name: 'Ratnamani Metals & Tubes', price: 3120.40, prevClose: 3095.20, changePercent: 0.81, pe: 32.5, roe: 22.4, marketCap: '21,800 Cr', high52w: 3910.00, low52w: 2450.00, cap: 'Mid', sector: 'Metals' },
        { symbol: 'JINDALSAW', name: 'Jindal Saw Ltd.', price: 580.50, prevClose: 572.40, changePercent: 1.42, pe: 12.5, roe: 14.2, marketCap: '18,500 Cr', high52w: 859.90, low52w: 265.00, cap: 'Mid', sector: 'Metals' },
        { symbol: 'AFFLE', name: 'Affle India Ltd.', price: 1280.40, prevClose: 1268.20, changePercent: 0.96, pe: 55.4, roe: 18.4, marketCap: '18,900 Cr', high52w: 1670.00, low52w: 987.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'ROUTE', name: 'Route Mobile Ltd.', price: 1720.50, prevClose: 1705.20, changePercent: 0.90, pe: 32.5, roe: 18.4, marketCap: '10,800 Cr', high52w: 2320.00, low52w: 1272.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'LATENTVIEW', name: 'Latent View Analytics', price: 420.50, prevClose: 415.20, changePercent: 1.28, pe: 55.4, roe: 14.2, marketCap: '8,600 Cr', high52w: 630.00, low52w: 306.00, cap: 'Small', sector: 'IT Services' },
        { symbol: 'MAPMYINDIA', name: 'C.E. Info Systems Ltd.', price: 2080.40, prevClose: 2060.20, changePercent: 0.98, pe: 82.5, roe: 22.4, marketCap: '11,300 Cr', high52w: 2640.00, low52w: 1380.00, cap: 'Mid', sector: 'IT Services' },
        { symbol: 'POLICYBZR', name: 'PB Fintech Ltd.', price: 1420.50, prevClose: 1405.20, changePercent: 1.09, pe: 0, roe: -8.5, marketCap: '64,200 Cr', high52w: 1840.00, low52w: 540.25, cap: 'Large', sector: 'Insurance' },
        { symbol: 'STARHEALTH', name: 'Star Health & Allied Insurance', price: 580.20, prevClose: 575.40, changePercent: 0.83, pe: 28.5, roe: 10.5, marketCap: '33,800 Cr', high52w: 720.50, low52w: 480.20, cap: 'Mid', sector: 'Insurance' },
        { symbol: 'JSWENERGY', name: 'JSW Energy Ltd.', price: 580.40, prevClose: 574.20, changePercent: 1.08, pe: 62.5, roe: 8.5, marketCap: '1,01,000 Cr', high52w: 732.95, low52w: 340.05, cap: 'Large', sector: 'Power' },
        { symbol: 'TORNTPOWER', name: 'Torrent Power Ltd.', price: 1520.50, prevClose: 1505.20, changePercent: 1.02, pe: 32.5, roe: 18.4, marketCap: '73,200 Cr', high52w: 1900.00, low52w: 960.00, cap: 'Large', sector: 'Power' },
        { symbol: 'CGPOWER', name: 'CG Power & Industrial Sol.', price: 580.40, prevClose: 574.20, changePercent: 1.08, pe: 72.5, roe: 28.4, marketCap: '88,600 Cr', high52w: 738.80, low52w: 315.00, cap: 'Large', sector: 'Capital Goods' },
        { symbol: 'KALYANKJIL', name: 'Kalyan Jewellers India', price: 480.50, prevClose: 475.20, changePercent: 1.11, pe: 72.5, roe: 14.2, marketCap: '49,500 Cr', high52w: 700.65, low52w: 225.05, cap: 'Large', sector: 'Consumer Durables' },
        { symbol: 'DEVYANI', name: 'Devyani International Ltd.', price: 175.40, prevClose: 173.20, changePercent: 1.27, pe: 95.4, roe: 12.5, marketCap: '21,200 Cr', high52w: 222.50, low52w: 118.35, cap: 'Mid', sector: 'FMCG' },
        { symbol: 'SAPPHIRE', name: 'Sapphire Foods India Ltd.', price: 1480.50, prevClose: 1465.20, changePercent: 1.04, pe: 120.5, roe: 8.5, marketCap: '9,400 Cr', high52w: 1675.00, low52w: 1197.00, cap: 'Mid', sector: 'FMCG' },
        { symbol: 'PNBHOUSING', name: 'PNB Housing Finance Ltd.', price: 820.50, prevClose: 812.40, changePercent: 1.00, pe: 12.5, roe: 10.5, marketCap: '21,400 Cr', high52w: 1049.00, low52w: 608.00, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'CANBK2', name: 'Canfin Homes Ltd.', price: 780.40, prevClose: 772.20, changePercent: 1.06, pe: 14.5, roe: 18.4, marketCap: '10,400 Cr', high52w: 936.85, low52w: 620.00, cap: 'Mid', sector: 'NBFC' },
        { symbol: 'ABCAPITAL', name: 'Aditya Birla Capital', price: 195.40, prevClose: 192.80, changePercent: 1.35, pe: 14.5, roe: 10.5, marketCap: '50,200 Cr', high52w: 238.90, low52w: 145.50, cap: 'Large', sector: 'Financial Services' },
        { symbol: 'EIDPARRY', name: 'EID Parry India Ltd.', price: 720.50, prevClose: 712.40, changePercent: 1.14, pe: 8.5, roe: 22.4, marketCap: '12,800 Cr', high52w: 960.00, low52w: 450.00, cap: 'Mid', sector: 'FMCG' },
        { symbol: 'MFSL', name: 'Max Financial Services', price: 1020.40, prevClose: 1010.20, changePercent: 1.01, pe: 95.4, roe: 4.5, marketCap: '35,200 Cr', high52w: 1180.00, low52w: 786.00, cap: 'Mid', sector: 'Insurance' },
        { symbol: 'PIIND', name: 'PI Industries Ltd.', price: 3850.50, prevClose: 3820.40, changePercent: 0.79, pe: 32.5, roe: 18.4, marketCap: '58,300 Cr', high52w: 4410.00, low52w: 2965.00, cap: 'Large', sector: 'Chemicals' },
        { symbol: 'NAVINFLUOR', name: 'Navin Fluorine International', price: 3620.40, prevClose: 3590.20, changePercent: 0.84, pe: 42.5, roe: 14.2, marketCap: '17,900 Cr', high52w: 4970.00, low52w: 2870.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'SUMICHEM', name: 'Sumitomo Chemical India', price: 420.50, prevClose: 416.20, changePercent: 1.03, pe: 32.5, roe: 22.4, marketCap: '21,000 Cr', high52w: 570.00, low52w: 332.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'IRCON', name: 'Ircon International Ltd.', price: 275.50, prevClose: 270.20, changePercent: 1.96, pe: 28.5, roe: 15.2, marketCap: '25,900 Cr', high52w: 350.00, low52w: 120.00, cap: 'Mid', sector: 'Infrastructure' },
        { symbol: 'GMRINFRA', name: 'GMR Airports Infrastructure', price: 88.40, prevClose: 87.20, changePercent: 1.38, pe: 0, roe: -2.4, marketCap: '53,200 Cr', high52w: 104.00, low52w: 50.00, cap: 'Mid', sector: 'Infrastructure' },
        { symbol: 'EXIDEIND', name: 'Exide Industries Ltd.', price: 545.20, prevClose: 535.10, changePercent: 1.89, pe: 35.2, roe: 12.4, marketCap: '46,300 Cr', high52w: 620.00, low52w: 240.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'AMARAJABAT', name: 'Amara Raja Energy & Mobility', price: 1650.50, prevClose: 1630.20, changePercent: 1.25, pe: 28.4, roe: 14.5, marketCap: '30,200 Cr', high52w: 1800.00, low52w: 620.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'NCC', name: 'NCC Ltd.', price: 325.40, prevClose: 320.10, changePercent: 1.66, pe: 24.5, roe: 11.2, marketCap: '20,400 Cr', high52w: 380.00, low52w: 140.00, cap: 'Mid', sector: 'Infrastructure' },
        { symbol: 'IRB', name: 'IRB Infrastructure Developers', price: 65.20, prevClose: 64.80, changePercent: 0.62, pe: 45.2, roe: 8.5, marketCap: '39,400 Cr', high52w: 78.00, low52w: 25.00, cap: 'Mid', sector: 'Infrastructure' },
        { symbol: 'JINDALSTEL', name: 'Jindal Steel & Power Ltd.', price: 980.40, prevClose: 968.10, changePercent: 1.27, pe: 18.5, roe: 12.8, marketCap: '1,00,000 Cr', high52w: 1100.00, low52w: 620.00, cap: 'Large', sector: 'Metals' },
        { symbol: 'HINDCOPPER', name: 'Hindustan Copper Ltd.', price: 320.50, prevClose: 315.20, changePercent: 1.68, pe: 65.2, roe: 8.4, marketCap: '31,000 Cr', high52w: 420.00, low52w: 130.00, cap: 'Mid', sector: 'Metals' },
        { symbol: 'TATACOMM', name: 'Tata Communications Ltd.', price: 1880.40, prevClose: 1865.10, changePercent: 0.82, pe: 32.5, roe: 22.4, marketCap: '53,500 Cr', high52w: 2100.00, low52w: 1500.00, cap: 'Large', sector: 'Telecom' },
        { symbol: 'HFCL', name: 'HFCL Ltd.', price: 115.20, prevClose: 112.50, changePercent: 2.40, pe: 42.5, roe: 10.4, marketCap: '16,500 Cr', high52w: 140.00, low52w: 62.00, cap: 'Mid', sector: 'Telecom' },
        { symbol: 'CENTURYTEX', name: 'Century Textiles & Industries', price: 2150.40, prevClose: 2130.10, changePercent: 0.95, pe: 55.4, roe: 6.8, marketCap: '24,000 Cr', high52w: 2500.00, low52w: 1100.00, cap: 'Mid', sector: 'Textiles' },
        { symbol: 'WELSPUNIND', name: 'Welspun Living Ltd.', price: 145.20, prevClose: 142.10, changePercent: 2.18, pe: 24.5, roe: 12.4, marketCap: '14,000 Cr', high52w: 180.00, low52w: 90.00, cap: 'Mid', sector: 'Textiles' },
        { symbol: 'ALOKTEXT', name: 'Alok Industries Ltd.', price: 28.40, prevClose: 29.10, changePercent: -2.40, pe: 0, roe: -45.2, marketCap: '14,100 Cr', high52w: 39.00, low52w: 15.00, cap: 'Small', sector: 'Textiles' },
        { symbol: 'TRIDENT', name: 'Trident Ltd.', price: 38.50, prevClose: 38.00, changePercent: 1.32, pe: 42.5, roe: 9.8, marketCap: '19,600 Cr', high52w: 52.00, low52w: 32.00, cap: 'Mid', sector: 'Textiles' },
        { symbol: 'BATAINDIA', name: 'Bata India Ltd.', price: 1450.20, prevClose: 1435.10, changePercent: 1.05, pe: 55.4, roe: 16.5, marketCap: '18,600 Cr', high52w: 1750.00, low52w: 1300.00, cap: 'Large', sector: 'Consumer Goods' },
        { symbol: 'RELAXO', name: 'Relaxo Footwears Ltd.', price: 820.50, prevClose: 812.20, changePercent: 1.02, pe: 82.5, roe: 12.4, marketCap: '20,400 Cr', high52w: 980.00, low52w: 750.00, cap: 'Mid', sector: 'Consumer Goods' },
        { symbol: 'CAMPUS', name: 'Campus Activewear Ltd.', price: 280.40, prevClose: 275.20, changePercent: 1.89, pe: 72.5, roe: 14.2, marketCap: '8,500 Cr', high52w: 350.00, low52w: 220.00, cap: 'Mid', sector: 'Consumer Goods' },
        { symbol: 'METROBRAND', name: 'Metro Brands Ltd.', price: 1220.50, prevClose: 1205.10, changePercent: 1.28, pe: 62.5, roe: 18.5, marketCap: '33,200 Cr', high52w: 1450.00, low52w: 980.00, cap: 'Mid', sector: 'Consumer Goods' },
        { symbol: 'RAJESHEXPO', name: 'Rajesh Exports Ltd.', price: 280.50, prevClose: 276.40, changePercent: 1.48, pe: 18.5, roe: 8.4, marketCap: '8,200 Cr', high52w: 480.00, low52w: 260.00, cap: 'Mid', sector: 'Consumer Durables' },
        { symbol: 'PCJEWELLER', name: 'PC Jeweller Ltd.', price: 145.20, prevClose: 140.10, changePercent: 3.64, pe: 0, roe: -12.4, marketCap: '6,700 Cr', high52w: 180.00, low52w: 50.00, cap: 'Small', sector: 'Consumer Durables' },
        { symbol: 'SURAJEST', name: 'Suraj Estate Developers Ltd.', price: 620.40, prevClose: 610.10, changePercent: 1.69, pe: 35.4, roe: 14.2, marketCap: '2,700 Cr', high52w: 800.00, low52w: 320.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'TATAINVEST', name: 'Tata Investment Corporation', price: 6850.40, prevClose: 6790.10, changePercent: 0.89, pe: 65.4, roe: 10.5, marketCap: '34,600 Cr', high52w: 9800.00, low52w: 4200.00, cap: 'Mid', sector: 'Financial Services' },
        { symbol: 'MAHLOG', name: 'Mahindra Logistics Ltd.', price: 420.50, prevClose: 415.10, changePercent: 1.30, pe: 85.4, roe: 6.5, marketCap: '3,000 Cr', high52w: 520.00, low52w: 340.00, cap: 'Small', sector: 'Logistics' },
        { symbol: 'VRLVAL', name: 'VRL Logistics Ltd.', price: 580.20, prevClose: 572.10, changePercent: 1.42, pe: 32.5, roe: 14.2, marketCap: '5,100 Cr', high52w: 720.00, low52w: 480.00, cap: 'Small', sector: 'Logistics' },
        { symbol: 'TCI', name: 'Transport Corp of India', price: 1020.50, prevClose: 1005.10, changePercent: 1.53, pe: 22.5, roe: 18.4, marketCap: '7,900 Cr', high52w: 1180.00, low52w: 720.00, cap: 'Mid', sector: 'Logistics' },
        { symbol: 'BLUESTARCO', name: 'Blue Star Ltd.', price: 1620.50, prevClose: 1605.10, changePercent: 0.96, pe: 55.4, roe: 22.5, marketCap: '31,500 Cr', high52w: 1800.00, low52w: 1100.00, cap: 'Mid', sector: 'Consumer Durables' },
        { symbol: 'LALPATHLAB', name: 'Dr. Lal PathLabs Ltd.', price: 2580.40, prevClose: 2550.20, changePercent: 1.18, pe: 65.4, roe: 22.4, marketCap: '21,500 Cr', high52w: 2900.00, low52w: 1900.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'METROPOLIS', name: 'Metropolis Healthcare Ltd.', price: 1820.50, prevClose: 1805.10, changePercent: 0.85, pe: 52.5, roe: 18.4, marketCap: '9,300 Cr', high52w: 2100.00, low52w: 1300.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'THYROCARE', name: 'Thyrocare Technologies Ltd.', price: 720.50, prevClose: 712.10, changePercent: 1.18, pe: 42.5, roe: 14.2, marketCap: '3,800 Cr', high52w: 850.00, low52w: 520.00, cap: 'Small', sector: 'Healthcare' },
        { symbol: 'NH', name: 'Narayana Hrudayalaya Ltd.', price: 1180.40, prevClose: 1165.20, changePercent: 1.30, pe: 32.5, roe: 25.4, marketCap: '24,200 Cr', high52w: 1400.00, low52w: 920.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'ASTERDM', name: 'Aster DM Healthcare Ltd.', price: 340.20, prevClose: 336.10, changePercent: 1.22, pe: 42.5, roe: 10.5, marketCap: '17,000 Cr', high52w: 480.00, low52w: 280.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'RAINBOW', name: 'Rainbow Childrens Medicare', price: 1320.50, prevClose: 1305.20, changePercent: 1.17, pe: 55.4, roe: 18.4, marketCap: '13,400 Cr', high52w: 1500.00, low52w: 980.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'MEDANTA', name: 'Global Health Ltd. (Medanta)', price: 1220.50, prevClose: 1205.10, changePercent: 1.28, pe: 62.5, roe: 16.5, marketCap: '32,800 Cr', high52w: 1450.00, low52w: 920.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'KIMS', name: 'Krishna Institute of Medical', price: 2150.40, prevClose: 2130.10, changePercent: 0.95, pe: 45.2, roe: 18.5, marketCap: '17,200 Cr', high52w: 2500.00, low52w: 1600.00, cap: 'Mid', sector: 'Healthcare' },
        { symbol: 'MAXESTATE', name: 'Max Estates Ltd.', price: 580.20, prevClose: 572.10, changePercent: 1.42, pe: 0, roe: -2.4, marketCap: '3,500 Cr', high52w: 680.00, low52w: 320.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'PURVA', name: 'Puravankara Ltd.', price: 420.50, prevClose: 415.10, changePercent: 1.30, pe: 85.4, roe: 4.5, marketCap: '10,000 Cr', high52w: 520.00, low52w: 280.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'KOLTEPATIL', name: 'Kolte-Patil Developers Ltd.', price: 580.40, prevClose: 572.20, changePercent: 1.43, pe: 32.5, roe: 8.5, marketCap: '4,400 Cr', high52w: 720.00, low52w: 410.00, cap: 'Small', sector: 'Real Estate' },
        { symbol: 'ASHOKA', name: 'Ashoka Buildcon Ltd.', price: 225.40, prevClose: 220.10, changePercent: 2.41, pe: 14.5, roe: 12.4, marketCap: '6,300 Cr', high52w: 280.00, low52w: 120.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'DILIPBUILD', name: 'Dilip Buildcon Ltd.', price: 520.40, prevClose: 512.20, changePercent: 1.60, pe: 28.5, roe: 6.5, marketCap: '7,600 Cr', high52w: 620.00, low52w: 280.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'KNRCON', name: 'KNR Constructions Ltd.', price: 340.50, prevClose: 335.20, changePercent: 1.58, pe: 15.2, roe: 18.5, marketCap: '9,500 Cr', high52w: 410.00, low52w: 230.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'ITDCEM', name: 'ITD Cementation India Ltd.', price: 520.30, prevClose: 512.10, changePercent: 1.60, pe: 26.8, roe: 15.2, marketCap: '8,900 Cr', high52w: 650.00, low52w: 210.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'PATELENG', name: 'Patel Engineering Ltd.', price: 55.40, prevClose: 54.20, changePercent: 2.21, pe: 22.5, roe: 8.5, marketCap: '4,600 Cr', high52w: 79.00, low52w: 35.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'HINDCON', name: 'Hindustan Construction Co.', price: 42.10, prevClose: 40.80, changePercent: 3.19, pe: 0, roe: -4.5, marketCap: '7,000 Cr', high52w: 56.00, low52w: 18.00, cap: 'Small', sector: 'Infrastructure' },
        { symbol: 'JKPAPER', name: 'JK Paper Ltd.', price: 480.50, prevClose: 472.40, changePercent: 1.71, pe: 10.5, roe: 22.4, marketCap: '8,200 Cr', high52w: 610.00, low52w: 310.00, cap: 'Small', sector: 'Paper & Forest' },
        { symbol: 'WESTCOASP', name: 'West Coast Paper Mills Ltd.', price: 620.40, prevClose: 612.20, changePercent: 1.34, pe: 8.5, roe: 25.4, marketCap: '4,100 Cr', high52w: 780.00, low52w: 510.00, cap: 'Small', sector: 'Paper & Forest' },
        { symbol: 'SESHAPAPER', name: 'Seshasayee Paper & Boards', price: 340.20, prevClose: 335.10, changePercent: 1.52, pe: 9.2, roe: 18.5, marketCap: '2,100 Cr', high52w: 420.00, low52w: 260.00, cap: 'Small', sector: 'Paper & Forest' },
        { symbol: 'NILKAMAL', name: 'Nilkamal Ltd.', price: 1880.40, prevClose: 1860.20, changePercent: 1.09, pe: 28.5, roe: 10.5, marketCap: '2,80,000 Cr', high52w: 2400.00, low52w: 1600.00, cap: 'Small', sector: 'Consumer Durables' },
        { symbol: 'FINPIPE', name: 'Finolex Industries Ltd.', price: 280.40, prevClose: 275.20, changePercent: 1.89, pe: 35.2, roe: 12.4, marketCap: '17,400 Cr', high52w: 360.00, low52w: 180.00, cap: 'Mid', sector: 'Building Materials' },
        { symbol: 'PRINCEPIPE', name: 'Prince Pipes & Fittings Ltd.', price: 540.20, prevClose: 532.50, changePercent: 1.45, pe: 42.5, roe: 11.2, marketCap: '6,000 Cr', high52w: 720.00, low52w: 480.00, cap: 'Small', sector: 'Building Materials' },
        { symbol: 'DREAMFOLKS', name: 'Dreamfolks Services Ltd.', price: 480.50, prevClose: 472.10, changePercent: 1.78, pe: 42.5, roe: 32.4, marketCap: '2,500 Cr', high52w: 680.00, low52w: 410.00, cap: 'Small', sector: 'Tourism & Leisure' },
        { symbol: 'TAJGVK', name: 'TajGVK Hotels & Resorts Ltd.', price: 340.20, prevClose: 335.20, changePercent: 1.49, pe: 24.5, roe: 14.5, marketCap: '2,100 Cr', high52w: 410.00, low52w: 210.00, cap: 'Small', sector: 'Hotels' },
        { symbol: 'EIHOTEL', name: 'EIH Limited (Oberoi Hotels)', price: 375.40, prevClose: 370.20, changePercent: 1.40, pe: 35.4, roe: 12.5, marketCap: '23,500 Cr', high52w: 480.00, low52w: 210.00, cap: 'Mid', sector: 'Hotels' },
        { symbol: 'WESTLIFE', name: 'Westlife Foodworld Ltd.', price: 780.40, prevClose: 770.10, changePercent: 1.34, pe: 95.4, roe: 12.4, marketCap: '12,200 Cr', high52w: 960.00, low52w: 680.00, cap: 'Mid', sector: 'FMCG' },
        { symbol: 'LTFOODS', name: 'LT Foods Ltd. (Daawat)', price: 265.40, prevClose: 260.10, changePercent: 2.04, pe: 14.5, roe: 18.4, marketCap: '9,200 Cr', high52w: 320.00, low52w: 130.00, cap: 'Small', sector: 'FMCG' },
        { symbol: 'KRBL', name: 'KRBL Ltd. (India Gate)', price: 280.40, prevClose: 275.20, changePercent: 1.89, pe: 12.5, roe: 15.2, marketCap: '6,600 Cr', high52w: 410.00, low52w: 260.00, cap: 'Small', sector: 'FMCG' },
        { symbol: 'AVANTIFEED', name: 'Avanti Feeds Ltd.', price: 620.50, prevClose: 610.20, changePercent: 1.69, pe: 18.5, roe: 16.5, marketCap: '8,400 Cr', high52w: 750.00, low52w: 410.00, cap: 'Small', sector: 'Agriculture' },
        { symbol: 'BALRAMCHIN', name: 'Balrampur Chini Mills Ltd.', price: 420.50, prevClose: 412.50, changePercent: 1.94, pe: 18.5, roe: 12.5, marketCap: '8,500 Cr', high52w: 520.00, low52w: 340.00, cap: 'Mid', sector: 'Agriculture' },
        { symbol: 'RENUKA', name: 'Shree Renuka Sugars Ltd.', price: 48.50, prevClose: 49.10, changePercent: -1.22, pe: 0, roe: -8.5, marketCap: '10,300 Cr', high52w: 62.00, low52w: 38.00, cap: 'Small', sector: 'Agriculture' },
        { symbol: 'GNFC', name: 'Gujarat Narmada Valley Fert.', price: 650.40, prevClose: 642.50, changePercent: 1.23, pe: 8.5, roe: 14.2, marketCap: '10,100 Cr', high52w: 820.00, low52w: 540.00, cap: 'Small', sector: 'Chemicals' },
        { symbol: 'GSFC', name: 'Gujarat State Fertilizers', price: 225.40, prevClose: 220.10, changePercent: 2.41, pe: 7.5, roe: 11.4, marketCap: '9,000 Cr', high52w: 310.00, low52w: 150.00, cap: 'Small', sector: 'Chemicals' },
        { symbol: 'DEEPAKNI', name: 'Deepak Nitrite Ltd.', price: 2340.20, prevClose: 2305.10, changePercent: 1.52, pe: 32.5, roe: 22.4, marketCap: '31,900 Cr', high52w: 2600.00, low52w: 1800.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'TATACHEM', name: 'Tata Chemicals Ltd.', price: 1090.50, prevClose: 1080.20, changePercent: 0.95, pe: 22.5, roe: 8.4, marketCap: '27,800 Cr', high52w: 1340.00, low52w: 910.00, cap: 'Mid', sector: 'Chemicals' },
        { symbol: 'JSL', name: 'Jindal Stainless Ltd.', price: 720.50, prevClose: 710.20, changePercent: 1.45, pe: 22.5, roe: 18.5, marketCap: '59,200 Cr', high52w: 840.00, low52w: 320.00, cap: 'Mid', sector: 'Metals' },
        { symbol: 'WELCORP', name: 'Welspun Corp Ltd.', price: 540.20, prevClose: 532.50, changePercent: 1.45, pe: 18.5, roe: 12.4, marketCap: '14,100 Cr', high52w: 680.00, low52w: 240.00, cap: 'Mid', sector: 'Metals' },
        { symbol: 'KEI', name: 'KEI Industries Ltd.', price: 3850.50, prevClose: 3810.10, changePercent: 1.06, pe: 52.5, roe: 22.4, marketCap: '34,800 Cr', high52w: 4800.00, low52w: 2200.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'VGUARD', name: 'V-Guard Industries Ltd.', price: 420.50, prevClose: 415.20, changePercent: 1.28, pe: 42.5, roe: 18.5, marketCap: '18,200 Cr', high52w: 520.00, low52w: 280.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'FINCABLES', name: 'Finolex Cables Ltd.', price: 1020.40, prevClose: 1005.20, changePercent: 1.51, pe: 22.5, roe: 14.5, marketCap: '15,600 Cr', high52w: 1220.00, low52w: 780.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'RRKABEL', name: 'RR Kabel Ltd.', price: 1580.20, prevClose: 1560.10, changePercent: 1.29, pe: 55.4, roe: 16.5, marketCap: '18,200 Cr', high52w: 1900.00, low52w: 1180.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'TITAGARH', name: 'Titagarh Rail Systems Ltd.', price: 1180.40, prevClose: 1165.20, changePercent: 1.30, pe: 65.4, roe: 18.4, marketCap: '15,900 Cr', high52w: 1800.00, low52w: 680.00, cap: 'Mid', sector: 'Railways' },
        { symbol: 'RAILTEL', name: 'RailTel Corp of India Ltd.', price: 420.50, prevClose: 415.20, changePercent: 1.28, pe: 35.4, roe: 15.2, marketCap: '13,500 Cr', high52w: 610.00, low52w: 180.00, cap: 'Small', sector: 'Telecom' },
        { symbol: 'BANSAL', name: 'Bansal Wire Industries Ltd.', price: 340.50, prevClose: 335.20, changePercent: 1.58, pe: 28.5, roe: 14.2, marketCap: '5,300 Cr', high52w: 420.00, low52w: 250.00, cap: 'Small', sector: 'Metals' },
        { symbol: 'CENTURYPLY', name: 'Century Plyboards (India) Ltd.', price: 680.50, prevClose: 672.10, changePercent: 1.25, pe: 42.5, roe: 14.5, marketCap: '15,100 Cr', high52w: 840.00, low52w: 520.00, cap: 'Mid', sector: 'Building Materials' },
        { symbol: 'GREENPANEL', name: 'Greenpanel Industries Ltd.', price: 320.50, prevClose: 315.20, changePercent: 1.68, pe: 32.5, roe: 11.4, marketCap: '3,900 Cr', high52w: 450.00, low52w: 260.00, cap: 'Small', sector: 'Building Materials' },
        { symbol: 'JKTYRE', name: 'JK Tyre & Industries Ltd.', price: 410.20, prevClose: 405.10, changePercent: 1.26, pe: 14.5, roe: 18.5, marketCap: '10,700 Cr', high52w: 540.00, low52w: 210.00, cap: 'Small', sector: 'Auto Ancillary' },
        { symbol: 'CEATLTD', name: 'CEAT Ltd.', price: 2450.50, prevClose: 2420.10, changePercent: 1.26, pe: 18.5, roe: 12.8, marketCap: '9,900 Cr', high52w: 2900.00, low52w: 1800.00, cap: 'Mid', sector: 'Auto Ancillary' },
        { symbol: 'BIRLACORPN', name: 'Birla Corporation Ltd.', price: 1380.50, prevClose: 1365.20, changePercent: 1.12, pe: 28.5, roe: 6.8, marketCap: '10,600 Cr', high52w: 1750.00, low52w: 1100.00, cap: 'Mid', sector: 'Cement' },
        { symbol: 'HEG', name: 'HEG Ltd.', price: 2150.40, prevClose: 2120.10, changePercent: 1.43, pe: 22.5, roe: 12.4, marketCap: '8,300 Cr', high52w: 2900.00, low52w: 1500.00, cap: 'Small', sector: 'Industrial Products' },
        { symbol: 'GRAPHITE', name: 'Graphite India Ltd.', price: 580.20, prevClose: 572.10, changePercent: 1.42, pe: 32.5, roe: 8.5, marketCap: '11,300 Cr', high52w: 780.00, low52w: 420.00, cap: 'Small', sector: 'Industrial Products' },
        { symbol: 'GPIL', name: 'Godawari Power & Ispat Ltd.', price: 920.40, prevClose: 910.10, changePercent: 1.13, pe: 12.5, roe: 25.4, marketCap: '12,500 Cr', high52w: 1195.00, low52w: 540.00, cap: 'Small', sector: 'Metals' },
        { symbol: 'ELECTCAST', name: 'Electrosteel Castings Ltd.', price: 175.40, prevClose: 172.10, changePercent: 1.92, pe: 14.5, roe: 15.2, marketCap: '10,800 Cr', high52w: 220.00, low52w: 80.00, cap: 'Small', sector: 'Metals' },
        { symbol: 'PRAJIND', name: 'Praj Industries Ltd.', price: 680.50, prevClose: 670.20, changePercent: 1.54, pe: 42.5, roe: 18.5, marketCap: '12,500 Cr', high52w: 820.00, low52w: 450.00, cap: 'Mid', sector: 'Capital Goods' },
        { symbol: 'ISGEC', name: 'Isgec Heavy Engineering Ltd.', price: 1020.50, prevClose: 1005.20, changePercent: 1.52, pe: 24.5, roe: 10.4, marketCap: '7,500 Cr', high52w: 1350.00, low52w: 680.00, cap: 'Small', sector: 'Capital Goods' },
        { symbol: 'MASTEK', name: 'Mastek Ltd.', price: 2850.50, prevClose: 2810.20, changePercent: 1.43, pe: 32.5, roe: 18.5, marketCap: '8,700 Cr', high52w: 3200.00, low52w: 1950.00, cap: 'Small', sector: 'IT Services' },
        { symbol: 'RITES', name: 'RITES Ltd.', price: 680.20, prevClose: 672.40, changePercent: 1.16, pe: 18.5, roe: 22.4, marketCap: '16,300 Cr', high52w: 820.00, low52w: 450.00, cap: 'Mid', sector: 'Railways' }
    ],

    // 2.5 Cryptocurrencies Database
    cryptos: [
        { symbol: "BTC", name: "Bitcoin", priceUSD: 64230.50, price: 5395362.00, changePercent: 2.4, high: 5450000.00, low: 5300000.00, cap: "107L Cr", vol: "24.5B", mcap: "1.26T", category: "Layer 1/Layer 2" },
        { symbol: "ETH", name: "Ethereum", priceUSD: 3450.20, price: 289816.80, changePercent: -1.2, high: 295000.00, low: 286000.00, cap: "35L Cr", vol: "12.1B", mcap: "415B", category: "Layer 1/Layer 2" },
        { symbol: "BNB", name: "BNB", priceUSD: 590.80, price: 49627.20, changePercent: 5.6, high: 51200.00, low: 48000.00, cap: "7.2L Cr", vol: "1.8B", mcap: "87B", category: "Layer 1/Layer 2" },
        { symbol: "SOL", name: "Solana", priceUSD: 145.20, price: 12196.80, changePercent: 8.2, high: 12500.00, low: 11200.00, cap: "5.5L Cr", vol: "3.2B", mcap: "65B", category: "Layer 1/Layer 2" },
        { symbol: "XRP", name: "Ripple", priceUSD: 0.52, price: 43.68, changePercent: -0.5, high: 44.50, low: 42.90, cap: "2.4L Cr", vol: "900M", mcap: "28B", category: "Layer 1/Layer 2" },
        { symbol: "ADA", name: "Cardano", priceUSD: 0.45, price: 37.80, changePercent: 1.1, high: 38.50, low: 36.80, cap: "1.3L Cr", vol: "400M", mcap: "16B", category: "Layer 1/Layer 2" },
        { symbol: "DOGE", name: "Dogecoin", priceUSD: 0.124, price: 10.42, changePercent: 3.8, high: 11.20, low: 9.90, cap: "1.5L Cr", vol: "1.2B", mcap: "18B", category: "Meme Coins" },
        { symbol: "SHIB", name: "Shiba Inu", priceUSD: 0.000017, price: 0.001428, changePercent: -1.5, high: 0.00150, low: 0.00135, cap: "84K Cr", vol: "600M", mcap: "10B", category: "Meme Coins" },
        { symbol: "PEPE", name: "Pepe", priceUSD: 0.000012, price: 0.001008, changePercent: 24.5, high: 0.00115, low: 0.00085, cap: "42K Cr", vol: "1.5B", mcap: "5B", category: "Meme Coins" },
        { symbol: "WIF", name: "dogwifhat", priceUSD: 1.95, price: 163.80, changePercent: 4.6, high: 172.00, low: 155.00, cap: "16K Cr", vol: "350M", mcap: "1.9B", category: "Meme Coins" },
        { symbol: "DOT", name: "Polkadot", priceUSD: 5.80, price: 487.20, changePercent: -0.8, high: 495.00, low: 478.00, cap: "68K Cr", vol: "220M", mcap: "8.2B", category: "Layer 1/Layer 2" },
        { symbol: "LTC", name: "Litecoin", priceUSD: 75.30, price: 6325.20, changePercent: 0.5, high: 6420.00, low: 6210.00, cap: "47K Cr", vol: "380M", mcap: "5.6B", category: "Layer 1/Layer 2" },
        { symbol: "LINK", name: "Chainlink", priceUSD: 14.20, price: 1192.80, changePercent: 1.5, high: 1220.00, low: 1160.00, cap: "70K Cr", vol: "280M", mcap: "8.3B", category: "DeFi" },
        { symbol: "UNI", name: "Uniswap", priceUSD: 7.15, price: 600.60, changePercent: -2.3, high: 620.00, low: 585.00, cap: "36K Cr", vol: "190M", mcap: "4.3B", category: "DeFi" },
        { symbol: "NEAR", name: "Near Protocol", priceUSD: 5.10, price: 428.40, changePercent: 6.2, high: 442.00, low: 410.00, cap: "45K Cr", vol: "310M", mcap: "5.4B", category: "Layer 1/Layer 2" },
        { symbol: "MATIC", name: "Polygon", priceUSD: 0.58, price: 48.72, changePercent: 1.2, high: 50.20, low: 47.50, cap: "41K Cr", vol: "240M", mcap: "4.9B", category: "Layer 1/Layer 2" },
        { symbol: "FET", name: "Fetch.ai", priceUSD: 1.54, price: 129.36, changePercent: 12.5, high: 135.00, low: 115.00, cap: "32K Cr", vol: "850M", mcap: "3.8B", category: "AI & Big Data" },
        { symbol: "RNDR", name: "Render", priceUSD: 7.80, price: 655.20, changePercent: 5.2, high: 680.00, low: 620.00, cap: "25K Cr", vol: "620M", mcap: "3.0B", category: "AI & Big Data" },
        { symbol: "AGIX", name: "SingularityNET", priceUSD: 0.65, price: 54.60, changePercent: 8.9, high: 57.20, low: 50.10, cap: "6.7K Cr", vol: "240M", mcap: "800M", category: "AI & Big Data" },
        { symbol: "AVAX", name: "Avalanche", priceUSD: 26.40, price: 2217.60, changePercent: -2.1, high: 2280.00, low: 2170.00, cap: "87K Cr", vol: "290M", mcap: "10.4B", category: "Layer 1/Layer 2" },
        { symbol: "SUI", name: "Sui", priceUSD: 1.02, price: 85.68, changePercent: 9.4, high: 88.50, low: 78.20, cap: "11K Cr", vol: "180M", mcap: "1.3B", category: "Layer 1/Layer 2" },
        { symbol: "TRX", name: "Tron", priceUSD: 0.122, price: 10.25, changePercent: 0.4, high: 10.50, low: 10.05, cap: "90K Cr", vol: "210M", mcap: "10.7B", category: "Layer 1/Layer 2" },
        { symbol: "TON", name: "Toncoin", priceUSD: 7.52, price: 631.68, changePercent: 4.1, high: 7.80, low: 7.10, cap: "1.1L Cr", vol: "420M", mcap: "25.8B", category: "Layer 1/Layer 2" },
        { symbol: "ARB", name: "Arbitrum", priceUSD: 0.98, price: 82.32, changePercent: -1.2, high: 1.05, low: 0.95, cap: "21K Cr", vol: "310M", mcap: "2.8B", category: "Layer 1/Layer 2" },
        { symbol: "OP", name: "Optimism", priceUSD: 2.15, price: 180.60, changePercent: 3.4, high: 2.30, low: 2.05, cap: "22K Cr", vol: "280M", mcap: "2.4B", category: "Layer 1/Layer 2" },
        { symbol: "APT", name: "Aptos", priceUSD: 8.90, price: 747.60, changePercent: 6.8, high: 9.15, low: 8.50, cap: "35K Cr", vol: "410M", mcap: "3.9B", category: "Layer 1/Layer 2" },
        { symbol: "TIA", name: "Celestia", priceUSD: 6.45, price: 541.80, changePercent: -3.5, high: 7.10, low: 6.20, cap: "12K Cr", vol: "150M", mcap: "1.2B", category: "Layer 1/Layer 2" }
    ],


    // 3. Mutual Funds Database
    mutualFunds: [
        {"id":"jio-blackrock-alpha","name":"Jio BlackRock Alpha Fund - Direct","nav":10.00,"expenseRatio":0.10,"return3y":0.0,"return5y":0.0,"risk":"High","category":"Multi Cap","minSip":100,"pinned":true},
        {"id":"sbi-small-cap","name":"SBI Small Cap Fund - Growth","nav":168.42,"expenseRatio":0.68,"return3y":26.4,"return5y":22.8,"risk":"Very High","category":"Small Cap","minSip":500},
        {"id":"axis-bluechip","name":"Axis Bluechip Fund - Direct Growth","nav":54.1,"expenseRatio":0.45,"return3y":14.2,"return5y":16.5,"risk":"Low to Moderate","category":"Large Cap","minSip":1000},
        {"id":"parag-parikh-flexi","name":"Parag Parikh Flexi Cap Fund","nav":72.85,"expenseRatio":0.55,"return3y":21.8,"return5y":23.4,"risk":"High","category":"Flexi Cap","minSip":1000},
        {"id":"hdfc-midcap-opp","name":"HDFC Mid-Cap Opportunities Fund","nav":154.2,"expenseRatio":0.72,"return3y":24.5,"return5y":20.1,"risk":"Very High","category":"Mid Cap","minSip":500},
        {"id":"quant-active","name":"Quant Active Fund - Direct Growth","nav":620.15,"expenseRatio":0.75,"return3y":28.2,"return5y":27.8,"risk":"Very High","category":"Multi Cap","minSip":500},
        {"id":"icici-prudential-nasdaq","name":"ICICI Prudential NASDAQ 100 Index","nav":28.5,"expenseRatio":0.5,"return3y":12.8,"return5y":18.2,"risk":"High","category":"Index Fund","minSip":1000},
        {"id":"kotak-flexi-cap-fund-direct-growth-0","name":"Kotak Flexi Cap Fund - Direct Growth","nav":459.65,"expenseRatio":0.33,"return3y":13.9,"return5y":16.6,"risk":"Low","category":"Flexi Cap","minSip":500},
        {"id":"icici-prudential-elss-fund-direct-growth-1","name":"ICICI Prudential ELSS Fund - Direct Growth","nav":467.89,"expenseRatio":0.87,"return3y":26.4,"return5y":31.1,"risk":"Low","category":"ELSS","minSip":500},
        {"id":"mirae-asset-flexi-cap-fund-direct-growth-2","name":"Mirae Asset Flexi Cap Fund - Direct Growth","nav":709.25,"expenseRatio":1.09,"return3y":16.1,"return5y":15,"risk":"High","category":"Flexi Cap","minSip":500},
        {"id":"sbi-multi-cap-fund-direct-growth-3","name":"SBI Multi Cap Fund - Direct Growth","nav":634.51,"expenseRatio":0.12,"return3y":26,"return5y":21.4,"risk":"Moderate","category":"Multi Cap","minSip":1000},
        {"id":"hdfc-multi-cap-fund-direct-growth-4","name":"HDFC Multi Cap Fund - Direct Growth","nav":743.42,"expenseRatio":0.18,"return3y":22,"return5y":23,"risk":"Low","category":"Multi Cap","minSip":500},
        {"id":"quant-mid-cap-fund-direct-growth-5","name":"Quant Mid Cap Fund - Direct Growth","nav":305.08,"expenseRatio":0.92,"return3y":11.3,"return5y":9.6,"risk":"High","category":"Mid Cap","minSip":1000},
        {"id":"hdfc-multi-cap-fund-direct-growth-6","name":"HDFC Multi Cap Fund - Direct Growth","nav":596.01,"expenseRatio":0.54,"return3y":30.5,"return5y":35.1,"risk":"High","category":"Multi Cap","minSip":500},
        {"id":"sbi-elss-fund-direct-growth-7","name":"SBI ELSS Fund - Direct Growth","nav":63.38,"expenseRatio":0.52,"return3y":8.1,"return5y":5.8,"risk":"Very High","category":"ELSS","minSip":1000},
        {"id":"hdfc-small-cap-fund-direct-growth-8","name":"HDFC Small Cap Fund - Direct Growth","nav":496.77,"expenseRatio":1.07,"return3y":28.9,"return5y":29.6,"risk":"High","category":"Small Cap","minSip":1000},
        {"id":"sbi-index-fund-fund-direct-growth-9","name":"SBI Index Fund Fund - Direct Growth","nav":23.33,"expenseRatio":1,"return3y":26.1,"return5y":29.5,"risk":"Very High","category":"Index Fund","minSip":1000},
        {"id":"tata-flexi-cap-fund-direct-growth-10","name":"Tata Flexi Cap Fund - Direct Growth","nav":301.06,"expenseRatio":1.08,"return3y":16.5,"return5y":18.1,"risk":"High","category":"Flexi Cap","minSip":500},
        {"id":"nippon-india-sectoral-fund-direct-growth-11","name":"Nippon India Sectoral Fund - Direct Growth","nav":215.69,"expenseRatio":0.48,"return3y":9.2,"return5y":12.2,"risk":"Low","category":"Sectoral","minSip":500},
        {"id":"nippon-india-large-cap-fund-direct-growth-12","name":"Nippon India Large Cap Fund - Direct Growth","nav":241.15,"expenseRatio":0.56,"return3y":27.9,"return5y":24.4,"risk":"Very High","category":"Large Cap","minSip":500},
        {"id":"sbi-mid-cap-fund-direct-growth-13","name":"SBI Mid Cap Fund - Direct Growth","nav":647.38,"expenseRatio":1.04,"return3y":27.9,"return5y":30.7,"risk":"Very High","category":"Mid Cap","minSip":500},
        {"id":"sbi-index-fund-fund-direct-growth-14","name":"SBI Index Fund Fund - Direct Growth","nav":299.79,"expenseRatio":0.59,"return3y":24.1,"return5y":27.2,"risk":"Moderate","category":"Index Fund","minSip":1000},
        {"id":"parag-parikh-elss-fund-direct-growth-15","name":"Parag Parikh ELSS Fund - Direct Growth","nav":664.09,"expenseRatio":0.98,"return3y":22.1,"return5y":23.6,"risk":"Very High","category":"ELSS","minSip":500},
        {"id":"icici-prudential-large-cap-fund-direct-growth-16","name":"ICICI Prudential Large Cap Fund - Direct Growth","nav":343.26,"expenseRatio":0.18,"return3y":27.6,"return5y":29.2,"risk":"Low","category":"Large Cap","minSip":500},
        {"id":"hdfc-elss-fund-direct-growth-17","name":"HDFC ELSS Fund - Direct Growth","nav":542.29,"expenseRatio":0.36,"return3y":31.1,"return5y":34.5,"risk":"Low","category":"ELSS","minSip":500},
        {"id":"quant-elss-fund-direct-growth-18","name":"Quant ELSS Fund - Direct Growth","nav":299.83,"expenseRatio":0.79,"return3y":27.3,"return5y":29.6,"risk":"High","category":"ELSS","minSip":500},
        {"id":"nippon-india-elss-fund-direct-growth-19","name":"Nippon India ELSS Fund - Direct Growth","nav":742.04,"expenseRatio":0.21,"return3y":25.9,"return5y":26.3,"risk":"Very High","category":"ELSS","minSip":500},
        {"id":"uti-flexi-cap-fund-direct-growth-20","name":"UTI Flexi Cap Fund - Direct Growth","nav":334.59,"expenseRatio":1.13,"return3y":33.8,"return5y":33.1,"risk":"High","category":"Flexi Cap","minSip":500},
        {"id":"nippon-india-mid-cap-fund-direct-growth-21","name":"Nippon India Mid Cap Fund - Direct Growth","nav":702.79,"expenseRatio":0.59,"return3y":10,"return5y":7,"risk":"Low","category":"Mid Cap","minSip":500},
        {"id":"axis-index-fund-fund-direct-growth-22","name":"Axis Index Fund Fund - Direct Growth","nav":241.41,"expenseRatio":0.14,"return3y":25,"return5y":21.1,"risk":"Low","category":"Index Fund","minSip":1000},
        {"id":"quant-large-cap-fund-direct-growth-23","name":"Quant Large Cap Fund - Direct Growth","nav":568.21,"expenseRatio":0.78,"return3y":12.4,"return5y":7.6,"risk":"Very High","category":"Large Cap","minSip":500},
        {"id":"uti-index-fund-fund-direct-growth-24","name":"UTI Index Fund Fund - Direct Growth","nav":720.66,"expenseRatio":0.64,"return3y":23.7,"return5y":22.7,"risk":"High","category":"Index Fund","minSip":500},
        {"id":"kotak-small-cap-fund-direct-growth-25","name":"Kotak Small Cap Fund - Direct Growth","nav":696.02,"expenseRatio":0.47,"return3y":10.3,"return5y":11.3,"risk":"Low","category":"Small Cap","minSip":500},
        {"id":"axis-index-fund-fund-direct-growth-26","name":"Axis Index Fund Fund - Direct Growth","nav":236.93,"expenseRatio":0.82,"return3y":17.6,"return5y":21.7,"risk":"Low","category":"Index Fund","minSip":500},
        {"id":"parag-parikh-small-cap-fund-direct-growth-27","name":"Parag Parikh Small Cap Fund - Direct Growth","nav":583.26,"expenseRatio":0.11,"return3y":16.4,"return5y":11.9,"risk":"Very High","category":"Small Cap","minSip":500},
        {"id":"icici-prudential-mid-cap-fund-direct-growth-28","name":"ICICI Prudential Mid Cap Fund - Direct Growth","nav":481.52,"expenseRatio":0.54,"return3y":23.8,"return5y":20.8,"risk":"Moderate","category":"Mid Cap","minSip":500},
        {"id":"hdfc-mid-cap-fund-direct-growth-29","name":"HDFC Mid Cap Fund - Direct Growth","nav":122.16,"expenseRatio":0.7,"return3y":34.3,"return5y":39,"risk":"Moderate","category":"Mid Cap","minSip":1000},
        {"id":"hdfc-mid-cap-fund-direct-growth-30","name":"HDFC Mid Cap Fund - Direct Growth","nav":46.6,"expenseRatio":0.81,"return3y":28.6,"return5y":31.2,"risk":"Moderate","category":"Mid Cap","minSip":500},
        {"id":"nippon-india-sectoral-fund-direct-growth-31","name":"Nippon India Sectoral Fund - Direct Growth","nav":634.34,"expenseRatio":0.22,"return3y":17.3,"return5y":16.7,"risk":"Low","category":"Sectoral","minSip":1000},
        {"id":"icici-prudential-elss-fund-direct-growth-32","name":"ICICI Prudential ELSS Fund - Direct Growth","nav":644.33,"expenseRatio":0.81,"return3y":30.9,"return5y":32.5,"risk":"Moderate","category":"ELSS","minSip":500},
        {"id":"icici-prudential-flexi-cap-fund-direct-growth-33","name":"ICICI Prudential Flexi Cap Fund - Direct Growth","nav":257.64,"expenseRatio":0.21,"return3y":10.2,"return5y":5.4,"risk":"Very High","category":"Flexi Cap","minSip":1000},
        {"id":"tata-large-cap-fund-direct-growth-34","name":"Tata Large Cap Fund - Direct Growth","nav":99.12,"expenseRatio":1.18,"return3y":19.3,"return5y":20.8,"risk":"Moderate","category":"Large Cap","minSip":500},
        {"id":"dsp-large-cap-fund-direct-growth-35","name":"DSP Large Cap Fund - Direct Growth","nav":37.77,"expenseRatio":1.08,"return3y":25.1,"return5y":26,"risk":"High","category":"Large Cap","minSip":500},
        {"id":"sbi-flexi-cap-fund-direct-growth-36","name":"SBI Flexi Cap Fund - Direct Growth","nav":668.99,"expenseRatio":0.43,"return3y":26.7,"return5y":24.6,"risk":"High","category":"Flexi Cap","minSip":500},
        {"id":"dsp-mid-cap-fund-direct-growth-37","name":"DSP Mid Cap Fund - Direct Growth","nav":54.47,"expenseRatio":0.35,"return3y":31.5,"return5y":34.8,"risk":"Moderate","category":"Mid Cap","minSip":1000},
        {"id":"mirae-asset-elss-fund-direct-growth-38","name":"Mirae Asset ELSS Fund - Direct Growth","nav":771.42,"expenseRatio":0.48,"return3y":10.8,"return5y":6.8,"risk":"Moderate","category":"ELSS","minSip":500},
        {"id":"kotak-large-cap-fund-direct-growth-39","name":"Kotak Large Cap Fund - Direct Growth","nav":535.3,"expenseRatio":0.67,"return3y":11.8,"return5y":16.1,"risk":"High","category":"Large Cap","minSip":500},
        {"id":"kotak-sectoral-fund-direct-growth-40","name":"Kotak Sectoral Fund - Direct Growth","nav":303.79,"expenseRatio":0.9,"return3y":25.2,"return5y":25.4,"risk":"Very High","category":"Sectoral","minSip":500},
        {"id":"nippon-india-flexi-cap-fund-direct-growth-41","name":"Nippon India Flexi Cap Fund - Direct Growth","nav":48.68,"expenseRatio":0.3,"return3y":20.5,"return5y":18.8,"risk":"Very High","category":"Flexi Cap","minSip":500},
        {"id":"hdfc-index-fund-fund-direct-growth-42","name":"HDFC Index Fund Fund - Direct Growth","nav":467.4,"expenseRatio":0.86,"return3y":33.3,"return5y":33.5,"risk":"Low","category":"Index Fund","minSip":1000},
        {"id":"mirae-asset-flexi-cap-fund-direct-growth-43","name":"Mirae Asset Flexi Cap Fund - Direct Growth","nav":759.88,"expenseRatio":1.03,"return3y":30,"return5y":33.9,"risk":"Low","category":"Flexi Cap","minSip":500},
        {"id":"mirae-asset-large-cap-fund-direct-growth-44","name":"Mirae Asset Large Cap Fund - Direct Growth","nav":465.04,"expenseRatio":0.54,"return3y":16.6,"return5y":18.5,"risk":"Low","category":"Large Cap","minSip":1000},
        {"id":"kotak-flexi-cap-fund-direct-growth-45","name":"Kotak Flexi Cap Fund - Direct Growth","nav":554.34,"expenseRatio":0.77,"return3y":19.5,"return5y":23.7,"risk":"Very High","category":"Flexi Cap","minSip":1000}
],

    // 4. ETFs Database
    etfs: [
        { symbol: "NIFTYBEES", name: "Nippon India ETF Nifty BeES", price: 268.42, changePercent: 0.52, expenseRatio: 0.04, trackingError: 0.03, volume: 1540000, theme: "Core Indices" },
        { symbol: "JUNIORBEES", name: "Nippon India ETF Nifty Next 50 BeES", price: 610.50, changePercent: 0.78, expenseRatio: 0.15, trackingError: 0.06, volume: 320000, theme: "Core Indices" },
        { symbol: "MON100", name: "Motilal Oswal Nasdaq 100 ETF", price: 162.80, changePercent: -0.92, expenseRatio: 0.50, trackingError: 0.10, volume: 450000, theme: "Core Indices" },
        { symbol: "SENSEXETF", name: "HDFC Sensex ETF", price: 785.30, changePercent: 0.38, expenseRatio: 0.05, trackingError: 0.02, volume: 680000, theme: "Core Indices" },
        { symbol: "BANKBEES", name: "Nippon India ETF Bank BeES", price: 540.20, changePercent: 1.45, expenseRatio: 0.09, trackingError: 0.04, volume: 1120000, theme: "Sectoral / Tech" },
        { symbol: "ITBEES", name: "Nippon India ETF IT BeES", price: 382.40, changePercent: -0.45, expenseRatio: 0.22, trackingError: 0.05, volume: 950000, theme: "Sectoral / Tech" },
        { symbol: "INFRA", name: "ICICI Prudential Infrastructure ETF", price: 118.90, changePercent: 1.12, expenseRatio: 0.25, trackingError: 0.08, volume: 220000, theme: "Sectoral / Tech" },
        { symbol: "PSUBNKBEES", name: "Nippon India ETF PSU Bank BeES", price: 78.55, changePercent: 2.10, expenseRatio: 0.19, trackingError: 0.07, volume: 340000, theme: "Sectoral / Tech" },
        { symbol: "PHARMABEES", name: "Nippon India ETF Pharma BeES", price: 195.20, changePercent: 0.65, expenseRatio: 0.21, trackingError: 0.06, volume: 280000, theme: "Sectoral / Tech" },
        { symbol: "GOLDBEES", name: "Nippon India ETF Gold BeES", price: 62.50, changePercent: -0.15, expenseRatio: 0.12, trackingError: 0.05, volume: 850000, theme: "Commodities & Debt" },
        { symbol: "LIQUIDBEES", name: "Nippon India ETF Liquid BeES", price: 1000.00, changePercent: 0.00, expenseRatio: 0.65, trackingError: 0.01, volume: 1500000, theme: "Commodities & Debt" },
        { symbol: "SILVERBEES", name: "Nippon India Silver ETF", price: 89.75, changePercent: 0.88, expenseRatio: 0.20, trackingError: 0.04, volume: 410000, theme: "Commodities & Debt" },
        { symbol: "CPSEETF", name: "Nippon India CPSE ETF", price: 45.80, changePercent: 1.78, expenseRatio: 0.07, trackingError: 0.05, volume: 920000, theme: "Thematic & ESG" },
        { symbol: "BHARAT22", name: "ICICI Prudential Bharat 22 ETF", price: 112.40, changePercent: 0.92, expenseRatio: 0.07, trackingError: 0.06, volume: 650000, theme: "Thematic & ESG" },
        { symbol: "HNGSNGBEES", name: "Nippon India Hang Seng BeES", price: 325.60, changePercent: -1.35, expenseRatio: 0.55, trackingError: 0.12, volume: 175000, theme: "International" },
        { symbol: "MAFANG", name: "Mirae Asset NYSE FANG+ ETF", price: 72.40, changePercent: -0.68, expenseRatio: 0.48, trackingError: 0.15, volume: 230000, theme: "International" }
    ],

    // 5. IPO Database
    ipos: [
        { 
            name: "Hyundai Motor India Ltd", 
            type: "Mainboard", 
            status: "Upcoming", 
            gmp: 180, 
            gmpPercent: 9.2, 
            openDate: "Jul 12, 2026", 
            closeDate: "Jul 15, 2026", 
            priceBand: "₹1,860 - ₹1,960", 
            lotSize: 7, 
            size: "25,000 Cr", 
            exchange: "NSE & BSE",
            allotmentDate: "Jul 18, 2026",
            listingDate: "Jul 22, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 0.0,
            subBreakdown: { retail: 0.0, nii: 0.0, qib: 0.0 },
            gmpTrend: [120, 140, 150, 165, 180]
        },
        { 
            name: "Knack Packaging Ltd", 
            type: "Mainboard", 
            status: "Open", 
            gmp: 15, 
            gmpPercent: 8.8, 
            openDate: "Jul 01, 2026", 
            closeDate: "Jul 03, 2026", 
            priceBand: "₹161 - ₹170", 
            lotSize: 85, 
            size: "180 Cr", 
            exchange: "NSE & BSE",
            allotmentDate: "Jul 06, 2026",
            listingDate: "Jul 09, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 2.45,
            subBreakdown: { retail: 3.2, nii: 1.8, qib: 2.1 },
            gmpTrend: [10, 12, 12, 14, 15]
        },
        { 
            name: "IC Electricals Company Ltd", 
            type: "SME", 
            status: "Upcoming", 
            gmp: 25, 
            gmpPercent: 25.3, 
            openDate: "Jul 03, 2026", 
            closeDate: "Jul 07, 2026", 
            priceBand: "₹94 - ₹99", 
            lotSize: 1200, 
            size: "45 Cr", 
            exchange: "NSE SME",
            allotmentDate: "Jul 10, 2026",
            listingDate: "Jul 14, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 0.0,
            subBreakdown: { retail: 0.0, nii: 0.0, qib: 0.0 },
            gmpTrend: [15, 18, 20, 22, 25]
        },
        { 
            name: "Seemax Resources Ltd", 
            type: "SME", 
            status: "Open", 
            gmp: 8, 
            gmpPercent: 5.7, 
            openDate: "Jun 30, 2026", 
            closeDate: "Jul 02, 2026", 
            priceBand: "₹134 - ₹141", 
            lotSize: 1000, 
            size: "12 Cr", 
            exchange: "BSE SME",
            allotmentDate: "Jul 05, 2026",
            listingDate: "Jul 08, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 1.15,
            subBreakdown: { retail: 1.5, nii: 0.8, qib: 1.0 },
            gmpTrend: [5, 6, 6, 7, 8]
        },
        { 
            name: "Atharva Polyplast Ltd", 
            type: "SME", 
            status: "Open", 
            gmp: 10, 
            gmpPercent: 16.7, 
            openDate: "Jun 30, 2026", 
            closeDate: "Jul 02, 2026", 
            priceBand: "₹55 - ₹60", 
            lotSize: 2000, 
            size: "15 Cr", 
            exchange: "BSE SME",
            allotmentDate: "Jul 05, 2026",
            listingDate: "Jul 08, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 4.82,
            subBreakdown: { retail: 6.2, nii: 3.5, qib: 4.1 },
            gmpTrend: [6, 7, 8, 9, 10]
        },
        { 
            name: "Ola Electric Mobility Ltd", 
            type: "Mainboard", 
            status: "Closed", 
            gmp: 12, 
            gmpPercent: 15.7, 
            openDate: "Jun 20, 2026", 
            closeDate: "Jun 23, 2026", 
            priceBand: "₹72 - ₹76", 
            lotSize: 195, 
            size: "6,150 Cr", 
            exchange: "NSE & BSE",
            allotmentDate: "Jun 26, 2026",
            listingDate: "Jun 30, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 4.25,
            subBreakdown: { retail: 5.4, nii: 3.2, qib: 4.1 },
            gmpTrend: [15, 14, 13, 12, 12]
        },
        { 
            name: "Waterways Leisure Tourism Ltd", 
            type: "Mainboard", 
            status: "Closed", 
            gmp: -46, 
            gmpPercent: -5.7, 
            openDate: "Jun 23, 2026", 
            closeDate: "Jun 25, 2026", 
            priceBand: "₹769 - ₹808", 
            lotSize: 18, 
            size: "900 Cr", 
            exchange: "NSE & BSE",
            allotmentDate: "Jun 29, 2026",
            listingDate: "Jul 01, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 0.78,
            subBreakdown: { retail: 0.9, nii: 0.5, qib: 0.8 },
            gmpTrend: [-20, -30, -35, -42, -46]
        },
        { 
            name: "Go Digit General Insurance", 
            type: "Mainboard", 
            status: "Closed", 
            gmp: 25, 
            gmpPercent: 9.1, 
            openDate: "May 15, 2026", 
            closeDate: "May 17, 2026", 
            priceBand: "₹258 - ₹272", 
            lotSize: 55, 
            size: "2,614 Cr", 
            exchange: "NSE & BSE",
            allotmentDate: "May 20, 2026",
            listingDate: "May 23, 2026",
            prospectus: "https://www.sebi.gov.in",
            subscription: 9.60,
            subBreakdown: { retail: 12.4, nii: 8.2, qib: 9.1 },
            gmpTrend: [18, 20, 22, 24, 25]
        }
    ],

    // 6. Educational Courses Database
    courses: [
        {
            id: "basics",
            title: "Stock Market Basics",
            difficulty: "Beginner",
            lessons: 4,
            chapters: [
                { title: "Introduction to Equity", text: "Equity represents ownership in a company. When you purchase shares, you own a tiny portion of the assets and earnings. Markets exist to facilitate this transfer of ownership safely." },
                { title: "SENSEX & NIFTY Explained", text: "Sensex represents the top 30 stocks of the Bombay Stock Exchange (BSE). Nifty 50 represents the top 50 diversified stocks of the National Stock Exchange (NSE). They measure the economic pulse of India." },
                { title: "Orders: Limit vs Market", text: "A Market Order buys immediately at the best available price. A Limit Order sets the maximum price you are willing to pay, waiting for the price to fall to your level." },
                { title: "Compounding Mechanics", text: "Albert Einstein famously called compounding the eighth wonder of the world. By reinvesting your profits, you earn returns on your returns, creating exponential wealth over decades." }
            ],
            quiz: [
                { q: "What does buying a stock represent?", a: ["A loan to the company", "Partial ownership of the company", "A promise of guaranteed dividends"], correct: 1 },
                { q: "Which index represents the top 50 stocks on the NSE?", a: ["SENSEX", "NIFTY 50", "BANK NIFTY"], correct: 1 },
                { q: "Which order guarantees a specific entry price?", a: ["Market Order", "Limit Order", "Stop-Loss Order"], correct: 1 }
            ]
        },
        {
            id: "candlesticks",
            title: "Candlestick Patterns",
            difficulty: "Intermediate",
            lessons: 3,
            chapters: [
                { title: "Anatomy of a Candlestick", text: "A candlestick represents price action in a specific timeframe. It has a 'Body' (opening to closing price range) and 'Wicks' (showing the high and low prices reached during the period)." },
                { title: "Bullish Reversal Patterns", text: "Patterns like the 'Hammer' (long lower shadow, tiny body) and 'Bullish Engulfing' (a green body swallowing the previous day's red body) suggest selling pressure is exhausted and bulls are taking control." },
                { title: "Bearish Alert Patterns", text: "Patterns like the 'Shooting Star' (long upper shadow, tiny body at bottom) or 'Dark Cloud Cover' suggest buyers tried pushing higher but were aggressively rejected by sellers." }
            ],
            quiz: [
                { q: "What does a long lower shadow (wick) on a hammer indicate?", a: ["Strong buying rejection of lower prices", "Strong selling rejection of higher prices", "Low volume trading"], correct: 0 },
                { q: "In a bullish engulfing pattern, what happens?", a: ["A red candle swallows a green candle", "A green candle swallows a red candle", "Two candles form a doji"], correct: 1 }
            ]
        },
        {
            id: "fno",
            title: "Futures & Options (F&O)",
            difficulty: "Advanced",
            lessons: 3,
            chapters: [
                { title: "Derivatives Philosophy", text: "Derivatives derive their value from an underlying asset (like Nifty or Reliance). They were invented to hedge risk, but are heavily used for high-leverage speculation." },
                { title: "Calls vs Puts", text: "A Call option gives you the right (but not obligation) to BUY a stock at a fixed price. A Put option gives you the right to SELL a stock at a fixed price. Buyers pay a premium to sellers." },
                { q: "Risk Mitigation", text: "F&O is highly leveraged. 90% of active retail F&O traders incur losses. Always use strict stop-losses, and never trade derivatives with money you cannot afford to lose entirely." }
            ],
            quiz: [
                { q: "What is the primary original purpose of derivatives?", a: ["Speculative leverage", "Hedging existing portfolio risk", "Guaranteed daily profits"], correct: 1 },
                { q: "If you buy a Call option, you expect the market to:", a: ["Go down", "Go up", "Consolidate sideways"], correct: 1 }
            ]
        }
    ],

    // 7. Community Feeds
    community: {
        posts: [
            { id: 1, author: "Ramesh Damani", avatar: "RD", badge: "Verified Expert", content: "Tata Motors margins are expanding nicely. With JLR debt reduction pacing ahead of schedules, ₹1150 seems like a conservative target for Q4. Accumulate on dips.", stockTag: "TATAMOTORS", likes: 242, comments: 45, time: "2 hrs ago" },
            { id: 2, author: "Pooja Sharma", avatar: "PS", badge: "Value Investor", content: "Is anyone looking at HDFC Bank's historical valuation? P/B of 3.1x is what it was during the 2013-14 crunch. Looks like a solid risk-reward zone here.", stockTag: "HDFCBANK", likes: 118, comments: 22, time: "4 hrs ago" },
            { id: 3, author: "Vijay Kedia", avatar: "VK", badge: "Verified Expert", content: "Small caps are seeing massive volume distribution. I would highly suggest tightening trailing stop losses. Rotate some capital back into defensives like ITC and HDFC Bank.", stockTag: "ITC", likes: 512, comments: 89, time: "6 hrs ago" }
        ],
        polls: [
            { id: 1, question: "Where will Nifty 50 head by the end of July?", options: ["Above 24,500", "Rangebound (23.8k - 24.5k)", "Correction below 23,800"], votes: [480, 290, 150] }
        ]
    },

    // 8. Financial News Feed with AI Summary Configurations
    news: [
        {
            id: 1,
            title: "SEBI introduces stricter guidelines for SME IPOs amid retail frenzy",
            source: "Economic Times",
            time: "1 hour ago",
            sentiment: "Negative",
            aiSummary: "The market regulator SEBI has proposed raising the minimum application size for SME IPOs from ₹1 Lakh to ₹2-4 Lakhs. This is aimed at protecting retail investors from extreme speculation and ensuring only sophisticated market participants engage in small-cap SME issues."
        },
        {
            id: 2,
            title: "TCS bags $1.2B mega IT infrastructure modernization contract in Europe",
            source: "Business Standard",
            time: "3 hours ago",
            sentiment: "Bullish",
            aiSummary: "Tata Consultancy Services (TCS) has secured a long-term strategic deal with a European insurance major. This highlights resilient spending in cloud transitions and AI infrastructure upgrades, easing concerns about IT sector growth slows."
        },
        {
            id: 3,
            title: "GST Council leaves tax slabs unchanged; rationalizes rates on space-grade components",
            source: "Mint",
            time: "5 hours ago",
            sentiment: "Neutral",
            aiSummary: "The 53rd GST Council meeting led by Finance Minister Nirmala Sitharaman concluded with major revisions focused on resolving pending taxpayer disputes. Tweak to space industry parts (reduced to 5%) aligns with the domestic manufacturing thrust."
        }
    ],

    // 9. Initial Default User State (Portfolio, Watchlist, Goals)
    userState: {
        portfolio: {
            cash: 85200.00,
            holdings: [
                { symbol: "TATAMOTORS", shares: 150, avgCost: 780.00 }, // Current price: 984.50 (Profit)
                { symbol: "HDFCBANK", shares: 200, avgCost: 1580.00 },  // Current price: 1675.80 (Profit)
                { symbol: "RELIANCE", shares: 80, avgCost: 2980.00 }   // Current price: 2950.25 (Loss)
            ],
            transactions: [
                { date: "15-Apr-2026", type: "BUY", symbol: "HDFCBANK", shares: 200, price: 1580.00 },
                { date: "02-May-2026", type: "BUY", symbol: "TATAMOTORS", shares: 150, price: 780.00 },
                { date: "10-Jun-2026", type: "BUY", symbol: "RELIANCE", shares: 80, price: 2980.00 }
            ]
        },
        watchlist: ["TATAMOTORS", "INFY", "ITC", "ZOMATO"],
        goals: [
            { id: "house", name: "Downpayment: House", target: 1500000, current: 482000, deadline: "2029" },
            { id: "retirement", name: "Retirement Corpus", target: 5000000, current: 852000, deadline: "2040" },
            { id: "car", name: "Buy EV Car", target: 800000, current: 150000, deadline: "2027" }
        ],
        alerts: [
            { id: 1, symbol: "TATAMOTORS", type: "Price", threshold: 1000, direction: "Above", msg: "Tata Motors is approaching ₹1000 psychological resistance.", explanation: "AI Alert: Crossing 1000 can trigger institutional short-covering, leading to a momentum breakout toward 1100." }
        ],
        settings: {
            isPremium: false,
            language: "English",
            notificationsEnabled: true
        }
    }
};
console.log("BullVerse India mock database initialized successfully.");
