const express = require("express");
const router = express.Router();
const controller = require("../controllers/user.controller");
const multer = require("../middlewares/multer");
const checkAuth = require("../middlewares/check-auth");
const checkIsOwn = require("../middlewares/check-own-auth");

router.get("/get", controller.getAll);
router.post("/register", multer, controller.register);
router.post("/login", controller.login);
router.put("/updateUser", checkAuth, multer, controller.updateUser);
router.get("/get/id/:id", checkAuth, checkIsOwn, controller.getById)

module.exports = router;
