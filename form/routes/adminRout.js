const express = require("express");
const { adminRegister, adminLogin, userForms} = require('../controller/admin');
const adminAuth = require('../middleware/adminAuth');
const router = express.Router();



router.post('/adminRegister', adminRegister)
router.post('/adminLogin',adminLogin)
router.get('/userForms', [adminAuth],userForms)

module.exports = router