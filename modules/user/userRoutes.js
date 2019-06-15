const path = require("path");
const api = require(path.resolve(".", "modules/user/userController.js"));
const express = require("express");
const router = express.Router();

// api to fetch sample data from randomuser.me
router.get("/fetchData", api.fetchData);

// api to generate a summary of user data
router.get("/getStats", api.getStats);

module.exports = router;
