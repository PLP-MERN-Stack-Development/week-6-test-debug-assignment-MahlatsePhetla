
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });

    const slug = title.toLowerCase().replace(/\s+/g, '-');

    const newPost = await Post.create({
      title,
      content,
      category,
      slug,
      author: req.user.id,
    });

    res.status(201).json(newPost);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPosts = async (req, res) => {
  try {
    const { category, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (category) filter.category = category;

    const posts = await Post.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    const { title, content } = req.body;
    if (title !== undefined) post.title = title;
    if (content !== undefined) post.content = content;

    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: 'Not authorized' });

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
