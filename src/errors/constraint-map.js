'use strict';

module.exports = {
  users_school_id_key: {
    status: 409,
    code: 'SCHOOL_ID_TAKEN',
    message: 'That school ID is already registered.',
  },
  users_email_key: {
    status: 409,
    code: 'EMAIL_TAKEN',
    message: 'That email is already registered.',
  },
  users_nickname_key: {
    status: 409,
    code: 'NICKNAME_TAKEN',
    message: 'That nickname is already in use.',
  },
  game_sessions_session_code_key: {
    status: 409,
    code: 'SESSION_CODE_TAKEN',
    message: 'That session code is already in use. Try again.',
  },
  uq_players_session_user: {
    status: 409,
    code: 'PLAYER_ALREADY_JOINED',
    message: 'That account already has a seat in this session.',
  },
  fk_question_sets_host_user: {
    status: 409,
    code: 'INVALID_HOST',
    message: 'The host account for this question set does not exist.',
  },
};