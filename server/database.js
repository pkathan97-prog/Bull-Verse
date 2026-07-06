// BullVerse India SQLite Database Controller
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.sqlite');
console.log(`Connecting to local SQLite database at: ${dbPath}`);

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('SQLite connection error:', err.message);
    } else {
        console.log('Successfully connected to SQLite database.');
        initializeSchema();
    }
});

function initializeSchema() {
    db.serialize(() => {
        // 1. Users Account Table
        db.run(`
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                secret_2fa TEXT NOT NULL,
                enabled_2fa INTEGER DEFAULT 0,
                cash_balance REAL DEFAULT 1000000.00
            )
        `);

        // 2. Asset Holdings Table
        db.run(`
            CREATE TABLE IF NOT EXISTS holdings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                symbol TEXT NOT NULL,
                shares INTEGER NOT NULL,
                avg_cost REAL NOT NULL,
                asset_type TEXT DEFAULT 'STOCK', -- 'STOCK' or 'CRYPTO'
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // 3. Transactions Ledger Logs Table
        db.run(`
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                date TEXT NOT NULL,
                type TEXT NOT NULL, -- 'BUY' or 'SELL'
                symbol TEXT NOT NULL,
                shares INTEGER NOT NULL,
                price REAL NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // 4. User Watchlist Symbols Table
        db.run(`
            CREATE TABLE IF NOT EXISTS watchlist (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                symbol TEXT NOT NULL,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
        `);

        // 5. System Logs Table
        db.run(`
            CREATE TABLE IF NOT EXISTS system_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                action TEXT NOT NULL,
                user_email TEXT
            )
        `);

        console.log('SQLite database schemas validated and active.');
    });
}

module.exports = db;
