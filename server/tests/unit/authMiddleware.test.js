
const jwt = require('jsonwebtoken');
const { authenticateToken } = require('../../src/middleware/auth');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('calls next if token is valid', () => {
    const user = { id: '123' };
    const token = jwt.sign(user, process.env.JWT_SECRET);

    req.headers = { authorization: `Bearer ${token}` };

    authenticateToken(req, res, next);

    expect(req.user.id).toBe(user.id);
    expect(next).toHaveBeenCalled();
  });

  it('returns 401 if token missing', () => {
    req.headers = {};

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Access denied, token missing' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 if token invalid', () => {
    req.headers = { authorization: 'Bearer invalidtoken' };

    authenticateToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
