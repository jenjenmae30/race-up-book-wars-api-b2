'use strict';

const seedTime = new Date('2026-11-23T10:00:00.000Z');
const gameStart = new Date('2026-11-23T09:45:00.000Z');
const gameEnd = new Date('2026-11-23T09:55:00.000Z');

module.exports = {
  async up(queryInterface) {
    const insert = (table, rows) =>
      queryInterface.bulkInsert(table, rows, { ignoreDuplicates: true });

    await insert('users', [
      {
        user_id: 1,
        school_id: 'DEMO-HOST-01',
        full_name: 'Demo Host',
        email: 'host@example.test',
        nickname: 'BookHost',
        password_hash: 'demo-seed-hash-host',
        role: 'HOST',
        total_exp: 0,
        created_at: seedTime,
      },
      ...[1, 2, 3].map((n) => ({
        user_id: n + 1,
        school_id: `DEMO-PLAYER-0${n}`,
        full_name: `Demo Player ${n}`,
        email: `player${n}@example.test`,
        nickname: `Reader${n}`,
        password_hash: `demo-seed-hash-player-${n}`,
        role: 'PLAYER',
        total_exp: 50,
        created_at: seedTime,
      })),
    ]);

    await insert('question_sets', [
      {
        set_id: 1,
        title: 'Demo Book Quiz',
        description: 'Sample questions for testing the game.',
        subject: 'Reading',
        grade_level: '3',
      },
    ]);
    await queryInterface.sequelize.query(`
  SELECT setval(
    pg_get_serial_sequence('question_sets', 'set_id'),
    (SELECT MAX(set_id) FROM question_sets),
    true
  );
`);

    await insert('book_effects', [
      { book_effect_id: 1, effect_type: 'MOVE_FORWARD', effect_value: 1 },
    ]);

    await insert('questions', [
      {
        question_id: 1,
        set_id: 1,
        text: 'Which part of a book lists its chapters?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify([
          'Index',
          'Table of contents',
          'Glossary',
          'Cover',
        ]),
        correct_index: 1,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
      {
        question_id: 2,
        set_id: 1,
        text: 'Who writes a book?',
        type: 'MULTIPLE_CHOICE',
        choices: JSON.stringify([
          'Author',
          'Reader',
          'Librarian',
          'Illustration',
        ]),
        correct_index: 0,
        time_limit_sec: 30,
        difficulty: 'EASY',
      },
    ]);

    await insert('game_sessions', [
      {
        session_id: 1,
        session_code: '104209',
        host_user_id: 1,
        set_id: 1,
        status: 'CLOSED',
        created_at: gameStart,
        started_at: gameStart,
        ended_at: gameEnd,
        time_limit_sec: 30,
      },
    ]);
    await queryInterface.sequelize.query(`
  SELECT setval(
    pg_get_serial_sequence('game_sessions', 'session_id'),
    (SELECT MAX(session_id) FROM game_sessions),
    true
  );
`);

    await insert(
      'players',
      [1, 2, 3].map((n) => ({
        player_id: n,
        session_id: 1,
        user_id: n + 1,
        nickname: `Reader${n}`,
        player_token_hash: `demo-token-hash-${n}`,
        token_expires_at: null,
        shelf_position: n,
        ranking: n,
        score: 110 - n * 10,
        finished_at: new Date(gameEnd.getTime() - n * 60_000),
        session_output: JSON.stringify({ demo: true }),
        joined_at: gameStart,
      }))
    );
    await queryInterface.sequelize.query(`
  SELECT setval(
    pg_get_serial_sequence('players', 'player_id'),
    (SELECT MAX(player_id) FROM players),
    true
  );
`);

    await insert('player_question_progress', [
      { progress_id: 1, player_id: 1, question_id: 1, status: 'COMPLETED', attempts: 1, completed_at: gameEnd },
      { progress_id: 2, player_id: 1, question_id: 2, status: 'COMPLETED', attempts: 1, completed_at: gameEnd },
      { progress_id: 3, player_id: 2, question_id: 1, status: 'COMPLETED', attempts: 1, completed_at: gameEnd },
      { progress_id: 4, player_id: 2, question_id: 2, status: 'COMPLETED', attempts: 1, completed_at: gameEnd },
      { progress_id: 5, player_id: 3, question_id: 1, status: 'COMPLETED', attempts: 1, completed_at: gameEnd },
      { progress_id: 6, player_id: 3, question_id: 2, status: 'RETRY', attempts: 1, completed_at: null },
    ]);

    await insert('answers', [
      { answer_id: 1, player_id: 1, question_id: 1, choice_index: 1, is_correct: true, answered_at: gameStart },
      { answer_id: 2, player_id: 1, question_id: 2, choice_index: 0, is_correct: true, answered_at: gameStart },
      { answer_id: 3, player_id: 2, question_id: 1, choice_index: 1, is_correct: true, answered_at: gameStart },
      { answer_id: 4, player_id: 2, question_id: 2, choice_index: 1, is_correct: false, answered_at: gameStart },
      { answer_id: 5, player_id: 3, question_id: 1, choice_index: 1, is_correct: true, answered_at: gameStart },
      { answer_id: 6, player_id: 3, question_id: 2, choice_index: 1, is_correct: false, answered_at: gameStart },
    ]);

    await insert('retry_pool', [
      { pool_id: 1, player_id: 3, question_id: 2, added_at: gameStart },
    ]);

    await insert('leaderboard', [
      { entry_id: 1, player_id: 1, score: 100, rank_position: 1, achieved_at: gameEnd },
      { entry_id: 2, player_id: 2, score: 90, rank_position: 2, achieved_at: gameEnd },
      { entry_id: 3, player_id: 3, score: 80, rank_position: 3, achieved_at: gameEnd },
    ]);

    await insert('exp_transactions', [
      {
        transaction_id: 1,
        user_id: 2,
        session_id: 1,
        host_user_id: 1,
        exp_amount: 50,
        awarded_at: gameEnd,
      },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('exp_transactions', { transaction_id: [1] });
    await queryInterface.bulkDelete('leaderboard', { entry_id: [1, 2, 3] });
    await queryInterface.bulkDelete('retry_pool', { pool_id: [1] });
    await queryInterface.bulkDelete('answers', { answer_id: [1, 2, 3, 4, 5, 6] });
    await queryInterface.bulkDelete('player_question_progress', { progress_id: [1, 2, 3, 4, 5, 6] });
    await queryInterface.bulkDelete('players', { player_id: [1, 2, 3] });
    await queryInterface.bulkDelete('game_sessions', { session_id: [1] });
    await queryInterface.bulkDelete('questions', { question_id: [1, 2] });
    await queryInterface.bulkDelete('book_effects', { book_effect_id: [1] });
    await queryInterface.bulkDelete('question_sets', { set_id: [1] });
    await queryInterface.bulkDelete('users', { user_id: [1, 2, 3, 4] });
  },
};