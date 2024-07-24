// middleware/tests/auth.test.js
const authMiddleware = require('../auth');
const httpMocks = require('node-mocks-http');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
jest.mock('../../models/User');

describe('Auth Middleware', () => {
  it('should validate token and add user to request', async () => {
    jwt.verify = jest.fn(() => ({ user: { id: '123' } }));
    User.findById = jest.fn().mockResolvedValue({ _id: '123', name: 'Test User', email: 'test@example.com' });

    const req = httpMocks.createRequest({
      headers: { 'x-auth-token': 'validToken' }
    });
    const res = httpMocks.createResponse();
    const next = jest.fn();

    await authMiddleware(req, res, next);

    console.log(req.user); // Add this line to debug

    expect(req.user).toBeDefined();
    expect(next).toHaveBeenCalled();
  });
});
