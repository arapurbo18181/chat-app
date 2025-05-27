const signup = (req, res) => {
  res.status(201).json({
    statusCode: 201,
    message: "Signup route",
  });
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
