const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../models/User');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('User Model Validation', () => {
  it('should save a valid user', async () => {
    const user = new User({
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'JANE@Example.com',
      password: 'securePassword',
      county: 'Wicklow'
    });

    const savedUser = await user.save();
    expect(savedUser.email).toBe('jane@example.com'); // lowercase
    expect(savedUser.achievements).toEqual([]);
    expect(savedUser.avatar).toBe('');
  });

  it('should require required fields', async () => {
    const user = new User({}); // missing everything

    let err;
    try {
      await user.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.errors.firstName).toBeDefined();
    expect(err.errors.lastName).toBeDefined();
    expect(err.errors.email).toBeDefined();
    expect(err.errors.password).toBeDefined();
    expect(err.errors.county).toBeDefined();
  });

  it('should enforce unique email', async () => {
    const user1 = new User({
      firstName: 'John',
      lastName: 'Smith',
      email: 'unique@example.com',
      password: '123456',
      county: 'Dublin',
    });

    const user2 = new User({
      firstName: 'Another',
      lastName: 'User',
      email: 'unique@example.com',
      password: '123456',
      county: 'Kerry',
    });

    await user1.save();

    let err;
    try {
      await user2.save();
    } catch (error) {
      err = error;
    }

    expect(err).toBeDefined();
    expect(err.code).toBe(11000); 
  });
});
