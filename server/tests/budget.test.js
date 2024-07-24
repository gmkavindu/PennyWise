const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import app from server.js
const Budget = require('../models/Budget');
const User = require('../models/User');

const fixedEmail = 'budget@test.com';
let token;
let budgetId;

beforeAll(async () => {
  try {
    // Connect to the test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true, 
      useUnifiedTopology: true
    });

    // Clean up the database to ensure no conflicts
    await User.deleteMany({ email: fixedEmail });
    await Budget.deleteMany({});

    // Register and login for token
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: fixedEmail,
        password: 'Password123',
      });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: fixedEmail,
        password: 'Password123',
      });

    token = loginRes.body.token;

    // Create a budget for testing
    const user = await User.findOne({ email: fixedEmail });
    const budgetRes = await request(app)
      .post('/api/budgets')
      .set('x-auth-token', token)
      .send({
        category: 'Groceries',
        limit: 300,
        user: user._id
      });

    budgetId = budgetRes.body._id;
  } catch (error) {
    console.error('Error setting up tests:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    // Cleanup the database
    await Budget.deleteMany({});
    await User.deleteMany({ email: fixedEmail });
    await mongoose.connection.close(); // Close the MongoDB connection
  } catch (error) {
    console.error('Error cleaning up tests:', error);
    throw error;
  }
});

describe('Budget Routes', () => {
  it('should add a new budget', async () => {
    try {
      const user = await User.findOne({ email: fixedEmail });
      const res = await request(app)
        .post('/api/budgets')
        .set('x-auth-token', token)
        .send({
          category: 'Utilities',
          limit: 150,
          user: user._id
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('category', 'Utilities');
      expect(res.body).toHaveProperty('limit', 150);
      expect(res.body).toHaveProperty('user', user._id.toString());
    } catch (error) {
      console.error('Error adding budget:', error);
      throw error;
    }
  });

  it('should get all budgets', async () => {
    try {
      const res = await request(app)
        .get('/api/budgets')
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toBeInstanceOf(Array);
      expect(res.body.length).toBeGreaterThan(0);
    } catch (error) {
      console.error('Error fetching budgets:', error);
      throw error;
    }
  });

  it('should update a budget', async () => {
    try {
      const res = await request(app)
        .put(`/api/budgets/${budgetId}`)
        .set('x-auth-token', token)
        .send({
          category: 'Entertainment',
          limit: 500,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('category', 'Entertainment');
      expect(res.body).toHaveProperty('limit', 500);
    } catch (error) {
      console.error('Error updating budget:', error);
      throw error;
    }
  });

  it('should delete a budget', async () => {
    try {
      const res = await request(app)
        .delete(`/api/budgets/${budgetId}`)
        .set('x-auth-token', token);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('msg', 'Budget removed'); // Ensure this matches your API response
    } catch (error) {
      console.error('Error deleting budget:', error);
      throw error;
    }
  });
});
