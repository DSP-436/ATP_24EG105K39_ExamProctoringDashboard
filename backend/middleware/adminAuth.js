import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import AppError from '../utils/AppError.js';
import catchAsync from '../utils/catchAsync.js';
import env from '../config/env.js';

export const adminProtect = catchAsync(async (req, res, next) => {
  const token = req.headers.authorization?.startsWith('Bearer')
    ? req.headers.authorization.split(' ')[1]
    : null;

  if (!token) {
    return next(new AppError('Not authenticated. Please log in.', 401));
  }

  const decoded = jwt.verify(token, env.jwtSecret);
  const admin = await Admin.findById(decoded.id);

  if (!admin) {
    return next(new AppError('Admin no longer exists.', 401));
  }

  req.admin = admin;
  next();
});
