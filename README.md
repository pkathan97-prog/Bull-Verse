# BullVerse India (Full-Stack Setup Guide)

BullVerse India is India's AI-Powered Intelligent Stock Exchange platform. This application features a complete **Node.js Express Backend** connected to a serverless **SQLite Database** file, supporting secure **JWT Session Authentication** and real **Google Authenticator Two-Factor Security (2FA)**.

---

## 💻 How to Install Node.js on macOS

Since your system does not currently have Node.js and `npm` installed, follow these simple steps to install them in under 2 minutes:

1. **Download the Installer**:
   Open your browser and navigate to the official Node.js download site: [https://nodejs.org/](https://nodejs.org/)
   *Download the **LTS (Long Term Support)** installer for macOS (a `.pkg` file).*
2. **Run Installer**:
   Double-click the downloaded `.pkg` file in your Downloads folder and follow the standard installation prompts (agree to terms, click Continue and Install).
3. **Verify Installation**:
   Open a terminal window and check versions to verify successful installation:
   ```bash
   node -v
   npm -v
   ```

---

## 🚀 Running the Application Backend & Database

Once Node.js is installed on your Mac, you can start the secure database connection:

1. **Navigate to the Server folder**:
   In your terminal, navigate to the project backend server directory:
   ```bash
   cd "/Users/patelkathans/finance website/server"
   ```
2. **Install Dependencies**:
   Install Express, SQLite client, JWT, SpearEasy 2FA and QR Code builders by running:
   ```bash
   npm install
   ```
3. **Start the API Server**:
   Launch the REST gateway and SQLite database file:
   ```bash
   npm start
   ```
   *You will see the console log:*
   ```text
   Connecting to local SQLite database at: .../server/database.sqlite
   Successfully connected to SQLite database.
   SQLite database schemas validated and active.
   =========================================
   BullVerse Backend running on port 5000
   REST Gateways connected to SQLite engine.
   =========================================
   ```
4. **Open Frontend**:
   Double-click the [index.html](file:///Users/patelkathans/finance%20website/index.html) file to open the dashboard!

---

## 🔒 Experience the Secure Auth & 2FA Flow

When the server is active, opening `index.html` will lock access until you authenticate:

1. **Create Account**:
   Click **Register Account** at the bottom of the lock screen. Enter your email and a password, then click register.
2. **Scan Google Authenticator QR Code**:
   A custom QR code compiled by the backend `speakeasy` module will render on screen.
   - Open **Google Authenticator** (or any TOTP app like Authy) on your phone.
   - Tap the `+` sign and select **Scan a QR Code**. Scan the QR code on your computer screen.
3. **Sign In**:
   Click "My Google Authenticator is configured". In the sign-in form, enter your credentials.
   - The form will validate your password, then ask you for the active **6-digit 2FA passcode** shown on your phone app.
   - Type the code and press Enter.
4. **Demat Balance & Trades**:
   Once logged in, the database will initialize you with a Starting Wallet cash balance of **₹10,00,000**.
   - Buy/Sell Stocks or Spot Cryptocurrencies (BTC, ETH, SOL, BNB).
   - Check the Admin Panel to view active users database lists and read real-time database query activity logs!

*Note: If you run index.html without launching the server, click "Run in Sandbox Fallback Mode" in the bottom-right of the lock screen to test it completely offline.*
