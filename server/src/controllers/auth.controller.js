const { generateToken } = require("../lib/utils");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");

// ! Signup
const signup = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    // ! initial check
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ! checking password length
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }

    // ! checking if email already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "Email already exists" });
    }
    // ! encrypting password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    // ! generating JWT token
    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller");
    return res.status(500).json({ message: "Internal server error" });
  }
};

const login = (req, res) => {
  res.status(201).json({
    statusCode: 201,
    message: "Login route",
  });
};

const logout = (req, res) => {
  res.status(200).json({
    statusCode: 200,
    message: "Logout route",
  });
};

module.exports = {
  signup,
  login,
  logout,
};
