const { body, validationResult } = require('express-validator');
module.exports.userRegValidationRules = () => {
	return [
		// username must be an email
		body('email').isEmail(),
		// password must be at least 5 chars long
		body('password').isLength({ min: 5 }),
		// Date of birth must be valid date
		body('dob').isDate({ format: 'DD-MM-YYYY' }),
		//Phone number should be more than 10
		body('phone').isLength({ min: 5 }),
		//Gender must be male or female
		body('gender').isIn([ 'male', 'female' ])
	];
};

module.exports.userEditValidationRules = () => {
	return [
		// username must be an email
		body('email').isEmail(),
		// Date of birth must be valid date
		body('dob').isDate({ format: 'DD-MM-YYYY' }),
		//Phone number should be more than 10
		body('phone').isLength({ min: 5 }),
		//Password must be empty or more than 5
		body('password').if(body('password').exists()).isLength({ min: 5 }),
		//Gender must be male or female
		body('gender').isLength({ min: 5 }).isIn([ 'male', 'female' ])
	];
};

module.exports.userLogValidationRules = () => {
	return [
		// username must be an email
		body('email').isEmail(),
		// password must be at least 5 chars long
		body('password').isLength({ min: 5 })
		// Date of birth must be valid date
	];
};

module.exports.validate = (req, res, next) => {
	const errors = validationResult(req);
	if (errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	errors.array().map((err) => extractedErrors.push({ [err.param]: err.msg }));

	return res.json({
		errors: extractedErrors
	});
};
