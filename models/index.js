'use strict';

const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env];
const User = require("./user");
const Post = require("./post");
const Like = require("./like");
const db = {};


const sequelize = new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;
db.User = User;
db.Post = Post;
db.Like = Like;

User.init(sequelize);
Post.init(sequelize);
Like.init(sequelize);

User.associate(db);
Post.associate(db);
Like.associate(db);

module.exports = db;
