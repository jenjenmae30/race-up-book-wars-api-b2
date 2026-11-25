'use strict';

const env = require('../config/env');
const userRepository = require('../repositories/user.repository');

if (env.nodeEnv === 'production') {
  throw new Error(
    'current-user.js is the Week 11 stand-in. Replace it before production.'
  );
}

async function currentUser(req, res, next) {
  const schoolId = req.get('X-Demo-User');
  const user = schoolId
    ? await userRepository.findBySchoolId(schoolId)
    : null;

  req.user = user
    ? {
        user_id: user.user_id,
        school_id: user.school_id,
        role: user.role,
        nickname: user.nickname,
      }
    : null;

  next();
}

module.exports = currentUser;