'use strict';

const { Op } = require('sequelize');
const { Player, GameSession } = require('../models');

function create(data) {
  return Player.create(data);
}

function findById(playerId) {
  return Player.findByPk(playerId);
}

function findBySessionAndUser(sessionId, userId) {
  return Player.findOne({
    where: {
      session_id: sessionId,
      user_id: userId,
    },
  });
}

function findInOpenSession(userId) {
  return Player.findOne({
    where: { user_id: userId },
    include: [
      {
        model: GameSession,
        required: true,
        attributes: ['session_id', 'session_code', 'status'],
        where: {
          status: { [Op.in]: ['WAITING', 'ACTIVE'] },
        },
      },
    ],
  });
}

function findAllBySession(sessionId) {
  return Player.findAll({
    where: { session_id: sessionId },
    order: [['joined_at', 'ASC']],
  });
}

function update(player, data) {
  return player.update(data);
}

module.exports = {
  create,
  findById,
  findBySessionAndUser,
  findInOpenSession,
  findAllBySession,
  update,
};