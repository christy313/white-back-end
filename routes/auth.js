const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !email || !password)
    return res.status(400).json("please fill required field");

  const hashedPassword = bcrypt.hash(password, saltRounds);

  const newUser = new User({
    username,
    email,
    password: await hashedPassword,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(error.message);
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res.status(400).json("please fill required field");

  try {
    const user = await User.findOne({
      username,
    });
    if (!user) return res.status(401).json("Something went wrong");

    bcrypt.compare(password, user.password, (err, isSuccess) => {
      if (err || !isSuccess)
        return res.status(401).json("Something went wrong");
      const { password, ...others } = user._doc;

      const accessToken = jwt.sign(
        {
          id: user._id,
          isAdmin: user.isAdmin,
        },
        process.env.JWT_SECRET,
        { expiresIn: "3d" }
      );
      res.status(200).json({ ...others, accessToken });
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
