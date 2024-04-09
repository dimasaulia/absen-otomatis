const Joi = require("joi");
const { joiPasswordExtendCore } = require("joi-password");
const joiPassword = Joi.extend(joiPasswordExtendCore);

const userFormValidation = Joi.object({
    username: Joi.string().min(5).max(50).required(),
    password: joiPassword
        .string()
        .minOfSpecialCharacters(1)
        .minOfLowercase(1)
        .minOfUppercase(1)
        .minOfNumeric(1)
        .noWhiteSpaces()
        .onlyLatinCharacters()
        .required(),
    email: Joi.string().email().required(),
    full_name: Joi.string().required(),
});

const loginFormValidation = Joi.object({
    username: Joi.string().required(),
    password: joiPassword.string().required(),
});

module.exports = {
    userFormValidation,
    loginFormValidation,
};
