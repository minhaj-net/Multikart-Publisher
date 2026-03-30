import * as blogService from '../services/blogService.js';

export async function list(req, res, next) {
  try {
    const data = await blogService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getBySlug(req, res, next) {
  try {
    const blog = await blogService.getBySlug(req.params.slug);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (e) {
    next(e);
  }
}
