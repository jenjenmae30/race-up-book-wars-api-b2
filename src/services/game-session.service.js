'use strict';

const { randomInt } = require('node:crypto');
const gameSessionRepository = require('../repositories/game-session.repository');
const questionSetRepository = require('../repositories/question-set.repository');
const {
  unauthorized,
  forbidden,
  notFound,
  badRequest,
} = require('../errors/app-error');

function requireHost(user) {
  if (!user) throw unauthorized();
  if (user.role !== 'HOST') {
    throw forbidden('Only hosts can manage game sessions.');
  }
}

async function generateSessionCode() {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = String(randomInt(100000, 1000000));
    const existing = await gameSessionRepository.findByCode(code);
    if (!existing) return code;
  }

  throw new Error('Could not generate a unique session code.');
}

async function create(user, data) {
  requireHost(user);

  const questionSet = await questionSetRepository.findById(data.set_id);
  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  if (questionSet.host_user_id !== user.user_id) {
    throw forbidden('You can only use your own question sets.');
  }

  return gameSessionRepository.create({
    session_code: await generateSessionCode(),
    host_user_id: user.user_id,
    set_id: questionSet.set_id,
    time_limit_sec: data.time_limit_sec,
    status: 'WAITING',
  });
}

async function getByCode(user, sessionCode) {
  if (!user) throw unauthorized();

  const session = await gameSessionRepository.findByCode(sessionCode);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Game session not found.');
  }

  return session;
}

async function updateStatus(user, sessionCode, newStatus) {
  requireHost(user);

  const session = await gameSessionRepository.findByCode(sessionCode);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Game session not found.');
  }

  if (session.host_user_id !== user.user_id) {
    throw forbidden('You can only change your own sessions.');
  }

  if (newStatus === session.status) return session;

  const canStart = session.status === 'WAITING' && newStatus === 'ACTIVE';
  const canClose =
    ['WAITING', 'ACTIVE'].includes(session.status) && newStatus === 'CLOSED';

  if (!canStart && !canClose) {
    throw badRequest(
      'INVALID_SESSION_STATUS',
      `Cannot change session status from ${session.status} to ${newStatus}.`
    );
  }

  const updates = { status: newStatus };

  if (newStatus === 'ACTIVE') updates.started_at = new Date();
  if (newStatus === 'CLOSED') updates.ended_at = new Date();

  return gameSessionRepository.update(session, updates);
}
async function list(user) {
  requireHost(user);
  return gameSessionRepository.findAllByHost(user.user_id);
}
module.exports = { create, getByCode, updateStatus, list };