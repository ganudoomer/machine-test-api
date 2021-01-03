const router = require('express').Router();
const {
	registerController,
	loginController,
	forgotPasswordController,
	userEditController,
	userInfoController
} = require('../controller');
const { userRegValidationRules, userLogValidationRules, userEditValidationRules, validate } = require('../validator');
// Root Route
router.get('/', async (req, res) => {
	res.json({ msg: 'Hello Welcome To API' });
});

// Register Route
router.post('/register', userRegValidationRules(), validate, registerController);

//Login Route
router.post('/login', userLogValidationRules(), validate, loginController);

//Forget  Password  Route
router.post('/forget_password', forgotPasswordController);

// Dashboard Details
router.post('/user_info', userInfoController);

//Edit Dashboard
router.put('/user_info', userEditValidationRules(), validate, userEditController);

module.exports = router;
