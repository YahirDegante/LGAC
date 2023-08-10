const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const degreeSchema = new Schema(
    {
        init_year: {
            type: Number,
            required: true,
            trim: true,
        },
        init_period: {
            type: String,
            required: true,
            trim: true,
        },
        current_period: {
            type: String,
            required: true,
            trim: true,
        },
        student: {
            id: {
                type: String,
                trim: true,
            },
            //Estos datos se deben de guardar automaticamente
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        director: {
            id: {
                type: String,
                required: true,
                trim: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        codirector: {
            id: {
                type: String,
                required: true,
                trim: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        externalAdvisor: {
            id: {
                type: String,
                //required:true,
                trim: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        reviewer1: {
            id: {
                type: String,
                trim: true,
                required: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        reviewer2: {
            id: {
                type: String,
                trim: true,
                required: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        reviewer3: {
            id: {
                type: String,
                trim: true,
            },
            name: {
                type: String,
                trim: true,
            },
            email: {
                type: String,
                lowercase: true,
                trim: true,
            },
        },
        topic: {
            type: String,
            required: true,
            trim: true,
        },
        typeDegree: {
            type: String,
            required: true,
            trim: true,
        },
        status:{
            type: Number,
            trim: true,
        },
    },
    {
        versionKey: false,
    }
);

module.exports = mongoose.model("degree", degreeSchema);
