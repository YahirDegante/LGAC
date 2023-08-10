const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose').Types;

const assignredThesisSchema = new Schema(
  {
    _id: {
      type: String,
      default: new ObjectId().toString(),
    },
    student: {
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
    title: {
      type: String,
      required: true,
      trim: true,
    },
    problem_definition: {
      type: String,
      required: true,
      trim: true,
    },
    general_objective: {
      type: String,
      required: true,
      trim: true,
    },
    specific_objectives: {
      type: String,
      required: true,
      trim: true,
    },
    solution: {
      type: String,
      required: true,
      trim: true,
    },
    scopes: {
      type: String,
      required: true,
      trim: true,
    },
    results: {
      type: String,
      required: true,
      trim: true,
    },
    references: {
      type: String,
      required: true,
      trim: true,
    },
    registration_date: {
      type: Date,
      default: new Date(),
    },
    status: {
      type: Number,
      default: 1,
    },
  },
  {
    versionKey: false,
  }
);

module.exports = mongoose.model('assignredThesis', assignredThesisSchema);
