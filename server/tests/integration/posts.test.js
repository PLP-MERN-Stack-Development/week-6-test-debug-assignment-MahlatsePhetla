
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Post = require('../../src/models/Post');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let mongoServer;
let token;
let userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);

  // Create test user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123'
  });
  userId = user._id;
  token = generateToken(user);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Post.deleteMany({});
});

describe('POST /api/posts', () => {
  it('should create a new post with valid token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'First Post',
        content: 'Some content',
        category: new mongoose.Types.ObjectId().toString()
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('title', 'First Post');
    expect(res.body).toHaveProperty('content');
    expect(res.body).toHaveProperty('author', userId.toString());
  });

  it('should return 401 without token', async () => {
    const res = await request(app)
      .post('/api/posts')
      .send({
        title: 'Unauthorized',
        content: 'This should fail',
        category: new mongoose.Types.ObjectId().toString()
      });

    expect(res.status).toBe(401);
  });
});

describe('GET /api/posts', () => {
  beforeEach(async () => {
    await Post.create([
      {
        title: 'One',
        content: 'Post One',
        category: new mongoose.Types.ObjectId(),
        slug: 'one',
        author: userId
      },
      {
        title: 'Two',
        content: 'Post Two',
        category: new mongoose.Types.ObjectId(),
        slug: 'two',
        author: userId
      }
    ]);
  });

  it('should return all posts', async () => {
    const res = await request(app).get('/api/posts');

    expect(res.status).toBe(200);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
  });

  it('should support pagination', async () => {
    const res = await request(app).get('/api/posts?page=1&limit=1');

    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});

describe('GET /api/posts/:id', () => {
  it('should return a post by id', async () => {
    const post = await Post.create({
      title: 'Find Me',
      content: 'Specific post',
      category: new mongoose.Types.ObjectId(),
      slug: 'find-me',
      author: userId
    });

    const res = await request(app).get(`/api/posts/${post._id}`);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Find Me');
  });

  it('should return 404 for invalid post', async () => {
    const id = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/posts/${id}`);

    expect(res.status).toBe(404);
  });
});

describe('PUT /api/posts/:id', () => {
  it('should update a post if owner', async () => {
    const post = await Post.create({
      title: 'Editable',
      content: 'Edit me',
      category: new mongoose.Types.ObjectId(),
      slug: 'editable',
      author: userId
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated Title' });

    expect(res.status).toBe(200);
    expect(res.body.title).toBe('Updated Title');
  });

  it('should return 401 without token', async () => {
    const post = await Post.create({
      title: 'No Auth',
      content: 'Should fail',
      category: new mongoose.Types.ObjectId(),
      slug: 'no-auth',
      author: userId
    });

    const res = await request(app)
      .put(`/api/posts/${post._id}`)
      .send({ title: 'Hack' });

    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/posts/:id', () => {
  it('should delete a post with valid token', async () => {
    const post = await Post.create({
      title: 'To Delete',
      content: 'Delete me',
      category: new mongoose.Types.ObjectId(),
      slug: 'to-delete',
      author: userId
    });

    const res = await request(app)
      .delete(`/api/posts/${post._id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    const check = await Post.findById(post._id);
    expect(check).toBeNull();
  });

  it('should return 401 without token', async () => {
    const post = await Post.create({
      title: 'Still Here',
      content: 'Try delete',
      category: new mongoose.Types.ObjectId(),
      slug: 'still-here',
      author: userId
    });

    const res = await request(app).delete(`/api/posts/${post._id}`);
    expect(res.status).toBe(401);
  });
});
