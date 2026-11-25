'use strict';

const questionSetRepository = require('../repositories/question-set.repository');
const { unauthorized, forbidden, notFound } = require('../errors/app-error');

function requireHost(user) {
  if (!user) {
    throw unauthorized();
  }

  if (user.role !== 'HOST') {
    throw forbidden('Only hosts can manage question sets.');
  }
}

async function create(user, data) {
  requireHost(user);

  return questionSetRepository.create({
    ...data,
    host_user_id: user.user_id,
  });
}

async function list(user) {
  requireHost(user);
  return questionSetRepository.findAllByHost(user.user_id);
}

async function getById(user, setId) {
  requireHost(user);

  const questionSet = await questionSetRepository.findById(setId);

  if (!questionSet) {
    throw notFound('QUESTION_SET_NOT_FOUND', 'Question set not found.');
  }

  if (questionSet.host_user_id !== user.user_id) {
    throw forbidden('You can only access your own question sets.');
  }

  return questionSet;
}

async function update(user, setId, data) {
  const questionSet = await getById(user, setId);

  // Only update the editable question-set fields.
  const editableData = {
    title: data.title,
    description: data.description,
    subject: data.subject,
    grade_level: data.grade_level,
  };

  for (const key of Object.keys(editableData)) {
    if (editableData[key] === undefined) {
      delete editableData[key];
    }
  }

  return questionSetRepository.update(questionSet, editableData);
}

async function remove(user, setId) {
  const questionSet = await getById(user, setId);
  await questionSetRepository.remove(questionSet);
}

module.exports = { create, list, getById, update, remove };