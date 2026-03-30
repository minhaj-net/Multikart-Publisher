import * as profileService from '../services/profileService.js';

export async function updateProfile(req, res, next) {
  try {
    const data = await profileService.updateProfile(req.user.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function updatePassword(req, res, next) {
  try {
    await profileService.updatePassword(req.user.id, req.body);
    res.json({ message: 'Password updated' });
  } catch (e) {
    next(e);
  }
}
