const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const externalAdvisorSchema = new Schema({
  _id: {
    type: String,
    required: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
},
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('ExternalAdvisor', externalAdvisorSchema);