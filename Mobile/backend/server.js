const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
dotenv.config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('database-mobile.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL
    )
  `);

  db.get(`SELECT COUNT(*) AS count FROM users`, (err, row) => {
    if (err) {
      console.error('Failed to check user count:', err.message);
      return;
    }

    if (row.count === 0) {
      const saltRounds = 10;
      const users = [
        { email: 'user1@example.com', password: 'password1' },
        { email: 'user2@example.com', password: 'password2' },
        { email: 'user3@example.com', password: 'password3' },
      ];

      const hashPasswords = async () => {
        for (const user of users) {
          try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hashedPassword = await bcrypt.hash(user.password, salt);
            db.run(
              `INSERT INTO users (email, password) VALUES (?, ?)`,
              [user.email, hashedPassword],
              (err) => {
                if (err) {
                  console.error('Failed to insert user:', err.message);
                }
              }
            );
          } catch (err) {
            console.error('Failed to hash password:', err.message);
          }
        }
      };

      hashPasswords();
    }
  });

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

  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      createdAt TEXT NOT NULL
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender TEXT NOT NULL,
      recipient TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      conversationId INTEGER NOT NULL,
      FOREIGN KEY (conversationId) REFERENCES conversations(id)
    )
  `);
});

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;

  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).json('Invalid token');
      } else {
        req.user = decoded;
        next();
      }
    });
  } else {
    res.status(401).json('Authentication token required');
  }
};

app.post('/api/login', (req, res) => {
  console.log('Received login request:', req.body); // Log the incoming request body

  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, row) => {
    if (err) {
      console.error('Failed to fetch user:', err.message);
      res.status(500).json('Internal server error');
    } else if (!row) {
      res.status(401).json('Invalid email or password');
    } else {
      try {
        const passwordMatch = await bcrypt.compare(password, row.password);
        if (passwordMatch) {
          const token = 'Bearer ' + jwt.sign({ email: row.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
          res.status(200).json({ token });
          console.log(token);
        } else {
          res.status(401).json('Invalid email or password');
        }
      } catch (err) {
        console.error('Failed to compare passwords:', err.message);
        res.status(500).json('Internal server error');
      }
    }
  });
});

app.post('/api/medical-readings', (req, res) => {
  console.log('Received medical readings:', req.body); // Log the incoming medical readings

  const { tensiune, greutate, temperatura, glicemie } = req.body;
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO medical_readings (tensiune, greutate, temperatura, glicemie, timestamp)
    VALUES (?, ?, ?, ?, ?)`,
    [tensiune, greutate, temperatura, glicemie, timestamp],
    (err) => {
      if (err) {
        console.error('Failed to store medical readings:', err.message);
        res.status(500).json('Internal server error');
      } else {
        res.status(200).json('Medical readings stored successfully');
      }
    }
  );
});

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

app.post('/api/messages', authenticateUser, (req, res) => {
  console.log('Received new message:', req.body); // Log the incoming message

  const { sender, recipient, content, conversationId } = req.body;
  const timestamp = new Date().toISOString();

  db.run(
    `INSERT INTO messages (sender, recipient, content, timestamp, conversationId)
    VALUES (?, ?, ?, ?, ?)`,
    [sender, recipient, content, timestamp, conversationId],
    (err) => {
      if (err) {
        console.error('Failed to send message:', err.message);
        res.status(500).json('Internal server error');
      } else {
        res.status(200).json('Message sent successfully');
      }
    }
  );
});

app.get('/api/messages', authenticateUser, (req, res) => {
  const { conversationId } = req.query;

  db.all(
    'SELECT * FROM messages WHERE conversationId = ?',
    [conversationId],
    (err, rows) => {
      if (err) {
        console.error('Failed to fetch messages:', err.message);
        res.status(500).json('Internal server error');
      } else {
        res.status(200).json(rows);
      }
    }
  );
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json('Internal server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
