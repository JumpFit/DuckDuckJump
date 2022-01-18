const Sequelize = require('sequelize');
const db = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Game = require('./Game');

const SALT_ROUNDS = 5;

const User = db.define('user', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  firstName: {
    type: Sequelize.STRING,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  birthday: {
    type: Sequelize.DATE,
    validate: {
      notEmpty: true,
    },
  },
  weight: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  height: {
    type: Sequelize.INTEGER,
    validate: {
      notEmpty: true,
    },
  },
  coins: {
    type: Sequelize.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
      notEmpty: true,
    },
    defaultValue: 0,
  },
});

// instance methods
User.prototype.correctPassword = function (candidatePwd) {
  //we need to compare the plain version to an encrypted version of the password
  return bcrypt.compare(candidatePwd, this.password);
};

User.prototype.generateToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT);
};

// class methods
User.authenticate = async function ({ username, password }) {
  const user = await this.findOne({ where: { username } });
  if (!user || !(await user.correctPassword(password))) {
    const error = Error('Incorrect username/password');
    error.status = 401;
    throw error;
  }
  return user.generateToken();
};

User.findByToken = async function (token) {
  try {
    const { id } = await jwt.verify(token, process.env.JWT);

    const user = User.findByPk(id, { include: Game });
    if (!user) {
      throw 'User not found!';
    }
    return user;
  } catch (ex) {
    const error = Error('bad token');
    error.status = 401;
    throw error;
  }
};

// hooks
const hashPassword = async (user) => {
  //in case the password has been changed, we want to encrypt it with bcrypt
  if (user.changed('password')) {
    user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
  }
};

User.beforeCreate(hashPassword);
User.beforeUpdate(hashPassword);
User.beforeBulkCreate((users) => Promise.all(users.map(hashPassword)));

module.exports = User;
