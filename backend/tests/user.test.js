require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../app');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Controller Tests', () => {
  const testUser = {
    firstName: 'Alice',
    lastName: 'Smith',
    email: 'alice@example.com',
    password: 'Test1234!',
    county: 'Dublin'
  };

  test('should register a user', async () => {
    const res = await request(app).post('/api/users/register').send(testUser);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.firstName).toBe('Alice');
  });

  test('should not allow duplicate registration', async () => {
    const res = await request(app).post('/api/users/register').send(testUser);
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/already exists/i);
  });

  test('should login existing user', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: testUser.email,
      password: testUser.password
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('should fail login with wrong password', async () => {
    const res = await request(app).post('/api/users/login').send({
      email: testUser.email,
      password: 'WrongPassword!'
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });

  test('should return user profile when authenticated', async () => {
    const user = await User.findOne({ email: testUser.email });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email', testUser.email);
  });

  test('should allow public access to user profile', async () => {
    const user = await User.findOne({ email: testUser.email });
    const res = await request(app).get(`/api/users/${user._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('email');
    });

  test('should not register a user with missing fields', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({ email: 'incomplete@daytrips.ie' }); // missing required fields

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/required/i);
  });

  test('should not login with unregistered email', async () => {
    const res = await request(app)
      .post('/api/users/login')
      .send({ email: 'nouser@daytrips.ie', password: 'wrongpass' });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toMatch(/invalid/i);
  });


});
