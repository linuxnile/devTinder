const validator = require("validator");

const validateSignUpData = (req) => {
  const {
    firstName,
    lastName,
    emailId,
    password,
    age,
    photoUrl,
    about,
    skills = [],
  } = req.body;

  if (!validator.isEmail(emailId)) {
    throw new Error("Please enter any valid email address");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter any strong password");
  }
};

const validateProfileEditData = (req) => {
  const allowedEditData = [
    "firstName",
    "lastName",
    "age",
    "photoUrl",
    "gender",
    "about",
    "skills",
  ];

  const isUpdateAllowed = Object.keys(req.body).every((k) => {
    return allowedEditData.includes(k);
  });
  return isUpdateAllowed;
};

module.exports = { validateSignUpData, validateProfileEditData };
