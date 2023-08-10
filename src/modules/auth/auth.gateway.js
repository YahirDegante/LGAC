const { generateToken } = require("../../middleware/jwt");
const { comparePassword } = require("../../utils/bcryptPassword");
const {
  findUserByInstitutionalEmail,
  getUserPasswordById,
  findUserById,
} = require("../user/user.gateway");
const { hashPassword } = require("../../utils/bcryptPassword");
const User = require("../user/user");

const userLogin = async ({ email, password }) => {
  if (!(email || password)) throw new Error("Missing fields");
  const user = await findUserByInstitutionalEmail(email);
  if (!(await comparePassword(password, user.password)))
    throw new Error("Incorrect password");

  const { _id, role, research_line, institutional_email } = user;
  const name = `${user.names} ${user.maternal_surname} ${user.paternal_surname}`;
  const token = generateToken({
    _id,
    role,
    name,
    research_line,
    institutional_email,
  });

  return { token, _id, role, name, research_line, institutional_email };
};

const userChangePassword = async (
  userId,
  { oldPassword, newPassword, confirmPassword }
) => {
  const user = await getUserPasswordById(userId);

  if (!(oldPassword || newPassword || confirmPassword))
    throw new Error("Missing fields");
  if (!(await comparePassword(oldPassword, user.password)))
    throw new Error("Incorrect password");
  if (newPassword !== confirmPassword) throw new Error("Passwords dont match");

  const hashedPassword = await hashPassword(newPassword);
  await User.findByIdAndUpdate(userId, { password: hashedPassword });
  return await findUserById(userId);
};

module.exports = {
  userLogin,
  userChangePassword,
};
