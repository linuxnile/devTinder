const express = require("express");
const authRouter = express.Router();
const { validateSignUpData } = require("../utils/validation");
const bcryptjs = require("bcryptjs");
const User = require("../models/user");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignUpData(req);

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
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: hashedPassword,
      age,
      photoUrl,
      about,
      skills,
    });

    if (skills.length > 5) {
      throw new Error("Skill cannot be more than 5");
    }
    await user.save();
    res.send("User inserted successfully");
  } catch (err) {
    res.status(400).send("Not inserted " + err);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credential");
    }

    const passCompare = user.validatePassword(password);

    if (passCompare) {
      const token = await user.getJWT();
      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      res.send(user);
    } else {
      throw new Error("Invalid Credential");
    }
  } catch (err) {
    res.send("Something went wrong: " + err);
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.send("Successfully logout");
});

module.exports = authRouter;
