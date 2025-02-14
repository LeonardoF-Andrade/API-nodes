const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

function ensureAuthenticated(request, response, next) {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError("Token não informado", 401);
  }
  const [, token] = authHeader.split(" ");

  try {
    const { sub: user_id } = verify(token, authConfig.jwt.secret); // "sub" is a prop that return from verify, and user_id is the variable where is stores the sub
    request.user = {
      id: Number(user_id),
    };
    return next();
  } catch {
    throw new AppError("Token inválido", 401);
  }
}

module.exports = ensureAuthenticated;
