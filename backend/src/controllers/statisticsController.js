import * as statisticsService from '../services/statisticsService.js';

export async function getCount(req, res, next) {
  try {
    const data = await statisticsService.getCounts(req.query);
    res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function getChart(req, res, next) {
  try {
    const data = await statisticsService.getDashboardChart(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
