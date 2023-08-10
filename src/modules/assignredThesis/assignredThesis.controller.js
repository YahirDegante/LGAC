const { Router, response } = require("express");
const { validateError } = require("../../utils/validationHandler.js");
const {
  findAssignredTheses,
  findAssignredThesisById,
  findAssignredThesisByStudentId,
  saveAssignredThesis,
  updateAssignredThesisById,
  updateAssignredThesisStatus,
  deleteAssignredThesisById,
} = require("./assignredThesis.gateway.js");
const { auth, verifyRoles } = require("../../middleware/jwt.js");

//obtener todas las tesis asignadas
const getAssignredThesis = async (req, res = response) => {
  try {
    res.status(200).json(await findAssignredTheses());
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//obtener tesis asignada por id
const getAssignredThesisById = async (req, res = response) => {
  try {
    res.status(200).json(await findAssignredThesisById(req.params._id));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//obtener tesis asignada por id de estudiante
const getAssignredThesisByStudentId = async (req, res = response) => {
  try {
    res.status(200).json(await findAssignredThesisByStudentId(req.params._id));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//crear tesis asignada
const createAssignredThesis = async (req, res = response) => {
  try {
    const assignedThesis = await saveAssignredThesis(req.params._id, req.body);
    res
      .status(200)
      .json({ message: "Thesis assigned successfully", assignedThesis });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//actualizar tesis asignada
const updateAssignredThesis = async (req, res = response) => {
  try {
    const assignredThesis = await updateAssignredThesisById(
      req.params._id,
      req.body
    );
    res
      .status(200)
      .json({
        message: "Assignred Thesis updated successfully",
        assignredThesis,
      });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//actualizar estado de tesis asignada
const changeAssignredThesisStatus = async (req, res = response) => {
  try {
    res.status(200).json(await updateAssignredThesisStatus(req.params._id));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//eliminar tesis asignada
const deleteAssignredThesis = async (req, res = response) => {
  try {
    const assignredThesis = await deleteAssignredThesisById(req.params._id);
    res
      .status(200)
      .json({
        message: "Assignred Thesis deleted successfully",
        assignredThesis,
      });
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const assignredThesisRouter = Router();
assignredThesisRouter.get(
  "/",
  [auth, verifyRoles("docente")],
  getAssignredThesis
);
assignredThesisRouter.get(
  "/:_id",
  [auth, verifyRoles("docente")],
  getAssignredThesisById
);
assignredThesisRouter.get(
  "/student/:_id",
  [auth, verifyRoles("docente", "estudiante")],
  getAssignredThesisByStudentId
);
assignredThesisRouter.post(
  "/:_id",
  [auth, verifyRoles("docente")],
  createAssignredThesis
);
assignredThesisRouter.put(
  "/:_id",
  [auth, verifyRoles("docente")],
  updateAssignredThesis
);
assignredThesisRouter.delete(
  "/:_id",
  [auth, verifyRoles("docente")],
  changeAssignredThesisStatus
);
// assignredThesisRouter.delete('/:_id', [auth, verifyRoles("docente")], deleteAssignredThesis);

module.exports = {
  assignredThesisRouter,
};
