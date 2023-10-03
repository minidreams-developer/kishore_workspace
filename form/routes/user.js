const express = require("express");
const { register, login, form, getForm, updateForm, deleteForm } = require("../controller/user");
const auth = require("../middleware/auth")
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/form", [auth], form);
router.get("/getForm", [auth], getForm);
router.put("/updateForm", [auth], updateForm);
router.delete("/deleteForm", [auth], deleteForm);

module.exports = router