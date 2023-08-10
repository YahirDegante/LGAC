const ExternalAdvisor = require("./externalAdvisor.js");

const findExternalAdvisors = async () => {
  return await ExternalAdvisor.find();
};

const findExternalAdvisorById = async (userId) => {
  return await ExternalAdvisor.findById(userId);
};

const externalAdvisorExists = async (name) => {
  const normalizedNewName = normalizeString(name);
  const existingExternalAdvisors = await ExternalAdvisor.find({});

  for (const existingExternalAdvisor of existingExternalAdvisors) {
    const existingName = existingExternalAdvisor.name;
    const normalizedExistingName = normalizeString(existingName);

    if (normalizedExistingName === normalizedNewName) {
      return true;
    }
  }
  return false;
};

const saveExternalAdvisor = async (externalAdvisorData) => {
  const externalAdvisorExists = await externalAdvisorExists(externalAdvisorData);

  if (externalAdvisorExists) {
    throw new Error(
      "Ya existe un asesor externo con el mismo nombre (considerando diferencias de acentos, mayúsculas y minúsculas)."
    );
  }
  const externalAdvisor = new ExternalAdvisor({
    _id: new ObjectId().toString(),
    ...externalAdvisorData,
  });
  return await externalAdvisor.save();
};

// Función para normalizar una cadena de texto, removiendo los acentos y caracteres diacríticos
const normalizeString = (string) => {
  return string.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

const deleteExternalAdvisorById = async (userId) => {
  console.log(userId);
  return await ExternalAdvisor.findByIdAndDelete(userId);
};

module.exports = {
  findExternalAdvisors,
  findExternalAdvisorById,
  externalAdvisorExists,
  saveExternalAdvisor,
  deleteExternalAdvisorById
};
