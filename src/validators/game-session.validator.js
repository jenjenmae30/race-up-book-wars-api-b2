'use strict';

const { body, param } = require('express-validator');

const sessionCodeParam = [
  param('sessionCode')
    .matches(/^\d{6}$/)
    .withMessage('Session code must be six digits.'),
];

const createSession = [
  body('set_id')
    .isInt({ min: 1 })
    .withMessage('set_id must be a positive integer.')
    .toInt(),

  body('time_limit_sec')
    .isInt({ min: 1, max: 3600 })
    .withMessage('time_limit_sec must be between 1 and 3600.')
    .toInt(),
];

const updateSessionStatus = [
  body('status')
    .isIn(['ACTIVE', 'CLOSED'])
    .withMessage('status must be ACTIVE or CLOSED.'),
];

module.exports = {
  sessionCodeParam,
  createSession,
  updateSessionStatus,
};