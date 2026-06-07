const User = require('../models/user.model');

exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json({ data: users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const user = await User.create({ name, email });
    res.status(201).json({ data: user });
  } catch (err) {
    next(err);
  }
};
