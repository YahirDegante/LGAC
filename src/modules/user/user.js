const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = require('mongoose').Types;

const userSchema = new Schema(
  {
    _id: {
      type: String,
      default: new ObjectId().toString(),
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    names: {
      type: String,
      required: true,
      trim: true,
    },
    maternal_surname: {
      type: String,
      trim: true,
    },
    paternal_surname: {
      type: String,
      trim: true,
    },
    research_line: {
      type: String,
      required: true,
      trim: true,
    },
    num_cvu: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    personal_phone_number: {
      type: Number,
      trim: true,
    },
    office_phone_number: {
      type: Number,
      trim: true,
    },
    phone_extension: {
      type: Number,
      trim: true,
    },
    personal_email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    institutional_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    degree:{
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profile_img: {
      type: String,
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

module.exports = mongoose.model('User', userSchema);
