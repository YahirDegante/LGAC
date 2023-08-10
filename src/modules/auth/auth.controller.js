const { Router, response } = require("express");
const { userLogin, userChangePassword } = require("./auth.gateway.js");
const { validateError } = require("../../utils/validationHandler.js");

const login = async (req, res = response) => {
  try {
    const login = await userLogin(req.body);
    res.status(200).json({ message: "Login successful", data: login });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const changePassword = async (req, res = response) => {
  try {
    const user = await userChangePassword(req.params._id, req.body);
    res.status(200).json({ message: "Password changed", data: user });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const authRouter = Router();
authRouter.post("/login", [], login);
authRouter.put("/change-password/:_id", [], changePassword);

module.exports = {
  authRouter,
};
