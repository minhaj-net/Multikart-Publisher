export async function create(req, res, next) {
  try {
    res.json({ message: 'Thank you for your message' });
  } catch (e) {
    next(e);
  }
}
