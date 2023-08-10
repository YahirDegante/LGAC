const { authRouter } = require('./auth/auth.controller.js');
const { userRouter } = require('./user/user.controller.js');
const { externalAdvisorRouter } = require('./externalAdvisor/externalAdvisor.controller.js');
const { researchLinesRouter } = require('./researchLines/researchLines.controller.js');
const { uploadedDocumentRouter } = require('./uploadedDocument/uploadedDocument.controller.js');
const { assignredThesisRouter } = require('./assignredThesis/assignredThesis.controller.js');
const {degreeRouter} = require('./degree/degree.controller.js')

module.exports = {
  authRouter,
  userRouter,
  externalAdvisorRouter,
  researchLinesRouter,
  uploadedDocumentRouter,
  assignredThesisRouter,
  degreeRouter
};