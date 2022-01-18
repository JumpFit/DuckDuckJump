const Sequelize = require('sequelize');
const db = require('../db');

const Game = db.define('game', {
  score: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
  jumps: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
  squats: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
  caloriesBurned: {
    type: Sequelize.INTEGER,
    allowNull: false,
    valiate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
  elapsedTime: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
});

module.exports = Game;
