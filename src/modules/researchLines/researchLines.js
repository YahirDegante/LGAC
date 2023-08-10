const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const researchLineSchema = new Schema({
    _id: {
        type: String,
        required: true,
        trim: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    status: {
        type: Number,
    },
},
    {
        versionKey: false,
    }
);

module.exports = mongoose.model('ResearchLine', researchLineSchema);
