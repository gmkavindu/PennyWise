const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import app from server.js
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');
const User = require('../models/User');

const fixedEmail = 'expense@test.com';
let token;
let userId;
let budgetId;
let expenseId;

beforeAll(async () => {
  // Connect to the test database
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Clean up the database to ensure no conflicts
  await User.deleteMany({ email: fixedEmail });
  await Budget.deleteMany({});
  await Expense.deleteMany({});

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

  // Create a user and a budget for testing
  const user = await User.findOne({ email: fixedEmail });
  userId = user._id;

  const budgetRes = await request(app)
    .post('/api/budgets')
    .set('x-auth-token', token)
    .send({
      category: 'Groceries',
      limit: 300,
      user: userId
    });

  budgetId = budgetRes.body._id;

  // Create an expense for testing
  const expenseRes = await request(app)
    .post('/api/expenses')
    .set('x-auth-token', token)
    .send({
      amount: 50,
      category: 'Groceries',
      date: new Date(),
      description: 'Grocery shopping',
      user: userId
    });

  expenseId = expenseRes.body._id;
});

afterAll(async () => {
  // Cleanup the database
  await Expense.deleteMany({});
  await Budget.deleteMany({});
  await User.deleteMany({ email: fixedEmail });
  await mongoose.connection.close(); // Close the MongoDB connection
});

describe('Expense Routes', () => {
  it('should add a new expense', async () => {
    const res = await request(app)
      .post('/api/expenses')
      .set('x-auth-token', token)
      .send({
        amount: 100,
        category: 'Groceries',
        date: new Date(),
        description: 'Grocery shopping (2)',
        user: userId
      });

    expect(res.statusCode).toBe(200); // Adjust based on your API response code
    expect(res.body).toHaveProperty('amount', 100);
    expect(res.body).toHaveProperty('category', 'Groceries');
    expect(res.body).toHaveProperty('description', 'Grocery shopping (2)');
    expect(res.body).toHaveProperty('user', userId.toString());
  });

  it('should get all expenses', async () => {
    const res = await request(app)
      .get('/api/expenses')
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should update an expense', async () => {
    const res = await request(app)
      .put(`/api/expenses/${expenseId}`)
      .set('x-auth-token', token)
      .send({
        amount: 75,
        category: 'Groceries',
        date: new Date(),
        description: 'Grocery shopping (2-Edit)',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('amount', 75);
    expect(res.body).toHaveProperty('category', 'Groceries');
    expect(res.body).toHaveProperty('description', 'Grocery shopping (2-Edit)');
  });

  it('should delete an expense', async () => {
    const res = await request(app)
      .delete(`/api/expenses/${expenseId}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('msg', 'Expense removed'); // Ensure this matches your API response
  });
});
