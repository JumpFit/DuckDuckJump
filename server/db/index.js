const db = require('./db');
const Character = require('./models/Character');
const Game = require('./models/Game');
const User = require('./models/User');

// Associations
User.hasMany(Game);
Game.belongsTo(User);

User.belongsToMany(Character, { through: 'userCharacter' });
Character.belongsToMany(User, { through: 'userCharacter' });

User.belongsToMany(User, { through: 'connection', as: 'friend' });

module.exports = { db, models: { Character, Game, User } };
