process.env.JWT_SECRET = 'testsecret';

const jwt = require('jsonwebtoken');
const { generateToken } = require('../../src/utils/auth');

describe('generateToken', () => {
  it('generates a valid JWT token with user id', () => {
    const user = { _id: '1234567890abcdef' };
    const token = generateToken(user);
    expect(typeof token).toBe('string');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded.id).toBe(user._id);
  });
});

