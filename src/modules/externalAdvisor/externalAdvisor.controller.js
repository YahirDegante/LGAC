const { Router, Response } = require("express");
const { validateError } = require("../../utils/validationHandler.js");
const { auth, verifyRoles } = require("../../middleware/jwt.js");
const {
  findExternalAdvisors,
  findExternalAdvisorById,
  externalAdvisorExists,
  saveExternalAdvisor,
  deleteExternalAdvisorById,
} = require("./externalAdvisor.gateway.js");

//Obtener todos los asesores externos
const getExternalAdvisors = async (req, res = Response) => {
  try {
    const externalAdvisors = await findExternalAdvisors();
    if (!externalAdvisors)
      return res.status(404).json({ message: "External advisors not found" });
    res.status(200).json(externalAdvisors);
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Obtener un asesor externo por nombre
const getExternalAdvisorById = async (req, res = Response) => {
  try {
    const externalAdvisor = await findExternalAdvisorById(req.params.id);
    if (!externalAdvisor)
      return res.status(404).json({ message: "External advisor not found" });
    res.status(200).json(externalAdvisor);
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Crear un asesor externo
const createExternalAdvisor = async (req, res = Response) => {
  try {
    (await externalAdvisorExists(req.body.name))
      ? res.status(400).json({ message: "External advisor already registered" })
      : res.status(201).json(await saveExternalAdvisor(req.body));
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//Eliminar un asesor externo SOLO PARA DESARROLLO
const deleteExternalAdvisor = async (req, res = Response) => {
  try {
    const externalAdvisor = await deleteExternalAdvisorById(req.params.id);
    res.status(200).json(externalAdvisor);
  } catch (error) {
    console.log(error.message);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const externalAdvisorRouter = Router();
externalAdvisorRouter.get("/" ,[auth, verifyRoles(['coordinador'])], getExternalAdvisors);
externalAdvisorRouter.get("/:id" ,[auth, verifyRoles(['coordinador'])], getExternalAdvisorById);
externalAdvisorRouter.post("/" ,[auth, verifyRoles(['coordinador'])], createExternalAdvisor);
// externalAdvisorRouter.delete("/:id" ,[auth, verifyRoles(['coordinador'])], deleteExternalAdvisor);

module.exports = {
  externalAdvisorRouter,
};
