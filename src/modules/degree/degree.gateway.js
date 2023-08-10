const degree = require("./degree");

const findAllDegrees = async () => {
    return await degree.find().exec();
};

//Traer todos los grados de doctorado
const findAllDoctorateDegrees = async () => {
    return await degree.find({ typeDegree: "doctorado" }).exec();
};

//Traer todos los grados de maestria
const findAllMasterDegrees = async () => {
    return await degree.find({ typeDegree: "maestria" }).exec();
};

//Traer todos los grados activode de doctorado
const findAllActiveDoctorateDegrees = async () => {
    return await degree.find({ $and: [{ typeDegree: "doctorado" }, { status: 1 },], }).exec();
};

//Traer todos los grados activos de maestria
const findAllActiveMasterDegrees = async () => {
    return await degree.find({ $and: [{ typeDegree: "maestria" }, { status: 1 },], }).exec();
};
//Obtener un grado por id
const findDegreeById = async (degreeId) => {
    return await degree.findById(degreeId).exec();
};

//Traer un grado de doctorado por id
const findDoctorateDegreeById = async (doctorateId) => {
    try {
        const doctorate = await degree.findOne({ _id: doctorateId, typeDegree: "doctorado" }).exec();
        return doctorate;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

//Treaer un grado de maestria por id
const findMasterDegreeById = async (masterId) => {
    try {
        const master = await degree.findOne({ _id: masterId, typeDegree: "maestria" }).exec();
        return master;  
    } catch (error) {
        console.error(error);
        throw error;
    }
};



const degreeActive = async (degreeData) => {
    const degree = await degree.find({
        $and: [
            { degree: degreeData.degree },
            { status: 1 },
        ],
    });
    return degree.length > 0 ? true : false;
}


const saveDegree = async (DegreeData) => {
    const degree = new degree({ ...degreeData, status: 1 });
    await degree.save();
    const degreeRegistered = {
        id: degree._id,
        status: Degree.status,
    };
    return degreeRegistered;
};

const updateDegreeById = async (
    degreeId,
    updateDegreeData
) => {
    return await degree.findByIdAndUpdate(
        degreeId,
        updateDegreeData,
        { new: true }
    ).exec();
};

const updateDegreeStatus = async (degreeId) => {
    const degree = await findDegreeById(degreeId);
    degree.status = degree.status === 1 ? 0 : 1;
    await degree.save();
    return degree;
};

const deleteDegreeById = async (degreeId) => {
    return await degree.findByIdAndDelete(degreeId).exec();
};

module.exports = {
    findAllDegrees,
    findAllDoctorateDegrees,
    findAllMasterDegrees,
    findAllActiveDoctorateDegrees,
    findAllActiveMasterDegrees,
    findDoctorateDegreeById,
    findMasterDegreeById,
    degreeActive,
    saveDegree,
    updateDegreeById,
    updateDegreeStatus,
    deleteDegreeById,
};

