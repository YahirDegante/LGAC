const { Router, Response } = require("express");
const { auth, verifyRoles } = require("../../middleware/jwt.js");
const {
    findResearchLines,
    findResearchLineById,
    researchLinesExists,
    saveResearchLine,
    deleteResearchLineById,
    updateResearchLineById,
    findResearchLineActive,
    updateResearchLineStatus,
} = require("./researchLines.gateway.js");

//Obtener todas las líneas de investigación
const getResearchLines = async (req, res = Response) => {
    try {
        const researchLines = await findResearchLines();
        if (researchLines.length === 0) {
            return res.status(200).json({ message: "No se encontraron registros de Lineas de Investigación" });
        }
        res.status(200).json(researchLines);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
    }
};


//Obtener solo las lineas de investigacion activas
const getResearchLinesActives = async (req, res = Response) => {
    try {
        const researchLines = await findResearchLineActive();
        if (researchLines.length === 0) {
            return res.status(200).json({ message: "No se encontraron registros de Lineas de investigación activas" });
        }
        res.status(200).json(researchLines);
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "Error" });
    }
};


//Obtener una linea de investigacion por id
const getResearchLineById = async (req, res = Response) => {
    try {
        const researchLine = await findResearchLineById(req.params.id);
        if (!researchLine) {
            return res.status(404).json({ message: "Research line not found" });
        }
        if (researchLine.status === 0) {
            return res.status(200).json({ message: "Inactive research line" });
        }
        res.status(200).json(researchLine);
    } catch (error) {
        //console.log(error);
        res.status(404).json({ message: "Research line not found" });
    }
};


//Crear una línea de investigación
const createResearchLine = async (req, res = Response) => {
    try {
        const researchLineData = req.body;
        const researchLineExists = await researchLinesExists(researchLineData);

        if (researchLineExists) {
            res.status(400).json({ message: "La línea de investigación ya está registrada." });
        } else {
            const savedResearchLine = await saveResearchLine(researchLineData);
            res.status(201).json(savedResearchLine);
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al registrar la línea de investigación." });
    }
};


//Eliminar una línea de investigación SOLO PARA DESARROLLO
const deleteResearchLine = async (req, res = Response) => {
    try {
        const researchLine = await deleteResearchLineById(req.params.id);
        res.status(200).json(researchLine);
    } catch (error) {
        //console.log(error);
        res.status(404).json({ message: "Research line not found" });
    }
};

//Actualizar una línea de investigación
const updateResearchLine = async (req, res = Response) => {
    try {
        const { id, ...updateData } = req.body;
        const researchLine = await findResearchLineById(req.params.id);
        if (researchLine.status === 0) {
            return res.status(400).json({ message: "Cannot update inactive research line" });
        }
        const updatedResearchLine = await updateResearchLineById(req.params.id, updateData);
        res.status(200).json(updatedResearchLine);
    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "Research line not found" });
    }
};


//Actualizar el status de una línea de investigación
const updateResearchLineStatusById = async (req, res = Response) => {
    try {
        const researchLine = await updateResearchLineStatus(req.params.id);
        res.status(200).json({ message: "ResearchLine updated Succesfully", researchLine });
    } catch (error) {
        cosole.log(error);
        const {code, message} = error;
        res.status(code).json({ message });
    }
};


const researchLinesRouter = Router();
researchLinesRouter.get("/all", [auth, verifyRoles(['coordinador'])], getResearchLines);
researchLinesRouter.get("/actives", [auth, verifyRoles(['coordinador'])], getResearchLinesActives);
researchLinesRouter.get("/:id", [auth, verifyRoles(['coordinador'])], getResearchLineById);
researchLinesRouter.post("/", [auth, verifyRoles(['coordinador'])], createResearchLine);
//researchLinesRouter.delete("/:id" ,[auth, verifyRoles(['coordinador'])], deleteResearchLine);
researchLinesRouter.put("/:id", [auth, verifyRoles(['coordinador'])], updateResearchLine);
researchLinesRouter.put("/status/:id", [auth, verifyRoles(['coordinador'])], updateResearchLineStatusById);

module.exports = {
    researchLinesRouter,
}