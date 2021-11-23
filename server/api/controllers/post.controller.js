const db = require("../../models");
const Post = db.Post;
const bcrypt = require("bcrypt");
const sequelize = require("sequelize");

async function getAll(req, res, next) {
  try {
    let results = await Post.findAll();
    return res.status(200).json(results);
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

module.exports = { getAll };
