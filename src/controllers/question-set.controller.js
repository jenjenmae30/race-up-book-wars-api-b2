'use strict';

const questionSetService = require('../services/question-set.service');

async function create(req, res) {
  const questionSet = await questionSetService.create(req.user, req.body);
  res.status(201).json({ data: questionSet });
}

async function list(req, res) {
  const questionSets = await questionSetService.list(req.user);
  res.status(200).json({ data: questionSets });
}

async function getById(req, res) {
  const questionSet = await questionSetService.getById(
    req.user,
    Number(req.params.setId)
  );
  res.status(200).json({ data: questionSet });
}

async function update(req, res) {
  const questionSet = await questionSetService.update(
    req.user,
    Number(req.params.setId),
    req.body
  );
  res.status(200).json({ data: questionSet });
}

async function remove(req, res) {
  await questionSetService.remove(req.user, Number(req.params.setId));
  res.status(204).send();
}

module.exports = { create, list, getById, update, remove };