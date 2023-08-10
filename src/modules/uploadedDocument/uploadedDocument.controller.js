const { Router, response } = require("express");
const { validateError } = require("../../utils/validationHandler.js");
const { upload } = require("../../middleware/multer.js");
const { auth, verifyRoles } = require("../../middleware/jwt");
const {
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
} = require("./uploadedDocument.gateway.js");

//obtener todos los documentos
const getAllUploadedDocuments = async (req, res = response) => {
  try {
    res.status(200).json(await findAllUploadedDocuments());
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//obtener todos los documentos activos
const getActiveUploadedDocuments = async (req, res = response) => {
  try {
    res.status(200).json(await findActiveUploadedDocuments());
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//obtener documentos por id del estudiante
const getUploadedDocumentsByStudentId = async (req, res = response) => {
  try {
    res
      .status(200)
      .json(await findUploadedDocumentsByStudentId(req.params._id));
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//obtener documento por id
const getUploadedDocumentById = async (req, res = response) => {
  try {
    res.status(200).json(await findUploadedDocumentById(req.params._id));
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//subir documento
const uploadDocument = async (req, res = response) => {
  try {
    console.log(req.file);
    const document = await saveDocument(req.file, req.body, req.params._id);
    res.status(201).json({ message: "Document uploaded", document });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//actualizar documento por estudiante
const updateDocumentByStudent = async (req, res = response) => {
  try {
    const document = await updateFileByStudent(req.params._id, req.file);
    res.status(200).json({ message: "Document updated", document });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//actualizar documento por profesor
const updateDocumentByTeacher = async (req, res = response) => {
  try {
    const document = await updateFileByTeacher(req.params._id, req.body);
    res.status(200).json({ message: "Document updated", document });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//descargar documento
const downloadDocument = async (req, res) => {
  try {
    const documentId = req.params._id;
    const { contentType, file, bucket, chunk } = await downloadFile(documentId);
    res.set({
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename=${file}`,
    });
    bucket.openDownloadStream(chunk.files_id).pipe(res);
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//cambiar estado del documento
const changeDocumentStatus = async (req, res = response) => {
  try {
    const document = await updateDocumentStatus(req.params._id);
    res.status(200).json({ message: "Document status changed", document });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

//eliminar documento
const deleteDocument = async (req, res = response) => {
  try {
    const document = await deleteFile(req.params._id);
    res.status(200).json({ message: "Document deleted", document });
  } catch (error) {
    console.log(error);
    const { code, message } = validateError(error);
    res.status(code).json({ message });
  }
};

const uploadedDocumentRouter = Router();
uploadedDocumentRouter.get(
  "/all/",
  [auth, verifyRoles("docente")],
  getAllUploadedDocuments
);
uploadedDocumentRouter.get(
  "/active/",
  [auth, verifyRoles("docente")],
  getActiveUploadedDocuments
);
uploadedDocumentRouter.get(
  "/files/:_id",
  [auth, verifyRoles("docente", "estudiante")],
  getUploadedDocumentsByStudentId
);
uploadedDocumentRouter.get(
  "/:_id",
  [auth, verifyRoles("docente")],
  getUploadedDocumentById
);
uploadedDocumentRouter.post(
  "/:_id",
  [auth, verifyRoles("estudiante")],
  upload.single("file"),
  uploadDocument
);
uploadedDocumentRouter.put(
  "/us/:_id",
  [auth, verifyRoles("estudiante")],
  upload.single("file"),
  updateDocumentByStudent
);
uploadedDocumentRouter.put(
  "/ut/:_id",
  [auth, verifyRoles("docente")],
  updateDocumentByTeacher
);
uploadedDocumentRouter.get(
  "/download/:_id",
  [auth, verifyRoles("docente, estudiante")],
  downloadDocument
);
uploadedDocumentRouter.delete(
  "/:_id",
  [auth, verifyRoles("estudiante")],
  changeDocumentStatus
);
// uploadedDocumentRouter.delete('/:_id', [auth], deleteDocument);

module.exports = {
  uploadedDocumentRouter,
};
