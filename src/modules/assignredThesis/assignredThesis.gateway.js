const assignredThesis = require('./assignredThesis.js');
const Users = require('../user/user.js');

//buscar tesis asignadas
const findAssignredTheses = async () => {
  const theses = await assignredThesis.find();
  if (theses.length === 0) throw new Error('Assignred theses not found');
  return theses;
};

//buscar tesis asignada activas por id
const findAssignredThesisById = async (thesisId) => {
  const thesis = await assignredThesis.findById(thesisId);
  if (!thesis) throw new Error('Assignred theses not found');
  return thesis;
};

//buscar tesis asignada por id de estudiante
const findAssignredThesisByStudentId = async (studentId) => {
  const thesis = await assignredThesis.find({ 'student._id': studentId });
  if (thesis.length === 0) throw new Error('Assignred theses not found');
  await assignredThesisActive(thesis[0]._id);
  return thesis;
};

//guardar tesis asignada
const saveAssignredThesis = async (userId, thesisData) => {
  const thesis = {
    title: thesisData.title,
    problem_definition: thesisData.problem_definition,
    general_objective: thesisData.general_objective,
    specific_objectives: thesisData.specific_objectives,
    solution: thesisData.solution,
    scopes: thesisData.scopes,
    results: thesisData.results,
    references: thesisData.references,
  };

  if (Object.values(thesis).some((field) => !field))
    throw new Error('Missing fields');

  const studentFound = await Users.findById(userId);
  if (!studentFound) throw new Error('User not found');
  if (studentFound.role !== 'estudiante') throw new Error('Invalid role');

  const studentTheses = await assignredThesis.find({ 'student._id': userId });
  if (studentTheses.length !== 0) throw new Error('Thesis already assigned');

  const { names, maternal_surname, paternal_surname } = studentFound;
  const name = `${names} ${maternal_surname} ${paternal_surname}`;

  return new assignredThesis({
    student: { _id: userId, name },
    ...thesis,
  }).save();
};

//actualizar tesis asignada por id
const updateAssignredThesisById = async (thesisId, thesisData) => {
  const thesis = {
    title: thesisData.title,
    problem_definition: thesisData.problem_definition,
    general_objective: thesisData.general_objective,
    specific_objectives: thesisData.specific_objectives,
    solution: thesisData.solution,
    scopes: thesisData.scopes,
    results: thesisData.results,
    references: thesisData.references,
  };

  if (Object.values(thesis).some((field) => !field)) {
    throw new Error('Missing fields');
  }

  await assignredThesisActive(thesisId);
  return assignredThesis.findByIdAndUpdate(thesisId.toString(), thesis, {
    new: true,
  });
};

//actualizar estado de tesis asignada por id
const updateAssignredThesisStatus = async (thesisId) => {
  const thesis = await findAssignredThesisById(thesisId);
  thesis.status = thesis.status === 1 ? 0 : 1;
  await thesis.save();
  return {
    id: thesis._id,
    title: thesis.title,
    status: thesis.status,
  };
};

//eliminar tesis asignada por id
const deleteAssignredThesisById = async (thesisId) => {
  await findAssignredThesisById(thesisId);
  return await assignredThesis.findByIdAndDelete(thesisId);
};

//verificar si la tesis asignada esta activa
const assignredThesisActive = async (thesisId) => {
  const thesis = await findAssignredThesisById(thesisId);
  if (thesis.status === 0) throw new Error('Assignred thesis not active');
  return thesis;
};

module.exports = {
  findAssignredTheses,
  findAssignredThesisById,
  findAssignredThesisByStudentId,
  saveAssignredThesis,
  updateAssignredThesisById,
  updateAssignredThesisStatus,
  deleteAssignredThesisById,
};
