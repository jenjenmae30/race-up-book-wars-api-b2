const { QueryTypes } = require('sequelize');
const { sequelize } = require('../models');

async function findFinishedGamePlayers(since) {
  const sql = `
    SELECT
      s.session_code,
      s.started_at,
      s.ended_at,
      u.school_id,
      p.nickname,
      p.score,
      (p.finished_at IS NOT NULL) AS completed
    FROM game_sessions AS s
    JOIN players AS p ON p.session_id = s.session_id
    JOIN users AS u ON u.user_id = p.user_id
    WHERE s.status = 'CLOSED'
      AND s.ended_at IS NOT NULL
      AND (:since IS NULL OR s.ended_at > CAST(:since AS timestamptz))
    ORDER BY s.ended_at, s.session_id, p.score DESC
  `;

  return sequelize.query(sql, {
    type: QueryTypes.SELECT,
    replacements: { since: since ? since.toISOString() : null },
  });
}

module.exports = { findFinishedGamePlayers };