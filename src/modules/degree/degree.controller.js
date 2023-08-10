const { Router, Response } = require('express');
const User = require('../user/user.gateway');
const { auth, verifyRoles } = require("../../middleware/jwt.js");
const {
    updateUserDegree
} = require('../user/user.gateway');
const Degree = require('./degree');

const {
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
} = require('./degree.gateway');

// Obtener todos los registros de grados
const getDegrees = async (req, res = Response) => {
    try {
        const degrees = await findAllDegrees();
        if (degrees.length === 0) {
            res.status(200).json({ message: "No se encontraron registros de grados" });
        } else {
            res.status(200).json(degrees);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

// Obtener todos los registros de grados de doctorado
const getDoctorateDegrees = async (req, res = Response) => {
    try {
        const doctorateDegrees = await findAllDoctorateDegrees();
        if (doctorateDegrees.length === 0) {
            res.status(200).json({ message: "No se encontraron registros de alumnos que esten en doctorado" });
        } else {
            res.status(200).json(doctorateDegrees);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

//Obtener todos los registros de grados de maestria
const getMasterDegrees = async (req, res = Response) => {
    try {
        const masterDegrees = await findAllMasterDegrees();
        if (masterDegrees.length === 0) {
            res.status(200).json({ message: "No se encontraron registros de alumnos que esten en maestria" });
        } else {
            res.status(200).json(masterDegrees);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

// Obtener todos los registros de grados de doctorado activos
const getActiveDoctorateDegrees = async (req, res = Response) => {
    try {
        const doctorateDegrees = await findAllActiveDoctorateDegrees();
        if (doctorateDegrees.length === 0) {
            res.status(200).json({ message: "No se encontraron registros de alumnos en doctorado activos" });
        } else {
            res.status(200).json(doctorateDegrees);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

// Obtener todos los registros de grados de maestria activos
const getActiveMasterDegrees = async (req, res = Response) => {
    try {
        const masterDegrees = await findAllActiveMasterDegrees();
        if (masterDegrees.length === 0) {
            res.status(200).json({ message: "No se encontraron registros de alumnos en maestria activos" });
        } else {
            res.status(200).json(masterDegrees);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

//Obtener un grado de doctorado por id
const getDoctorateDegreeById = async (req, res = Response) => {
    try {
        const { id } = req.params;
        const doctorateDegree = await findDoctorateDegreeById(id);
        if (!doctorateDegree) {
            res.status(200).json({ message: "No se encontro el registro de doctorado" });
        } else {
            res.status(200).json(doctorateDegree);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

//Obtener un grado de maestria por id
const getMasterDegreeById = async (req, res = Response) => {
    try {
        const { id } = req.params;
        const masterDegree = await findMasterDegreeById(id);
        if (!masterDegree) {
            res.status(200).json({ message: "No se encontro el registro de maestria" });
        } else {
            res.status(200).json(masterDegree);
        }
    } catch (error) {
        console.log(error);
        const message = validateError(error);
        res.status(400).json({ message });
    }
}

//Creaer un grado
const createDegree = async (req, res = Response) => {
    try {
        const requiredFields = ['typeDegree', 'student', 'init_year', 'init_period', 'current_period', 'director', 'codirector', 'reviewer1', 'reviewer2', 'topic'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Falta el campo requerido: ${field}` });
            }
        }

        const {
            student: { id: studentId },
            init_year,
            init_period,
            current_period,
            director: { id: directorId },
            codirector: { id: codirectorId },
            externalAdvisor: { id: externalAdvisorId },
            reviewer1: { id: reviewer1Id },
            reviewer2: { id: reviewer2Id },
            reviewer3: { id: reviewer3Id },
            topic,
            typeDegree
        } = req.body;

        // Obtener los datos del estudiante
        const student = await User.findUserById(studentId);
        if (!student && student.role !== 'estudiante') {
            return res.status(404).json({ message: 'Estudiante no encontrado' });
        }

        //Verificamos si el estudiante ua fue registrado en doctorado
        const existingStudent = await Degree.findOne({
            "student.id": studentId
        });
        if (existingStudent) {
            return res.status(400).json({ message: 'El estudiante ya está  registrado' });
        }

        // Obtener los datos del director
        const director = await User.findUserById(directorId);
        if (!director && director.role !== 'docente') {
            return res.status(404).json({ message: 'Director no encontrado' });
        }

        // Obtener los datos del co-director
        const codirector = await User.findUserById(codirectorId);
        if (!codirector && codirector.role !== 'docente') {
            return res.status(404).json({ message: 'Co-Director no encontrado' });
        }

        // Obtener los datos del asesor externo
        const externalAdvisor = await User.findUserById(externalAdvisorId);
        if (!externalAdvisor && externalAdvisor.role !== 'docente') {
            return res.status(404).json({ message: 'Asesor externo no encontrado' });
        }

        // Obtener los datos del revisor 1
        const reviewer1 = await User.findUserById(reviewer1Id);
        if (!reviewer1 && reviewer1.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 1 no encontrado' });
        }

        // Obtener los datos del revisor 2
        const reviewer2 = await User.findUserById(reviewer2Id);
        if (!reviewer2 && reviewer2.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 2 no encontrado' });
        }

        // Obtener los datos del revisor 3
        const reviewer3 = await User.findUserById(reviewer3Id);
        if (!reviewer3 && reviewer3.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 3 no encontrado' });
        }

        // Crear el nuevo doctorado con los datos completados
        const createDegree = new Degree({
            status: 1,
            student: {
                id: student._id,
                name: student.names,
                email: student.institutional_email,
            },
            init_year,
            init_period,
            current_period,
            director: {
                id: director._id,
                name: director.names,
                email: director.institutional_email,
            },
            codirector: {
                id: codirector._id,
                name: codirector.names,
                email: codirector.institutional_email,
            },
            externalAdvisor: {
                id: externalAdvisor._id,
                name: externalAdvisor.names,
                email: externalAdvisor.institutional_email,
            },
            reviewer1: {
                id: reviewer1._id,
                name: reviewer1.names,
                email: reviewer1.institutional_email,
            },
            reviewer2: {
                id: reviewer2._id,
                name: reviewer2.names,
                email: reviewer2.institutional_email,
            },
            reviewer3: {
                id: reviewer3._id,
                name: reviewer3.names,
                email: reviewer3.institutional_email,
            },
            topic,
            typeDegree,
        });
        const savedDegree = await createDegree.save();
        res.status(200).json(savedDegree);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al crear el grado' });
    }
};

//Actualizar un grado
const updateDegree = async (req, res = Response) => {
    try {
        const degreeId = req.params.degreeId;

        const requiredFields = ['typeDegree', 'init_year', 'init_period', 'current_period', 'director', 'codirector', 'reviewer1', 'reviewer2', 'topic'];

        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ message: `Falta el campo requerido: ${field}` });
            }
        }

        const {
            init_year,
            init_period,
            current_period,
            director: { id: directorId },
            codirector: { id: codirectorId },
            externalAdvisor: { id: externalAdvisorId },
            reviewer1: { id: reviewer1Id },
            reviewer2: { id: reviewer2Id },
            reviewer3: { id: reviewer3Id },
            topic,
            typeDegree
        } = req.body;

        // Obtener los datos del grado existente
        const degree = await Degree.findById(degreeId).exec();
        if (!degree) {
            return res.status(404).json({ message: 'Grado no encontrado' });
        }

        // Obtener los datos del director
        const director = await User.findUserById(directorId);
        if (!director && director.role !== 'docente') {
            return res.status(404).json({ message: 'Director no encontrado' });
        }

        // Obtener los datos del co-director
        const codirector = await User.findUserById(codirectorId);
        if (!codirector && codirector.role !== 'docente') {
            return res.status(404).json({ message: 'Co-Director no encontrado' });
        }

        // Obtener los datos del asesor externo
        const externalAdvisor = await User.findUserById(externalAdvisorId);
        if (!externalAdvisor && externalAdvisor.role !== 'docente') {
            return res.status(404).json({ message: 'Asesor externo no encontrado' });
        }

        // Obtener los datos del revisor 1
        const reviewer1 = await User.findUserById(reviewer1Id);
        if (!reviewer1 && reviewer1.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 1 no encontrado' });
        }

        // Obtener los datos del revisor 2
        const reviewer2 = await User.findUserById(reviewer2Id);
        if (!reviewer2 && reviewer2.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 2 no encontrado' });
        }

        // Obtener los datos del revisor 3
        const reviewer3 = await User.findUserById(reviewer3Id);
        if (!reviewer3 && reviewer3.role !== 'docente') {
            return res.status(404).json({ message: 'Revisor 3 no encontrado' });
        }

        // Actualizar los campos del grado
        degree.init_year = init_year;
        degree.init_period = init_period;
        degree.current_period = current_period;
        degree.director = {
            id: director._id,
            name: director.names,
            email: director.institutional_email,
        };
        degree.codirector = {
            id: codirector._id,
            name: codirector.names,
            email: codirector.institutional_email,
        };
        degree.externalAdvisor = {
            id: externalAdvisor._id,
            name: externalAdvisor.names,
            email: externalAdvisor.institutional_email,
        };
        degree.reviewer1 = {
            id: reviewer1._id,
            name: reviewer1.names,
            email: reviewer1.institutional_email,
        };
        degree.reviewer2 = {
            id: reviewer2._id,
            name: reviewer2.names,
            email: reviewer2.institutional_email,
        };
        degree.reviewer3 = {
            id: reviewer3._id,
            name: reviewer3.names,
            email: reviewer3.institutional_email,
        };
        degree.topic = topic;
        degree.typeDegree = typeDegree;

        const updatedDegree = await degree.save();
        res.status(200).json(updatedDegree);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el grado' });
    }
};


//Actualizamos el status de un grado
const changeStatusDegree = async (req, res = Response) => {
    try {
        const degreeId = req.params.id;
        const degree = await updateDegreeStatus(degreeId);
        res.status(200).json(degree);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al actualizar el estado del grado' });
    }
};

//Eliminar un grado
const deleteDegree = async (req, res = Response) => {
    try {
        const degreeId = req.params.id;
        const degree = await deleteDegreeById(degreeId);
        res.status(200).json(degree);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error al eliminar el grado' });
    }
};

const degreeRouter = Router();
degreeRouter.get('/all/',[auth, verifyRoles(['coordinador', 'docente'])], getDegrees);
degreeRouter.post('/',[auth, verifyRoles(['coordinador', 'docente'])], createDegree);
degreeRouter.put('/:degreeId',[auth, verifyRoles(['coordinador', 'docente'])], updateDegree);
degreeRouter.put('/status/:id',[auth, verifyRoles(['coordinador', 'docente'])], changeStatusDegree);
degreeRouter.delete('/:id',[auth, verifyRoles(['coordinador', 'docente'])], deleteDegree);
degreeRouter.get('/doctorate/all',[auth, verifyRoles(['coordinador', 'docente'])], getDoctorateDegrees);
degreeRouter.get('/master/all',[auth, verifyRoles(['coordinador', 'docente'])], getMasterDegrees);
degreeRouter.get('/doctorate/active',[auth, verifyRoles(['coordinador', 'docente'])], getActiveDoctorateDegrees);
degreeRouter.get('/master/active',[auth, verifyRoles(['coordinador', 'docente'])], getActiveMasterDegrees);
degreeRouter.get('doctorate/:id',[auth, verifyRoles(['coordinador', 'docente'])], getDoctorateDegreeById);
degreeRouter.get('master/:id',[auth, verifyRoles(['coordinador', 'docente'])], getMasterDegreeById);

module.exports = {
    degreeRouter,
}
