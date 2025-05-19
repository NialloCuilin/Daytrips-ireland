const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Activity = require('../models/Activity');
const User = require('../models/User');
const Daytrip = require('../models/Daytrip');

let mongoServer;
let user, otherUser, daytrip;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  user = await User.create({
    firstName: 'Actor',
    lastName: 'User',
    email: 'actor@daytrips.ie',
    password: 'secret',
    county: 'Cork'
  });

  otherUser = await User.create({
    firstName: 'Target',
    lastName: 'User',
    email: 'target@daytrips.ie',
    password: 'secret',
    county: 'Mayo'
  });

  daytrip = await Daytrip.create({
    title: 'Historic Walk',
    description: 'Walk around historic sites',
    author: user._id
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Activity Model', () => {
  it('should save a valid "save" activity', async () => {
    const activity = await Activity.create({
      type: 'save',
      actor: user._id,
      daytrip: daytrip._id
    });

    expect(activity._id).toBeDefined();
    expect(activity.type).toBe('save');
    expect(activity.createdAt).toBeInstanceOf(Date);
  });

  it('should not save without required fields', async () => {
    const activity = new Activity({});

    let err;
    try {
      await activity.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.type).toBeDefined();
    expect(err.errors.actor).toBeDefined();
  });

  it('should reject invalid "type"', async () => {
    const activity = new Activity({
      type: 'invalid',
      actor: user._id
    });

    let err;
    try {
      await activity.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.type.kind).toBe('enum');
  });

  it('should reject rating values outside 1–5', async () => {
    const badRating = new Activity({
      type: 'rate',
      actor: user._id,
      daytrip: daytrip._id,
      value: 10
    });

    let err;
    try {
      await badRating.save();
    } catch (e) {
      err = e;
    }

    expect(err).toBeDefined();
    expect(err.errors.value).toBeDefined();
  });

  it('should store optional achievement text', async () => {
    const achievement = await Activity.create({
      type: 'achievement',
      actor: user._id,
      achievement: '100 daytrips saved!'
    });

    expect(achievement.type).toBe('achievement');
    expect(achievement.achievement).toBe('100 daytrips saved!');
  });

  it('should save a "follow" activity with targetUser', async () => {
    const follow = await Activity.create({
      type: 'follow',
      actor: user._id,
      targetUser: otherUser._id
    });

    expect(follow.type).toBe('follow');
    expect(follow.targetUser.toString()).toBe(otherUser._id.toString());
  });
});
