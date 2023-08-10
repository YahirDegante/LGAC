const ResearchLines = require("./researchLines.js");
const { ObjectId } = require("mongoose").Types;

//Traer todas las lineas de investigacion
const findResearchLines = async () => {
    return await ResearchLines.find()
};

//Traer solo las lineas de investigacion activas
const findResearchLineActive = async () => {
    return await ResearchLines.find({ status: 1 });
};

//Traer una linea de investigacion por id
const findResearchLineById = async (researchLineId) => {
    return await ResearchLines.findById(researchLineId);
};

//
const researchLinesExists = async (researchLineData) => {
    const { name } = researchLineData;
    const normalizedNewName = normalizeString(name);

    const existingResearchLines = await ResearchLines.find({});

    for (const existingResearchLine of existingResearchLines) {
        const existingName = existingResearchLine.name;
        const normalizedExistingName = normalizeString(existingName);

        if (normalizedExistingName === normalizedNewName) {
            return true;
        }
    }

    return false;
};

const saveResearchLine = async (researchLineData) => {
    const researchLineExists = await researchLinesExists(researchLineData);

    if (researchLineExists) {
        throw new Error('Ya existe una línea de investigación con el mismo nombre (considerando diferencias de acentos, mayúsculas y minúsculas).');
    }

    const researchLine = new ResearchLines({
        _id: new ObjectId().toString(),
        ...researchLineData,
        status: 1,
    });

    return await researchLine.save();
};

// Función para normalizar una cadena de texto, removiendo los acentos y caracteres diacríticos
const normalizeString = (string) => {
    return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

//Actualizar una linea de investigacion
const updateResearchLineById = async (researchLineId, updateResearchLineData) => {
    const { name, status } = updateResearchLineData;
    if (status === 0) {
        throw new Error("No se puede actualizar una línea de investigación inactiva.");
    }
    const existingResearchLine = await ResearchLines.findById(researchLineId);
    if (!existingResearchLine) {
        throw new Error("No se encontró una línea de investigación con el ID proporcionado.");
    }
    const researchLineExists = await researchLinesExists({ name });
    if (researchLineExists && existingResearchLine.name !== name) {
        throw new Error("Ya existe una línea de investigación con el mismo nombre.");
    }
    existingResearchLine.name = name;
    existingResearchLine.status = status;
    return await existingResearchLine.save();
};


//Actualizar el estado de una linea de investigacion
const updateResearchLineStatus = async (researchLineId) => {
    const researchLine = await findResearchLineById(researchLineId);
    if (!researchLine) {
        throw new Error("Research line not found");
    }
    researchLine.status = researchLine.status === 1 ? 0 : 1;
    await researchLine.save();
    const researchLineUpdated = {
        _id: researchLine._id,
        name: researchLine.name,
        status: researchLine.status
    };
    return researchLineUpdated;
};

//Eliminar una linea de investigacion
const deleteResearchLineById = async (researchLineId) => {
    console.log(researchLineId);
    return await ResearchLines.findByIdAndDelete(researchLineId);
};

module.exports = {
    findResearchLines,
    saveResearchLine,
    findResearchLineById,
    researchLinesExists,
    updateResearchLineById,
    deleteResearchLineById,
    updateResearchLineStatus,
    findResearchLineActive,
};