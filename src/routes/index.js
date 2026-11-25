// The single place that maps URLs to route files.
const { Router } = require('express');
const currentUser = require('../middlewares/current-user');

const router = Router();

// Hub Contract endpoints: open to everyone.
router.use('/health', require('./health.routes'));
router.use('/game-info', require('./game-info.routes'));
router.use('/results', require('./results.routes'));

// The demo-user middleware identifies the caller for Week 11.
router.use(currentUser);

router.use('/question-sets', require('./question-set.routes'));
router.use('/sessions', require('./game-session.routes'));

module.exports = router;