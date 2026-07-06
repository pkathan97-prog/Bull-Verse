// BullVerse India API Web Server

const express = require('express');
const cors = require('cors');
const db = require('./database');
const { authenticateToken, registerAuthRoutes } = require('./auth');

const app = express();
const PORT = 5005;

// Enable CORS so the local index.html file:// can talk to localhost:5000
app.use(cors());
app.use(express.json());

// Register Login/Register Routes
registerAuthRoutes(app);

// =========================================================================
// 1. SECURE PORTFOLIO ENDPOINTS
// =========================================================================

// Retrieve Portfolio Holdings & Balance
app.get('/api/portfolio', authenticateToken, (req, res) => {
    const userId = req.user.id;

    // Get user details (cash balance)
    db.get(`SELECT cash_balance FROM users WHERE id = ?`, [userId], (userErr, user) => {
        if (userErr || !user) {
            return res.status(500).json({ error: 'Error fetching user profile data.' });
        }

        // Get active holdings
        db.all(`SELECT symbol, shares, avg_cost, asset_type FROM holdings WHERE user_id = ?`, [userId], (holdErr, holdings) => {
            if (holdErr) {
                return res.status(500).json({ error: 'Error fetching asset holdings.' });
            }

            // Get ledger transaction logs
            db.all(`SELECT date, type, symbol, shares, price FROM transactions WHERE user_id = ? ORDER BY id DESC`, [userId], (txErr, transactions) => {
                if (txErr) {
                    return res.status(500).json({ error: 'Error fetching ledger transactions.' });
                }

                // Get watchlist
                db.all(`SELECT symbol FROM watchlist WHERE user_id = ?`, [userId], (watchErr, watchlist) => {
                    const watchlistArray = watchErr ? [] : watchlist.map(w => w.symbol);

                    res.json({
                        cash: user.cash_balance,
                        holdings: holdings || [],
                        transactions: transactions || [],
                        watchlist: watchlistArray
                    });
                });
            });
        });
    });
});

