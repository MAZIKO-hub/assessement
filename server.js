const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname));
const MemoryStore = require('memorystore')(session);

app.use(session({
  secret: 'mysecretkey',
  resave: false,
  saveUninitialized: true,
  store: new MemoryStore({
    checkPeriod: 86400000 // Prune expired entries every 24h
  })
}));

// Route: Login Page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/login.html'));
});

// Route: Handle Login
app.post('/login', (req, res) => {
  const { username, password, userType } = req.body;

  // Hardcoded credentials
  if (
    (userType === 'admin' && username === 'admin' && password === '1234') ||
    (userType === 'standard' && username === 'user' && password === 'abcd')
  ) {
    req.session.userType = userType;
    res.redirect("/home");
  } else {
    res.send('Invalid credentials. <a href="/">Try again</a>');
  }
});

// Route: Home Page
app.get("/home", (req, res) => {
  res.sendFile(path.join(__dirname, "/home.html"));
});

// Route: Dashboard Access Control
app.get('/Dashboard.html', (req, res) => {
  if (req.session.userType === 'admin') {
    res.sendFile(path.join(__dirname, 'Dashboard.html'));
  } else {
    res.send('Access Denied. <a href="/home.html">Go back</a>');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
