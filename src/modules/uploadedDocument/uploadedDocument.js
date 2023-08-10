const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose').Types;

const uploadedDocumentSchema = new Schema(
{
    _id: {
      type: String,
      default: new ObjectId().toString(),
    },
    user: {
      _id: {
        type: String,
        required: true,
        trim: true,
      },
      name: {
        type: String,
        required: true,
        trim: true,
      },
    },
    file: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      trim: true,
    },
    observation: {
      type: String,
      required: true,
      trim: true,
    },
    file_status: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('uploadedDocument', uploadedDocumentSchema);
