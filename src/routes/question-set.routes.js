'use strict';

const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const validator = require('../validators/question-set.validator');
const controller = require('../controllers/question-set.controller');

const router = Router();

router.use(requireUser('HOST'));

router.post(
  '/',
  validator.createQuestionSet,
  validate,
  controller.create
);

router.get('/', controller.list);

router.get(
  '/:setId',
  validator.setIdParam,
  validate,
  controller.getById
);

router.patch(
  '/:setId',
  validator.setIdParam,
  validator.updateQuestionSet,
  validate,
  controller.update
);

router.delete(
  '/:setId',
  validator.setIdParam,
  validate,
  controller.remove
);

module.exports = router;