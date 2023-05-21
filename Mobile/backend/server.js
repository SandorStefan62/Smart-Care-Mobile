const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
dotenv.config();

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Create database connection
const db = new sqlite3.Database('database-mobile.db');

db.serialize(() => {
  // Create users table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  // Insert test users if the table is empty
  db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
    if (row.count === 0) {
      const saltRounds = 10;
      const users = [
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' },
        { email: 'user3@example.com', password: 'password3' },
      ];

      const hashPasswords = async () => {
        for (const user of users) {
          const salt = await bcrypt.genSalt(saltRounds);
          const hashedPassword = await bcrypt.hash(user.password, salt);
          db.run(
            `
            INSERT INTO users (email, password) VALUES (?, ?)
          `,
            [user.email, hashedPassword]
          );
        }
      };

      hashPasswords();
    }
  });

  // Create medical_readings table if it doesn't exist
  db.run(`
    CREATE TABLE IF NOT EXISTS medical_readings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tensiune TEXT NOT NULL,
      greutate REAL NOT NULL,
      temperatura REAL NOT NULL,
      glicemie REAL NOT NULL,
      timestamp TEXT NOT NULL 
    )
  `);
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      res.status(500).json('Internal server error');
    } else if (!row) {
      res.status(401).json('Invalid email or password');
    } else {
      const passwordMatch = await bcrypt.compare(password, row.password);
      if (passwordMatch) {
        const token = jwt.sign({ email: row.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
      } else {
        res.status(401).json('Invalid email or password');
      }
    }
  });
});

// Endpoint for submitting medical readings
// Endpoint for submitting medical readings
app.post('/api/medical-readings', (req, res) => {
  const { tensiune, greutate, temperatura, glicemie } = req.body;
  const timestamp = new Date().toISOString();

  db.run(
    `
    INSERT INTO medical_readings (tensiune, greutate, temperatura, glicemie, timestamp)
    VALUES (?, ?, ?, ?, ?)
    `,
    [tensiune, greutate, temperatura, glicemie, timestamp],
    (err) => {
      if (err) {
        console.error(err);
        res.status(500).json('Internal server error');
      } else {
        res.status(200).json('Medical readings stored successfully');
      }
    }
  );
});

// Endpoint for fetching medical readings
app.get('/api/medical-readings', (req, res) => {
  db.all('SELECT * FROM medical_readings', (err, rows) => {
    if (err) {
      console.error('Failed to fetch medical readings:', err.message);
      res.status(500).json('Internal server error');
    } else {
      res.status(200).json(rows);
    }
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
