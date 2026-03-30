import * as adminWalletService from '../services/adminWalletService.js';
import * as adminPointsService from '../services/adminPointsService.js';

export async function creditWallet(req, res, next) {
  try {
    const data = await adminWalletService.creditWallet(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function debitWallet(req, res, next) {
  try {
    const data = await adminWalletService.debitWallet(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function vendorWalletList(req, res, next) {
  try {
    const data = await adminWalletService.vendorWalletList(req.query);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function creditVendorWallet(req, res, next) {
  try {
    const data = await adminWalletService.creditVendorWallet(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function debitVendorWallet(req, res, next) {
  try {
    const data = await adminWalletService.debitVendorWallet(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function creditPoints(req, res, next) {
  try {
    const data = await adminPointsService.creditPoints(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function debitPoints(req, res, next) {
  try {
    const data = await adminPointsService.debitPoints(req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
