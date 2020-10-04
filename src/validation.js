const Joi = require('joi');

const registerSchema = Joi.object({
	username: Joi.string().alphanum().max(32).required(),
	name: Joi.string().min(6).max(255).required(),
	email: Joi.string().min(6).max(255).email().required(),
	password: Joi.string().min(8).max(1024).required()
});

const loginSchema = Joi.object({
	email: Joi.string().min(6).max(255).email().required(),
	password: Joi.string().min(8).max(1024).required()
});

const registerValidation = (data) => {
	const { error } = registerSchema.validate(data);

	if (error) console.log(error);

	return !error;
}

const loginValidation = (data) => {
	const { error } = loginSchema.validate(data);

	return !error
}

module.exports = {
	registerValidation,
	loginValidation,
}