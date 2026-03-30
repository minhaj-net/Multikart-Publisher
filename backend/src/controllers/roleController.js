import * as roleService from '../services/roleService.js';

export async function list(req, res, next) {
  try {
    const data = await roleService.list();
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const role = await roleService.getById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (e) {
    next(e);
  }
}
