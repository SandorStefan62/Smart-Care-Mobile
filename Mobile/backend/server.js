const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv')
const app = express();

dotenv.config()

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
// Create database connection
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
  // Create users table
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);
  // Insert some test users
  const saltRounds = 10;
  const users = [    { email: 'user1@example.com', password: 'password1' },    { email: 'user2@example.com', password: 'password2' },    { email: 'user3@example.com', password: 'password3' },  ];
  const hashPasswords = async () => {
    for (const user of users) {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(user.password, salt);
      db.run(`
        INSERT INTO users (email, password) VALUES (?, ?)
      `, [user.email, hashedPassword]);
    }
  };
  hashPasswords();
});

console.log("linia 40")
// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  console.log("linia 40")
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    console.log(err, row)
    console.log(req.body)
    console.log("linia 40")
    if (err) {
      res.status(500).json('Internal server error');
    } else if (!row) {

      res.status(401).json('Invalid email or password');
    } else {
        
      console.log(password, row.password, process.env.JWT_SECRET)  
      console.log("linia 58")
      const passwordMatch = await bcrypt.compare(password, row.password);
      console.log("linia 59")
      console.log(passwordMatch)
      console.log("linia 61")
      if (passwordMatch) {
        // Generate and sign JWT token
        const token = jwt.sign({ email: row.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log(token)
        console.log("linia 66")
        res.status(200).json({ token });
        console.log("linia 68")
      } else {
        console.log("am ajuns")
        res.status(401).json('Invalid email or password');
      }
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
