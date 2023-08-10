const uploadedDocument = require("./uploadedDocument.js");
const { findUserById } = require("../user/user.gateway.js");
const { getBucket } = require("../../middleware/multer.js");
const { ObjectId } = require("mongodb");

//buscar todos los documentos
const findAllUploadedDocuments = async () => {
  const documents = await uploadedDocument.find();
  if (documents.length === 0) throw new Error("Documents not found");
  return documents;
};

//buscar todos los documentos activos
const findActiveUploadedDocuments = async () => {
  const documents = await uploadedDocument.find({ status: 1 });
  if (documents.length === 0) throw new Error("Documents not found");
  return documents;
};

//buscar documentos por id del estudiante
const findUploadedDocumentsByStudentId = async (userId) => {
  const documents = await uploadedDocument.find({ "user._id": userId });
  if (documents.length === 0) throw new Error("Documents not found");
  return documents;
};

//buscar documento por id
const findUploadedDocumentById = async (fileId) => {
  const document = await uploadedDocument.findById(fileId);
  if (!document) throw new Error("Documents not found");
  return document;
};

//guardar documento
const saveDocument = async (file = null, documentData = null, userId) => {
  const user = await findUserById(userId);
  if (user.role !== "estudiante") throw new Error("Invalid role");
  console.log(file);
  
  if (!file || !documentData.type) throw new Error("Missing fields");
  if (file.mimetype !== "application/pdf") throw new Error("Invalid file");
  if (file.size > 10000000) throw new Error("Exceeded limit");

  const name = `${user.names} ${user.maternal_surname} ${user.paternal_surname}`;

  return await new uploadedDocument({
    _id: file.id,
    user: { _id: userId, name },
    file: file.originalname,
    type: documentData.type,
    date: file.uploadDate,
    observation: "Sin revisar",
    file_status: "Sin revisar",
    status: 1,
  }).save();
};

//actualizar documento por estudiante
const updateFileByStudent = async (_id, file = null) => {
  await findUploadedDocumentById(_id);

  if (!file) throw new Error("Missing fields");
  if (file.mimetype !== "application/pdf") throw new Error("Invalid file");
  if (file.size > 5000000) throw new Error("Exceeded limit");

  return await uploadedDocument.findOneAndUpdate(
    { _id },
    {
      file: file.originalname,
      date: new Date(),
      file_status: "Corregido",
    },
    { new: true }
  );
};

//actualizar documento por docente
const updateFileByTeacher = async (_id, { observation, file_status }) => {
  await findUploadedDocumentById(_id);
  if (!(observation || file_status)) throw new Error("Missing fields");

  return await uploadedDocument.findOneAndUpdate(
    { _id },
    { observation, file_status },
    { new: true }
  );
};

//descargar documento
const downloadFile = async (fileId) => {
  const bucket = await getBucket();
  const chunkCollection = bucket.s._chunksCollection;
  const chunks = await chunkCollection
    .find({ files_id: new ObjectId(fileId) })
    .toArray();
  const chunk = chunks[0];
  const fileMetadata = await bucket.find({ _id: chunk.files_id }).toArray();
  const {
    metadata: { file },
    contentType,
  } = fileMetadata[0];
  return { contentType, file, bucket, chunk };
};

//actualizar estado del documento
const updateDocumentStatus = async (fileId) => {
  const document = await findUploadedDocumentById(fileId);
  document.status = document.status === 1 ? 0 : 1;
  await document.save();
  return {
    _id: document._id,
    file: document.file,
    status: document.status,
  };
};

//eliminar documento
const deleteFile = async (fileId) => {
  await findUploadedDocumentById(fileId);
  return await uploadedDocument.findByIdAndDelete(fileId);
};

module.exports = {
  findAllUploadedDocuments,
  findActiveUploadedDocuments,
  findUploadedDocumentsByStudentId,
  findUploadedDocumentById,
  saveDocument,
  updateFileByStudent,
  updateFileByTeacher,
  downloadFile,
  updateDocumentStatus,
  deleteFile,
};
