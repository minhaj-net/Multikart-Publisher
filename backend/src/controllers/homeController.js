import * as homeSectionService from '../services/homeSectionService.js';

export async function getSection(req, res, next) {
  try {
    const { section } = req.params;
    const data = await homeSectionService.getSection(section);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
