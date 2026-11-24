'use strict';

const { body, param } = require('express-validator');

const setIdParam = [
  param('setId')
    .isInt({ min: 1 })
    .withMessage('setId must be a positive integer.')
    .toInt(),
];

const createQuestionSet = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required.')
    .isLength({ max: 150 })
    .withMessage('Title must be 150 characters or fewer.'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text.'),

  body('subject')
    .trim()
    .notEmpty()
    .withMessage('Subject is required.')
    .isLength({ max: 100 })
    .withMessage('Subject must be 100 characters or fewer.'),

  body('grade_level')
    .trim()
    .notEmpty()
    .withMessage('Grade level is required.')
    .isLength({ max: 50 })
    .withMessage('Grade level must be 50 characters or fewer.'),
];

const updateQuestionSet = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty.')
    .isLength({ max: 150 })
    .withMessage('Title must be 150 characters or fewer.'),

  body('description')
    .optional({ nullable: true })
    .isString()
    .withMessage('Description must be text.'),

  body('subject')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Subject cannot be empty.')
    .isLength({ max: 100 })
    .withMessage('Subject must be 100 characters or fewer.'),

  body('grade_level')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Grade level cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Grade level must be 50 characters or fewer.'),
];

module.exports = {
  setIdParam,
  createQuestionSet,
  updateQuestionSet,
};