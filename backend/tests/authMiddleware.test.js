require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { protect } = require('../middleware/authMiddleware');
const User = require('../models/User');

let mongoServer;
let app;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  const user = await User.create({
    firstName: 'Test',
    lastName: 'Middleware',
    email: 'test@middleware.com',
    password: 'hashedpassword',
    county: 'Cork'
  });

  userId = user._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Set up a tiny test app
  app = express();
  app.use(express.json());

  // Protected route
  app.get('/protected', protect, (req, res) => {
    res.json({ message: 'Access granted', user: req.user.email });
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Middleware', () => {
  test('should block access without token', async () => {
    const res = await request(app).get('/protected');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/no token/i);
  });

  test('should block access with invalid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', 'Bearer invalidtoken');
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toMatch(/token failed/i);
  });

  test('should allow access with valid token', async () => {
    const res = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Access granted');
    expect(res.body.user).toBe('test@middleware.com');
  });
});
