const express = require("express");
const { getUsers, searchUsers } = require("../controllers/UserController");
const { authenticate } = require("../middlewares/AuthMiddleware");

const router = express.Router();

router.get("/", authenticate, getUsers);
router.get("/search", authenticate, searchUsers);

module.exports = router;
