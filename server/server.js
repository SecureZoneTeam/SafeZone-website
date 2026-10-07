const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const dbPath = path.join(__dirname, 'db.json');

function loadDatabase() {
  return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}


app.post('/api/v1/authentication/sign-in', (req, res) => {

  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password are required'
    });
  }

  const db = loadDatabase();

  const user = db.users.find(
    (u) => u.username.toLowerCase() === username.toLowerCase()
  );

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  // Fake password para demostración académica
  if (password !== '12345678') {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  return res.json({
    id: user.id,
    username: user.username,
    token: `fake-jwt-${user.username}`
  });
});


app.post('/api/v1/authentication/sign-up', (req, res) => {

  const { username, email, fullName } = req.body;

  if (!username || !email || !fullName) {
    return res.status(400).json({
      message: 'Required fields are missing'
    });
  }

  const db = loadDatabase();

  const existingUser = db.users.find(
    (u) =>
      u.username.toLowerCase() === username.toLowerCase() ||
      u.email.toLowerCase() === email.toLowerCase()
  );

  if (existingUser) {
    return res.status(409).json({
      message: 'User already exists'
    });
  }

  const newUser = {
    id: db.users.length + 1,
    username,
    email,
    fullName,
    roles: ['ROLE_WAREHOUSE_KEEPER'],
    companyId: 1
  };

  db.users.push(newUser);

  fs.writeFileSync(
    dbPath,
    JSON.stringify(db, null, 2),
    'utf8'
  );

  return res.status(201).json(newUser);
});


const resources = [
  'users',
  'companies',
  'warehouses',
  'warehouse-zones',
  'sensor-nodes',
  'physical-events',
  'security-alerts',
  'subscription-plans',
  'subscriptions',
  'invoices',
  'traceability-records'
];

resources.forEach((resource) => {

  app.get(`/api/v1/${resource}`, (req, res) => {

    const db = loadDatabase();

    if (!db[resource]) {
      return res.status(404).json({
        message: 'Resource not found'
      });
    }

    res.json(db[resource]);
  });

});

resources.forEach((resource) => {

  app.get(`/api/v1/${resource}/:id`, (req, res) => {

    const db = loadDatabase();

    if (!db[resource]) {
      return res.status(404).json({
        message: 'Resource not found'
      });
    }

    const item = db[resource].find(
      (element) => String(element.id) === String(req.params.id)
    );

    if (!item) {
      return res.status(404).json({
        message: 'Resource not found'
      });
    }

    res.json(item);
  });

});


app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'NodeSecure Fake API is running'
  });
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`NodeSecure Fake API running on port ${PORT}`);
});
