require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

jest.mock('../utils/cloudinary', () => ({
  uploader: {
    upload: jest.fn().mockResolvedValue({
      secure_url: 'http://mocked.cloudinary.com/photo.jpg',
    }),
  },
}));

const { uploadPhoto } = require('../controllers/photoController');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));
app.post('/api/users/upload-photo', uploadPhoto);

describe('Photo Upload Controller', () => {
  it('should upload photo and return URL', async () => {
    const base64Image = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD...'; // Fake but valid start

    const res = await request(app)
      .post('/api/users/upload-photo')
      .send({ data: base64Image });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('url');
    expect(res.body.url).toBe('http://mocked.cloudinary.com/photo.jpg');
  });

  it('should handle upload error', async () => {
    const cloudinary = require('../utils/cloudinary');
    cloudinary.uploader.upload.mockRejectedValue(new Error('Upload failed'));

    const res = await request(app)
      .post('/api/users/upload-photo')
      .send({ data: 'fake_data' });

    expect(res.statusCode).toBe(500);
    expect(res.body).toHaveProperty('message', 'Something went wrong uploading the image.');
  });
});
