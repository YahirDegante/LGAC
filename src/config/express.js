const express = require('express');
const cors = require('cors');
const {
  authRouter,
  userRouter,
  externalAdvisorRouter,
  researchLinesRouter,
  uploadedDocumentRouter,
  assignredThesisRouter,
  degreeRouter
} = require('../modules/routes.js');

require('dotenv').config();
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(cors((origins = '*')));

app.use(express.json((limit = '50mb')));

app.get('/', (req, res) => {
  res.send('Cenidet Backend');
});

// Rutas
app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);
app.use('/api/externalAdvisors', externalAdvisorRouter);
app.use('/api/researchLines', researchLinesRouter);
app.use('/api/uploadedDocuments', uploadedDocumentRouter);
app.use('/api/assignredThesis', assignredThesisRouter);
app.use('/api/degrees', degreeRouter);

module.exports = { app };
