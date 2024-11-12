const Joi = require("joi");

const signupValidation = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().min(3).max(100).required().messages({
      "string.base": "Name must be a string",
      "string.empty": "Name cannot be empty",
      "string.min": "Name must be at least 3 characters long",
      "string.max": "Name can be at most 100 characters long",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
      .messages({
        "string.base": "Password must be a string",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
      }),
    department: Joi.string().required().messages({
      "string.base": "Department must be a string",
      "any.required": "Department is required",
    }),
    year: Joi.number().required().messages({
      "number.base": "Year must be a number",
      "any.required": "Year is required",
    }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Extracting the message for each error
    const errorMessages = error.details.map((detail) => detail.message);
    return res
      .status(400)
      .json({ message: "Bad request", errors: errorMessages });
  }

  next();
};

const loginValidation = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email must be a string",
      "string.email": "Email must be a valid email address",
      "any.required": "Email is required",
    }),
    password: Joi.string()
      .min(8)
      .required()
      .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$"))
      .messages({
        "string.base": "Password must be a string",
        "string.min": "Password must be at least 8 characters long",
        "string.pattern.base":
          "Password must contain at least one uppercase letter, one lowercase letter, and one number",
        "any.required": "Password is required",
      }),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    // Extracting the message for each error
    const errorMessages = error.details.map((detail) => detail.message);
    return res
      .status(400)
      .json({ message: "Bad request", errors: errorMessages });
  }

  next();
};

module.exports = { signupValidation, loginValidation };
