'use strict';

const gameSessionService = require('../services/game-session.service');

async function create(req, res) {
  const session = await gameSessionService.create(req.user, req.body);
  res.status(201).json({ data: session });
}

async function getByCode(req, res) {
  const session = await gameSessionService.getByCode(
    req.user,
    req.params.sessionCode
  );
  res.status(200).json({ data: session });
}

async function updateStatus(req, res) {
  const session = await gameSessionService.updateStatus(
    req.user,
    req.params.sessionCode,
    req.body.status
  );
  res.status(200).json({ data: session });
}
async function list(req, res) {
  const sessions = await gameSessionService.list(req.user);
  res.status(200).json({ data: sessions });
}
module.exports = { create, getByCode, updateStatus, list };