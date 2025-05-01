// server.js const express = require('express'); const fs = require('fs'); const path = require('path'); const bodyParser = require('body-parser'); const session = require('express-session');

const app = express(); const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true })); app.use(express.static('public')); app.set('view engine', 'ejs');

app.use(session({ secret: 'secretKey', resave: false, saveUninitialized: true }));

const USERS = { admin: '12345', standard: '12345' };

const DATA_FILE = path.join(__dirname, 'products.json');

function loadProducts() { if (!fs.existsSync(DATA_FILE)) return []; return JSON.parse(fs.readFileSync(DATA_FILE)); }

function saveProducts(products) { fs.writeFileSync(DATA_FILE, JSON.stringify(products, null, 2)); }

// Routes app.get('/', (req, res) => { res.render('login'); });

app.post('/login', (req, res) => { const { username, password } = req.body; if (USERS[username] && USERS[username] === password) { req.session.user = username; res.redirect('/products'); } else { res.send('Invalid credentials'); } });

app.get('/dashboard', (req, res) => { if (req.session.user === 'admin') { res.render('dashboard'); } else { res.send('Access denied. Admins only.'); } });

app.get('/products', (req, res) => { if (!req.session.user) return res.redirect('/'); const products = loadProducts(); res.render('products', { products, user: req.session.user }); });

app.post('/add-product', (req, res) => { const { name, price } = req.body; if (!name || !price) return res.send('Invalid input'); const products = loadProducts(); products.push({ id: Date.now(), name, price }); saveProducts(products); res.redirect('/products'); });

app.post('/delete-product', (req, res) => { const { id } = req.body; let products = loadProducts(); products = products.filter(p => p.id != id); saveProducts(products); res.redirect('/products'); });

app.listen(PORT, () => { console.log(Server running at http://localhost:${PORT}); });