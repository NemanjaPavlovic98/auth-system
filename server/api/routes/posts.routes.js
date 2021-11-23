const express = require("express");
const router = express.Router();
const controller = require("../controllers/post.controller");
// const authenticated = require("../middleware/authenticated");

router.get("/get", controller.getAll);

module.exports = router;
