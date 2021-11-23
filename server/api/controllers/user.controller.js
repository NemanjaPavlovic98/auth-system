const db = require("../../models");
const User = db.User;
const bcrypt = require("bcrypt");
const { ValidationError, Op, cast, where } = require("sequelize");
const sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
// const { ExtractJwt } = require("passport-jwt");

async function getAll(req, res, next) {
  try {
    let results = await User.findAll();
    return res.status(200).json(results);
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

async function getById(req, res, next) {
  const id = req.params.id;
  if (id === undefined)
    return res.status(400).send({ message: "No id provided" });
  try {
    let result = await User.findByPk(id);
    // result.setDataValue("password", undefined);
    // result.password = await bcrypt.(result.password, 10);
    return res.status(200).send(result);
  } catch (e) {
    e.status = 500;
    next(e);
  }
}

async function register(req, res, next) {
  try {
    const url = req.protocol + "://" + req.get("host");
    let user = {
      name: req.body.name,
      username: req.body.username,
      password: await bcrypt.hash(req.body.password, 10),
      email: req.body.email,
    };

    let checkEmail = await User.findOne({ where: { email: req.body.email } });
    let checkUsername = await User.findOne({
      where: { username: req.body.username },
    });
    if (checkEmail || checkUsername) {
      let errorArray = [];
      if (checkEmail) {
        errorArray.push("Email already taken");
      }
      if (checkUsername) {
        errorArray.push("Username already taken");
      }
      return res.status(404).json({ message: errorArray });
    }

    if (typeof req.file !== "undefined") {
      user.imageUrl = url + "/images/" + req.file.filename;
    } else {
      user.imageUrl = null;
    }
    newUser = await User.create(user);
    newUser.setDataValue("password", undefined);
    return res.status(201).json({
      message: "New user registered",
      user: newUser,
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      return res.status(401).json({ message: "Error occured, try again" });
    } else return res.status(401).json({ message: "Error occured" });
    next(e);
  }
}

async function login(req, res, next) {
  if ((req.body.email || req.body.username) && req.body.password) {
    let user = null;
    if (req.body.email) {
      user = await User.findOne({ where: { email: req.body.email } });
    }
    if (req.body.username) {
      user = await User.findOne({ where: { username: req.body.username } });
    }
    if (!user) return res.status(404).json({ message: "No such user" });
    if (await user.checkPassword(req.body.password)) {
      const token = jwt.sign(
        { email: user.email, userId: user.id },
        "ewinrwonbrnbrbneoiboeibmteqmwvmrw",
        { expiresIn: "1h" }
      );

      user.setDataValue("password", undefined);
      return res.status(200).json({
        message: "Login successful",
        token: token,
        expirationTime: 3600,
        user: user,
      });
    }
    return res.status(401).json({ message: "Wrong password" });
  }
}

async function updateUser(req, res, next) {
  try {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const userId = +req.body.id;
    const user = await User.findOne({ where: { id: userId } });

    if (!user) return res.status(404).json({ message: "No such user" });

    if (req.body.name) {
      user.name = req.body.name;
    }

    let errorArray = [];
    if (req.body.username) {
      if (user.username != req.body.username) {
        let checkUsername = await User.findOne({
          where: { username: req.body.username },
        });
        if (checkUsername) {
          errorArray.push("Username already taken!");
        }
      }
      user.username = req.body.username;
    }
    if (req.body.email) {
      if (user.email != req.body.email) {
        let checkEmail = await User.findOne({
          where: { email: req.body.email },
        });
        if (checkEmail) {
          errorArray.push("Email already taken!");
        }
      }
      user.email = req.body.email;
    }
    if (req.body.password) {
      user.password = await bcrypt.hash(req.body.password, 10);
    }

    const url = req.protocol + "://" + req.get("host");

    if (typeof req.file !== "undefined") {
      user.imageUrl = url + "/images/" + req.file.filename;
    } else {
      if (user.imageUrl && !req.body.image) {
        user.imageUrl = null;
      }
    }

    if (errorArray.length > 0) {
      return res.status(404).json({ message: errorArray });
    }
    user.save().then((savedUser) => {
      savedUser.setDataValue("password", null);
      return res
        .status(200)
        .json({ message: "Update successful", user: savedUser });
    });
  } catch (e) {
    if (e instanceof ValidationError) {
      e.status = 400;
    } else e.status = 500;
    next(e);
  }
}

module.exports = { getAll, register, login, updateUser, getById };
