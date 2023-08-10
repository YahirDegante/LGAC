const User = require('./user.js');

const {
  findResearchLineById,
} = require("../researchLines/researchLines.gateway.js");
const { transporter } = require("../../utils/nodemailer.js");
const { hashPassword } = require("../../utils/bcryptPassword.js");

//Buscar todos los usuarios
const findUsers = async () => {
  const users = await User.find().select("-password").exec();
  if (users.length === 0) throw new Error("Users not found");
  return users;
};

//Buscar usuario por rol y linea de investigacion
const findUsersByRoleAndResearchLine = async (role, researchLineId) => {
  if (role != "coordinador" && role != "estudiante" && role != "docente")
    throw new Error("Role not valid");
  const researchLine = await findResearchLineById(researchLineId);
  if (!researchLine) throw new Error("Research line not found"); //temporal
  const users = await User.find({ role, research_line: researchLine.name })
    .select("-password")
    .exec();
  if (users.length === 0) throw new Error("Users not found");
  return users;
};

//Buscar usuario por id
const findUserById = async (userId, update = false) => {
  const user = await User.findById(userId).select("-password").exec();
  if (!user) throw new Error("Users not found");
  if (update) return user;
  if (user.status === 0) throw new Error("User not active");
  return user;
};

//Buscar usuario por correo institucional (para login)
const findUserByInstitutionalEmail = async (institutionalEmail) => {
  const user = await User.findOne({ institutional_email: institutionalEmail });
  if (!user) throw new Error("Email not found");
  return user;
};

//Obtener contraseña de usuario por id
const getUserPasswordById = async (userId) => {
  return await User.findById(userId).select("password").exec();
};

//Guardar usuario
const saveUser = async (userData) => {
  const user = {
    _id: userData._id,
    role: userData.role,
    names: userData.names,
    paternal_surname: userData.paternal_surname,
    research_line: userData.research_line,
    num_cvu: userData.num_cvu,
    institutional_email: userData.institutional_email,
  };
  if (userData.maternal_surname)
    user.maternal_surname = userData.maternal_surname;

  if (Object.values(user).some((field) => !field))
    throw new Error("Missing fields");

  await registeredUser(user);
  await new User({ ...user, password: await hashPassword(user._id) }).save();
  return await findUserById(userData._id);
};

//Actualizar usuario por id
const updateUserById = async (userId, data) => {
  const user = await findUserById(userId);
  const filterUndefinedProperties = (obj) => {
    const filteredObj = {};
    for (let key in obj) {
      if (obj[key] !== undefined) {
        filteredObj[key] = obj[key];
      }
    }
    return filteredObj;
  };

  const userUpdated = filterUndefinedProperties({
    names: data.names || user.names,
    maternal_surname: data.maternal_surname || user.maternal_surname,
    paternal_surname: data.paternal_surname || user.paternal_surname,
    research_line: data.research_line || user.research_line,
    personal_phone_number:
      data.personal_phone_number || user.personal_phone_number,
    office_phone_number:
      user.role === "docente" || user.role === "coordinador"
        ? data.office_phone_number || user.office_phone_number
        : undefined,
    phone_extension:
      user.role === "docente" || user.role === "coordinador"
        ? data.phone_extension || user.phone_extension
        : undefined,
    personal_email: data.personal_email || user.personal_email,
    profile_img: data.profile_img || user.profile_img,
  });
  
  if (
    user.role === "estudiante" &&
    (data.office_phone_number || data.phone_extension)
  )
    throw new Error("Invalid role");

    if (data._id) userUpdated._id = data._id;
    if (data.num_cvu) userUpdated.num_cvu = data.num_cvu;
    if (data.institutional_email) userUpdated.institutional_email = data.institutional_email;

  await registeredUser({ ...userUpdated });
  await User.findByIdAndUpdate(userId, userUpdated).exec();
  return await findUserById(userId);
};

//Enviar correo al usuario
const sendEmailToUser = async (userId, emailData) => {
  const user = await findUserById(userId);

  const email = {
    subject: emailData.subject,
    text: emailData.text,
  };

  if (Object.values(email).some((field) => !field))
    throw new Error('Missing fields');

  return await transporter.sendMail({
    from: `LGACs CENIDET <${process.env.EMAIL_USER}>`,
    to: user.institutional_email,
    subject: email.subject,
    text: email.text,
  });
};

//Actualizar estatus de usuario
const updateUserStatus = async (userId) => {
  const user = await findUserById(userId, true);
  user.status = user.status === 1 ? 0 : 1;
  await user.save();
  return {
    role: user.role,
    name: `${user.names} ${user.paternal_surname} ${user.maternal_surname}`,
    status: user.status,
  };
};

//Actualizar grado del usuario
const updateUserDegree = async (userId, degree) => {
  try {
    const user = await findUserById(userId, true);
    user.degree = degree;
    await user.save();

    // Actualizar el grado en la tabla de usuarios
    await User.updateOne({ _id: userId }, { degree });

    return {
      name: `${user.names} ${user.paternal_surname} ${user.maternal_surname}`,
      degree: user.degree,
    };
  } catch (error) {
    // Manejar el error
    console.log(error);
    throw new Error('Error al actualizar el grado del usuario');
  }
};

////Eliminar usuario por id
const deleteUserById = async (userId) => {
  return await User.findByIdAndDelete(userId).select("-password").exec();
};

//Validar que no este registrado el id, correo institucional o num_cvu
const registeredUser = async ({ _id, num_cvu, institutional_email }) => {
  const user = await User.findOne({
    $or: [{ _id }, { num_cvu }, { institutional_email }],
  }).exec();

  if (!user) return false;
  if (user._id === _id) throw new Error("num_control error");
  if (user.num_cvu === num_cvu) throw new Error("cvu error");
  if (user.institutional_email === institutional_email)
    throw new Error("email error");

  return false;
};

module.exports = {
  findUsers,
  findUsersByRoleAndResearchLine,
  findUserById,
  findUserByInstitutionalEmail,
  getUserPasswordById,
  saveUser,
  updateUserById,
  sendEmailToUser,
  updateUserStatus,
  deleteUserById,
  updateUserDegree,
};
