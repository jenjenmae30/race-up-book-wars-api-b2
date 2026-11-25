'use strict';

const { GameSession } = require('../models');

function create(data) {
  return GameSession.create(data);
}

function findById(sessionId) {
  return GameSession.findByPk(sessionId);
}

function findByCode(sessionCode) {
  return GameSession.findOne({ where: { session_code: sessionCode } });
}

function findAllByHost(hostUserId) {
  return GameSession.findAll({
    where: { host_user_id: hostUserId },
    order: [['created_at', 'DESC']],
  });
}

async function update(session, data) {
  return session.update(data);
}

module.exports = {
  create,
  findById,
  findByCode,
  findAllByHost,
  update,
};