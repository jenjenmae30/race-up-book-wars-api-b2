module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'Player',
    {
      player_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      session_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      nickname: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      player_token_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      token_expires_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      shelf_position: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      ranking: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      finished_at: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      session_output: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      tableName: 'players',
      timestamps: true,
      createdAt: 'joined_at',
      updatedAt: false,
    }
  );