// =========================================================================
// 2. SECURE TRADING / LEDGER ORDER ENDPOINT
// =========================================================================
app.post('/api/trade', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { action, symbol, shares, price, assetType } = req.body; // BUY/SELL, symbol, count, execution rate

    if (!action || !symbol || !shares || !price) {
        return res.status(400).json({ error: 'Trade params (action, symbol, shares, price) are required.' });
    }

    const type = assetType || 'STOCK';
    const totalCost = shares * price;

    db.get(`SELECT cash_balance FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) {
            return res.status(500).json({ error: 'User lookup failed.' });
        }

        if (action === 'BUY') {
            const availableMargin = user.cash_balance + 285000;
            if (availableMargin < totalCost) {
                return res.status(400).json({ error: `Insufficient cash balance. You need ₹${totalCost.toLocaleString()} but only have ₹${availableMargin.toLocaleString()}.` });
            }

            // Deduct Cash and Upsert Holdings
            const newBalance = user.cash_balance - totalCost;
            db.serialize(() => {
                db.run(`UPDATE users SET cash_balance = ? WHERE id = ?`, [newBalance, userId]);

                db.get(`SELECT * FROM holdings WHERE user_id = ? AND symbol = ?`, [userId, symbol], (hErr, existing) => {
                    if (existing) {
                        const oldCost = existing.shares * existing.avg_cost;
                        const newShares = existing.shares + shares;
                        const newAvg = (oldCost + totalCost) / newShares;
                        
                        db.run(
                            `UPDATE holdings SET shares = ?, avg_cost = ? WHERE id = ?`,
                            [newShares, newAvg, existing.id]
                        );
                    } else {
                        db.run(
                            `INSERT INTO holdings (user_id, symbol, shares, avg_cost, asset_type) VALUES (?, ?, ?, ?, ?)`,
                            [userId, symbol, shares, price, type]
                        );
                    }

                    // Log ledger transaction
                    const dateStr = new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});
                    db.run(
                        `INSERT INTO transactions (user_id, date, type, symbol, shares, price) VALUES (?, ?, ?, ?, ?, ?)`,
                        [userId, dateStr, 'BUY', symbol, shares, price]
                    );

                    // Add to system action logs
                    db.run(`INSERT INTO system_logs (timestamp, action, user_email) VALUES (?, ?, ?)`,
                        [new Date().toISOString(), `Bought ${shares} shares of ${symbol} at ₹${price}`, req.user.email]
                    );

                    res.json({ success: true, message: `Successfully bought ${shares} shares of ${symbol}.` });
                });
            });
        } 
        else if (action === 'SELL') {
            db.get(`SELECT * FROM holdings WHERE user_id = ? AND symbol = ?`, [userId, symbol], (hErr, existing) => {
                if (!existing || existing.shares < shares) {
                    return res.status(400).json({ error: `Insufficient holdings. You only hold ${existing ? existing.shares : 0} shares of ${symbol}.` });
                }

                // Add Cash and Decrease/Delete Holdings
                const newBalance = user.cash_balance + totalCost;
                const remainingShares = existing.shares - shares;

                db.serialize(() => {
                    db.run(`UPDATE users SET cash_balance = ? WHERE id = ?`, [newBalance, userId]);

                    if (remainingShares === 0) {
                        db.run(`DELETE FROM holdings WHERE id = ?`, [existing.id]);
                    } else {
                        db.run(`UPDATE holdings SET shares = ? WHERE id = ?`, [remainingShares, existing.id]);
                    }

                    // Log ledger transaction
                    const dateStr = new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'});
                    db.run(
                        `INSERT INTO transactions (user_id, date, type, symbol, shares, price) VALUES (?, ?, ?, ?, ?, ?)`,
                        [userId, dateStr, 'SELL', symbol, shares, price]
                    );

                    // Add to system action logs
                    db.run(`INSERT INTO system_logs (timestamp, action, user_email) VALUES (?, ?, ?)`,
                        [new Date().toISOString(), `Sold ${shares} shares of ${symbol} at ₹${price}`, req.user.email]
                    );

                    res.json({ success: true, message: `Successfully sold ${shares} shares of ${symbol}.` });
                });
            });
        } else {
            res.status(400).json({ error: 'Invalid order action type.' });
        }
    });
});

// =========================================================================
// 3. SECURE WATCHLIST ENDPOINTS
// =========================================================================
app.post('/api/watchlist/toggle', authenticateToken, (req, res) => {
    const userId = req.user.id;
    const { symbol } = req.body;

    if (!symbol) return res.status(400).json({ error: 'Symbol is required.' });

    db.get(`SELECT id FROM watchlist WHERE user_id = ? AND symbol = ?`, [userId, symbol], (err, exists) => {
        if (exists) {
            db.run(`DELETE FROM watchlist WHERE id = ?`, [exists.id], (delErr) => {
                res.json({ action: 'REMOVED', message: `${symbol} removed from watchlist.` });
            });
        } else {
            db.run(`INSERT INTO watchlist (user_id, symbol) VALUES (?, ?)`, [userId, symbol], (insErr) => {
                res.json({ action: 'ADDED', message: `${symbol} added to watchlist.` });
            });
        }
    });
});

// =========================================================================
// 4. OWNER ADMIN PANEL AUDITS
// =========================================================================
app.get('/api/admin/dashboard', authenticateToken, (req, res) => {
    // Audit list of users
    db.all(`SELECT id, email, cash_balance FROM users`, (err, users) => {
        if (err) return res.status(500).json({ error: 'Error loading admin user list.' });

        // Audit system logs
        db.all(`SELECT timestamp, action, user_email FROM system_logs ORDER BY id DESC LIMIT 50`, (logErr, logs) => {
            if (logErr) return res.status(500).json({ error: 'Error loading system logs.' });

            res.json({
                users: users || [],
                logs: logs || []
            });
        });
    });
});

// Start Server listening
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`BullVerse Backend running on port ${PORT}`);
    console.log(`REST Gateways connected to SQLite engine.`);
    console.log(`=========================================`);
});
