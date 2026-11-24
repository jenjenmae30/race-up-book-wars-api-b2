'use strict';

const { QuestionSet } = require('../models');

function create(data) {
  return QuestionSet.create(data);
}

function findAllByHost(hostUserId) {
  return QuestionSet.findAll({
    where: { host_user_id: hostUserId },
    order: [['set_id', 'ASC']],
  });
}

function findById(setId) {
  return QuestionSet.findByPk(setId);
}

async function update(questionSet, data) {
  return questionSet.update(data);
}

async function remove(questionSet) {
  return questionSet.destroy();
}

module.exports = {
  create,
  findAllByHost,
  findById,
  update,
  remove,
};