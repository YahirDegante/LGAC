const { Router, response } = require("express");
const { validateError } = require("../../utils/validationHandler.js");
const { auth, verifyRoles } = require("../../middleware/jwt.js");
const {
  findUsers,
  findUsersByRoleAndResearchLine,
  findUserById,
  saveUser,
  updateUserById,
  sendEmailToUser,
  updateUserStatus,
  deleteUserById,
} = require("./user.gateway.js");

//Obtener todos los usuarios
const getUsers = async (req, res = response) => {
  try {
    res.status(200).json(await findUsers());
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Obtener usuarios por rol y linea de investigacion
const getUserByRoleAndResearchLine = async (req, res = response) => {
  const { role, research_line } = req.params;
  try {
    res
      .status(200)
      .json(await findUsersByRoleAndResearchLine(role, research_line));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Obtener usuario por id
const getUserById = async (req, res = response) => {
  try {
    res.status(200).json(await findUserById(req.params._id));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Crear usuario
const createUser = async (req, res = response) => {
  try {
    const user = await saveUser(req.body);
    res.status(201).json({ message: "User registered succesfully", user });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Actualizar usuario ------
const updateUser = async (req, res = response) => {
  try {
    const user = await updateUserById(req.params._id, req.body);
    res.status(200).json({ message: "User updated succesfully", user });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Enviar email
const sendEmail = async (req, res = response) => {
  try {
    const email = await sendEmailToUser(req.params._id, req.body);
    res.status(200).json({ message: "Email sent succesfully", email });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Actualizar estado de usuario
const changeUserStatus = async (req, res = response) => {
  try {
    const user = await updateUserStatus(req.params._id);
    res.status(200).json({ message: "User updated succesfully", user });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Eliminar usuario SOLO PARA DESARROLLO
const deleteUser = async (req, res = response) => {
  try {
    const user = await deleteUserById(req.params._id);
    res.status(200).json({ message: "User deleted succesfully", user });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const userRouter = Router();

userRouter.get("/", [auth, verifyRoles(["coordinador"])], getUsers);
userRouter.get(
  "/:role/:research_line",
  [auth, verifyRoles(["coordinador"])],
  getUserByRoleAndResearchLine
);
userRouter.get(
  "/:_id",
  [auth, verifyRoles("coordinador", "docente", "estudiante")],
  getUserById
);
userRouter.post("/", [auth], createUser);
userRouter.put("/:_id", [auth], updateUser);
userRouter.post(
  "/sendEmail/:_id",
  [auth, verifyRoles(["coordinador"])],
  sendEmail
);
userRouter.delete("/:_id", [auth], changeUserStatus);
// userRouter.delete('/:_id', [auth], deleteUser);

module.exports = {
  userRouter,
};
