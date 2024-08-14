const User = require("./user"); // Ensure the correct path
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "bgverification";

const REST_API = require("../../util/api-util");

// Define the createUser controller function
const createUser = async (req, res) => {
  console.log("inside createUser");

  try {
    const { password } = req.body;
    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);
    req.body.password = hashedPassword;

    const response = await REST_API._add(req, res, User);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUsers = async (req, res) => {
  const response = await REST_API._getAll(req, res, User);
  res.status(200).json(response);
};

const getUserById = async (req, res) => {
  const { userId } = req.params;
  const response = await REST_API._getDataListById(
    req,
    res,
    User,
    "id",
    userId
  );
  res.status(200).json(response);
};

const updateUser = async (req, res) => {
  try {
    const { password } = req.body;
    if (password) {
      // Hash the new password before updating
      const hashedPassword = await bcrypt.hash(password, 10);
      req.body.password = hashedPassword;
    }

    const response = await REST_API._update(req, res, User);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteUser = async (req, res) => {
  const response = await REST_API._delete(req, res, User);
  res.status(200).json(response);
};

exports.verifyUser = async (username, password) => {
  const user = await User.findOne({ where: { username: username } });
  if (!user) return null;

  // Compare the hashed password using bcrypt
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return null;

  const token = exports.generateToken(user);
  // Save the token in the user table
  await user.update({ token: token });
  return user;
};

exports.generateToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, {
    expiresIn: "1h",
  });
};

exports.createUser = createUser;
exports.getUsers = getUsers;
exports.getUserById = getUserById;
exports.updateUser = updateUser;
exports.deleteUser = deleteUser;
