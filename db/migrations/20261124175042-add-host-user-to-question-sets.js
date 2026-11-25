'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('question_sets', 'host_user_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    });

    await queryInterface.addConstraint('question_sets', {
      fields: ['host_user_id'],
      type: 'foreign key',
      name: 'fk_question_sets_host_user',
      references: {
        table: 'users',
        field: 'user_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'question_sets',
      'fk_question_sets_host_user'
    );
    await queryInterface.removeColumn('question_sets', 'host_user_id');
  },
};