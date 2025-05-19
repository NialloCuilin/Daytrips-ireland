require('dotenv').config({ path: '.env.test' });

const request = require('supertest');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = require('../app');
const User = require('../models/User');

let mongoServer;
let token;
let userId;
let tripId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  const testUser = new User({
    firstName: 'Test',
    lastName: 'User',
    email: 'test@daytrips.ie',
    password: '$2a$10$V1Y9QeF/9h6LrZx9hE2kXOMzFdUoRZ7z5x3ed3Xl8A.jg88G/hWzW', // pre-hashed
    county: 'Antrim',
  });
  await testUser.save();

  userId = testUser._id;
  token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Daytrip Controller Tests', () => {
  test('should create a new daytrip', async () => {
    const rating = {
    value: 4, 
    title: "Great experience",
    comment: "Really enjoyed the scenery and route!"
    };

    const newTrip = {
      title: 'Test Trip',
      description: 'A lovely day trip',
      locations: [{ name: 'Location A', address: '123 Place' }],
      duration: '120',
      tags: ['scenic'],
      countyTags: ['Antrim'],
      images: ['http://example.com/image.jpg'],
      rating :rating,
    };

    const res = await request(app)
      .post('/api/daytrips/create')
      .set('Authorization', `Bearer ${token}`)
      .send(newTrip);

    console.log('CREATE RESPONSE:', res.body);
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Test Trip');
    expect(res.body.author).toBe(userId.toString());

    tripId = res.body._id;
    expect(tripId).toBeDefined();
  });

  test('should return daytrips created by user', async () => {
    const res = await request(app).get(`/api/daytrips/user/${userId}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body[0]._id).toBe(tripId);
  });

  test('should get daytrip by ID', async () => {
    const res = await request(app).get(`/api/daytrips/${tripId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body._id).toBe(tripId);
  });

  test('should delete a daytrip', async () => {
    const res = await request(app)
      .delete(`/api/daytrips/${tripId}`)
      .set('Authorization', `Bearer ${token}`);

    console.log('DELETE RESPONSE:', res.body);
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toMatch(/deleted/i);
  });
});
