'use strict';

const playerService = require('../services/player.service');

async function join(req, res) {
  const result = await playerService.join(
    req.user,
    req.params.sessionCode
  );

  const playerData = result.player.toJSON();
  delete playerData.player_token_hash;

  res.status(result.rejoined ? 200 : 201).json({
    data: {
      ...playerData,
      player_token: result.playerToken,
      rejoined: result.rejoined,
    },
  });
}

module.exports = { join };