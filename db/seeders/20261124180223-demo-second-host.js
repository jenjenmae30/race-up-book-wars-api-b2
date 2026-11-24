'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.bulkInsert('users', [
      {
        user_id: 5,
        school_id: 'DEMO-HOST-02',
        full_name: 'Demo Host Two',
        email: 'host2@example.test',
        nickname: 'BookHost2',
        password_hash: 'demo-seed-hash-host-2',
        role: 'HOST',
        total_exp: 0,
        created_at: new Date('2026-11-25T00:00:00.000Z'),
      },
    ]);

    await queryInterface.sequelize.query(`
      SELECT setval(
        pg_get_serial_sequence('users', 'user_id'),
        (SELECT MAX(user_id) FROM users),
        true
      )
    `);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', {
      school_id: 'DEMO-HOST-02',
    });
  },
};