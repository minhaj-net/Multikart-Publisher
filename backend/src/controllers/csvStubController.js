// Stub responses for CSV import/export until implemented
export async function importCsv(req, res, next) {
  try {
    res.json({ message: 'CSV import not implemented', success: true });
  } catch (e) {
    next(e);
  }
}

export async function exportCsv(req, res, next) {
  try {
    res.json({ message: 'CSV export not implemented', data: [], success: true });
  } catch (e) {
    next(e);
  }
}
