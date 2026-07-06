// BullVerse India Auth & Biometric Authentication Middleware

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const JWT_SECRET = 'BULLVERSE_SUPER_SECRET_KEY_12345';

// 1. JWT Authentication Middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) return res.status(401).json({ error: 'Access Denied: No session token provided.' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Session expired or invalid.' });
        req.user = user;
        next();
    });
}

// 2. Auth router routes
function registerAuthRoutes(app) {
    
    // Register New Account
    app.post('/api/auth/register', (req, res) => {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        // Generate a random biometric credential ID to associate with the user
        const mockBiometricId = 'cred_' + Math.random().toString(36).substr(2, 9);

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = bcrypt.hashSync(password, salt);

        // Insert into DB
        db.run(
            `INSERT INTO users (email, password, secret_2fa, enabled_2fa) VALUES (?, ?, ?, ?)`,
            [email, hashedPassword, mockBiometricId, 1], // Enable biometric by default
            function(insertErr) {
                if (insertErr) {
                    return res.status(400).json({ error: 'Account already registered with this email address.' });
                }
                
                // Log action
                db.run(`INSERT INTO system_logs (timestamp, action, user_email) VALUES (?, ?, ?)`,
                    [new Date().toISOString(), 'User registered account & configured Biometrics', email]
                );

                res.json({
                    message: 'Account registered successfully with Biometric Touch/Face ID.',
                    biometricId: mockBiometricId
                });
            }
        );
    });

    // Login (Credentials validation)
    app.post('/api/auth/login', (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required.' });
        }

        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'Account not found with this email.' });
            }

            // Verify password
            const isPasswordValid = bcrypt.compareSync(password, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ error: 'Invalid password credentials.' });
            }

            // Login successful: Issue JWT session token
            const sessionToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Log action
            db.run(`INSERT INTO system_logs (timestamp, action, user_email) VALUES (?, ?, ?)`,
                [new Date().toISOString(), 'User logged in successfully (Password)', email]
            );

            res.json({
                message: 'Login successful.',
                token: sessionToken,
                email: user.email,
                cashBalance: user.cash_balance
            });
        });
    });

    // Biometric Login Endpoint
    app.post('/api/auth/biometric/login', (req, res) => {
        const { email, biometricId } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required for biometric authentication.' });
        }

        db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
            if (err || !user) {
                return res.status(400).json({ error: 'Account not found with this email.' });
            }

            // Validate biometric credential ID
            if (biometricId && user.secret_2fa !== biometricId) {
                return res.status(400).json({ error: 'Invalid biometric verification key.' });
            }

            // Generate JWT session token
            const sessionToken = jwt.sign(
                { id: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: '24h' }
            );

            // Log action
            db.run(`INSERT INTO system_logs (timestamp, action, user_email) VALUES (?, ?, ?)`,
                [new Date().toISOString(), 'User logged in successfully (Biometric Touch/Face ID)', email]
            );

            res.json({
                message: 'Biometric Authentication successful.',
                token: sessionToken,
                email: user.email,
                cashBalance: user.cash_balance
            });
        });
    });
}

module.exports = {
    authenticateToken,
    registerAuthRoutes
};
