const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Daytrip = require('../models/Daytrip');
const User = require('../models/User');

let mongoServer;
let user;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  user = await User.create({
    firstName: 'Test',
    lastName: 'Author',
    email: 'author@daytrips.ie',
    password: 'hashedpw',
    county: 'Dublin'
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Daytrip Model', () => {
  it('should save a valid daytrip', async () => {
    const trip = new Daytrip({
      title: 'Coastal Adventure',
      description: 'Explore the coast',
      author: user._id,
      locations: [{ name: 'Beach Stop', address: '123 Shoreline' }],
      tags: ['coastal'],
      countyTags: ['Dublin'],
      images: ['http://example.com/photo.jpg'],
      duration: '120',
      travelType: ['car']
    });

    const saved = await trip.save();
    expect(saved._id).toBeDefined();
    expect(saved.createdAt).toBeInstanceOf(Date);
    expect(saved.locations[0].name).toBe('Beach Stop');
  });

  it('should require mandatory fields', async () => {
    const trip = new Daytrip({}); // empty

    let err;
    try {
      await trip.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.title).toBeDefined();
    expect(err.errors.description).toBeDefined();
    expect(err.errors.author).toBeDefined();
  });

  it('should calculate average rating', async () => {
    const trip = await Daytrip.create({
      title: 'Rated Trip',
      description: 'With ratings',
      author: user._id,
      ratings: [
        { user: user._id, value: 5 },
        { user: user._id, value: 3 }
      ]
    });

    const fetched = await Daytrip.findById(trip._id);
    expect(fetched.averageRating).toBe(4); // (5 + 3) / 2
  });

  it('should reject rating values outside 1-5', async () => {
    const badRatingTrip = new Daytrip({
      title: 'Bad Rating',
      description: 'Invalid rating',
      author: user._id,
      ratings: [{ user: user._id, value: 10 }]
    });

    let err;
    try {
      await badRatingTrip.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors['ratings.0.value']).toBeDefined();
  });
});
