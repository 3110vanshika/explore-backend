const jwt = require('jsonwebtoken');
const getObjFromToken = async (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
  } catch (error) {
    return "error";
  }
}
module.exports = getObjFromToken