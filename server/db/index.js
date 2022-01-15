const db = require('./db');
const Character = require('./models/Character');
const Game = require('./models/Game');
const User = require('./models/User');

// Associations
User.hasMany(Game);
Game.belongsTo(User);

User.hasMany(Character);
Character.belongsTo(User);

User.belongsToMany(User, { through: 'Connection' });
User.belongsToMany(User, { through: 'Connection' });

module.exports = { db, models: { Character, Game, User } };
