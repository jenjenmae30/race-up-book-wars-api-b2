'use strict';

const { createHash, randomBytes } = require('node:crypto');
const gameSessionRepository = require('../repositories/game-session.repository');
const playerRepository = require('../repositories/player.repository');
const {
  unauthorized,
  forbidden,
  notFound,
  conflict,
} = require('../errors/app-error');

function makePlayerToken() {
  const token = randomBytes(32).toString('hex');
  const tokenHash = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  return { token, tokenHash, expiresAt };
}

async function join(user, sessionCode) {
  if (!user) throw unauthorized();
  if (user.role !== 'PLAYER') {
    throw forbidden('Only player accounts can join a session.');
  }

  const session = await gameSessionRepository.findByCode(sessionCode);
  if (!session) {
    throw notFound('SESSION_NOT_FOUND', 'Game session not found.');
  }

  if (session.status !== 'WAITING') {
    throw conflict('SESSION_NOT_OPEN', 'This session is not open for joining.');
  }

  const existingSeat = await playerRepository.findBySessionAndUser(
    session.session_id,
    user.user_id
  );

  const { token, tokenHash, expiresAt } = makePlayerToken();

  if (existingSeat) {
    const player = await playerRepository.update(existingSeat, {
      player_token_hash: tokenHash,
      token_expires_at: expiresAt,
    });

    return { player, playerToken: token, rejoined: true };
  }

  const otherOpenSeat = await playerRepository.findInOpenSession(user.user_id);
  if (otherOpenSeat) {
    throw conflict(
      'PLAYER_ALREADY_IN_GAME',
      'You already have a seat in another open session.'
    );
  }

  const player = await playerRepository.create({
    session_id: session.session_id,
    user_id: user.user_id,
    nickname: user.nickname,
    player_token_hash: tokenHash,
    token_expires_at: expiresAt,
    shelf_position: 0,
  });

  return { player, playerToken: token, rejoined: false };
}

module.exports = { join };