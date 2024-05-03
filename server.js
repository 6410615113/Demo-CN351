// server.js
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: true,
    saveUninitialized: true
}));

// Sample accounts
const accounts = [
    { username: 'admin', password: 'test123' },
    { username: 'user', password: 'abc12345' },
    { username: 'user1', password: 'password1' },
    { username: 'user2', password: 'password2' }
];

// Sample database of animals and their sounds
const animalDatabase = {
    'cat': 'Meow',
    'dog': 'Woof',
    'cow': 'Moo',
    // Add more animals and their sounds as needed
};

// Login route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Inside page route
app.get('/index.html', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, 'index.html'));
        // res.send(\{req.session.username}! Your password is: ${req.session.password}`);
    } else {
        res.redirect('/');
    }
});

// Search route
app.get('/search', (req, res) => {
    const query = req.query.q;
    const sound = animalDatabase[query];
    if (sound) {
        res.send(`<p>The sound of ${query}: ${sound}</p>`);
    } else {
        res.send(`<p>Animal not found: ${query}</p>`);
    }
});

// Search page route
app.get('/search.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'search.html'));
});

// Login post route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        req.session.loggedIn = true;
        req.session.username = account.username;
        req.session.password = account.password;
        res.redirect('/index.html');
    } else {
        res.send('Invalid username or password');
    }
});

// Endpoint to retrieve username and password
app.get('/credentials', (req, res) => {
    if (req.session.loggedIn) {
        const credentials = {
            username: req.session.username,
            password: req.session.password
        };
        res.json(credentials);
    } else {
        res.status(401).send('Unauthorized');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
