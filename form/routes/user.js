const express = require("express");
const { register, login, form, getForm } = require("../controller/user");
const auth = require("../middleware/auth")
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/form", [auth], form);
router.get("/getForm", [auth], getForm);

module.exports = router