var express = require('express');
var router = express.Router();

/* get controller */
let login = require('../controllers/login');

router.get('/',login.get_login_info);
router.post('/get_login_info', login.get_login_info);
router.post('/login', login.auth_login);
router.post('/register', login.register_new_user);
router.post('/add_new_user_info', login.add_new_user_info);
router.post('/homepage', login.display_homepage);
router.post('/logout', login.logout);
router.post('/viewAccountDetails', login.view_account_details);
router.post('/change_account_details', login.change_account_details);
router.post('/update_account_details', login.update_account_details);
router.post('/change_password',login.update_password);
router.post('/change_password_details',login.change_password_details);
module.exports = router;


