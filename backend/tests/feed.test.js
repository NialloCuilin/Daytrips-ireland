require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');
const Activity = require('../models/Activity');

let mongoServer;
let token;
let testUser;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test user
  testUser = new User({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@daytrips.ie',
    password: 'hashedpassword',
    county: 'Antrim',
  });
  await testUser.save();

  token = jwt.sign({ id: testUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // Create followed user
  const followedUser = new User({
    firstName: 'Followed',
    lastName: 'User',
    email: 'followed@daytrips.ie',
    password: 'hashedpassword',
    county: 'Antrim',
  });
  await followedUser.save();

  // Add to following
  testUser.following.push(followedUser._id);
  await testUser.save();

  // Create activity
  await Activity.create({
    type: 'save',
    actor: followedUser._id,
    daytrip: null, // could be mocked if needed
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Feed Controller Test', () => {
  test('should return feed of followed users', async () => {
    const res = await request(app)
      .get('/api/activity/feed')
      .set('Authorization', `Bearer ${token}`);

    console.log('FEED RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('type', 'save');
  });
});
