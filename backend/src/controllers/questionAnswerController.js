import * as questionAnswerService from '../services/questionAnswerService.js';

export async function list(req, res, next) {
  try {
    const data = await questionAnswerService.list(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = await questionAnswerService.create(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function feedback(req, res, next) {
  try {
    const data = await questionAnswerService.feedback(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
