import * as authService from '../services/authService.js';

export async function register(req, res, next) {
  try {
    const data = await authService.register(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function login(req, res, next) {
  try {
    const data = await authService.login(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function loginByNumber(req, res, next) {
  try {
    const data = await authService.loginByNumber(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function self(req, res, next) {
  try {
    const data = await authService.getSelf(req.user);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function logout(req, res, next) {
  try {
    res.json({ message: 'Logged out' });
  } catch (e) {
    next(e);
  }
}

export async function forgotPassword(req, res, next) {
  try {
    const data = await authService.forgotPassword(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function verifyOtp(req, res, next) {
  try {
    const data = await authService.verifyOtp(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function updatePassword(req, res, next) {
  try {
    const data = await authService.updatePassword(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
