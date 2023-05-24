const express = require("express");
const cache = require("../routeCache");
const { createUser, getallUser } = require("../controllers/userController");
const router = express.Router();

router.route("/register").post(createUser);
router.route("/get-all-user").get(getallUser);

module.exports = router;
