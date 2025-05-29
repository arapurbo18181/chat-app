const cloudinary = require("../lib/cloudinary");
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
    console.log("Error in signup controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ! Login
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // ! initial check
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // ! checking if email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ! checking if password is correct or not
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // ! generating JWT token
    generateToken(user._id, res);
    return res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    // console.log("Error in login controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ! Logout
const logout = (req, res) => {
  try {
    // ! Clearing JWT
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ! Update Profile
const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    // ! initial check
    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // ! uploading on cloudinary
    const uploadRes = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profilePic: uploadRes.secure_url,
      },
      { new: true }
    );
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login,
  logout,
  updateProfile,
  checkAuth,
};
