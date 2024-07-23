const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import app from server.js
const User = require('../models/User');

let token;

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  await request(app)
    .post('/api/auth/register')
    .send({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123',
    });

  const res = await request(app)
    .post('/api/auth/login')
    .send({
      email: 'test@example.com',
      password: 'Password123',
    });

  token = res.body.token; // Store the token for use in other tests
});

afterAll(async () => {
  await User.deleteMany({}); // Clear User collection
  await mongoose.connection.close(); // Close MongoDB connection
});

describe('Auth Routes', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'New User',
          email: 'newuser@example.com',
          password: 'NewPassword123',
        });

      expect(res.statusCode).toEqual(200); // Assuming 200 for successful registration
      expect(res.body).toHaveProperty('token');
    });

    it('should not register a user with an existing email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'Password123',
        });

      expect(res.statusCode).toEqual(400); // Assuming 400 for bad request
      expect(res.body).toHaveProperty('msg', 'User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should log in an existing user', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'Password123',
        });

      expect(res.statusCode).toEqual(200); // Assuming 200 for successful login
      expect(res.body).toHaveProperty('token');
    });

    it('should not log in a user with incorrect password', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'WrongPassword',
        });

      expect(res.statusCode).toEqual(400); // Assuming 400 for bad request
      expect(res.body).toHaveProperty('msg', 'Invalid Credentials');
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get the logged-in user profile', async () => {
      const res = await request(app)
        .get('/api/auth/profile')
        .set('x-auth-token', token); // Use the x-auth-token header

      expect(res.statusCode).toEqual(200); // Assuming 200 for successful profile fetch
      expect(res.body).toHaveProperty('email', 'test@example.com');
    });
  });
});
