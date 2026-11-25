'use strict';

const { Router } = require('express');
const requireUser = require('../middlewares/require-user');
const validate = require('../middlewares/validate');
const validator = require('../validators/game-session.validator');
const controller = require('../controllers/game-session.controller');
const playerController = require('../controllers/player.controller');

const router = Router();

router.post(
  '/',
  requireUser('HOST'),
  validator.createSession,
  validate,
  controller.create
);

router.get('/', requireUser('HOST'), controller.list);

router.post(
  '/:sessionCode/join',
  requireUser('PLAYER'),
  validator.sessionCodeParam,
  validate,
  playerController.join
);

router.get(
  '/:sessionCode',
  requireUser(),
  validator.sessionCodeParam,
  validate,
  controller.getByCode
);

router.patch(
  '/:sessionCode/status',
  requireUser('HOST'),
  validator.sessionCodeParam,
  validator.updateSessionStatus,
  validate,
  controller.updateStatus
);

module.exports = router;