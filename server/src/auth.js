const jwt = require("jsonwebtoken");

const COOKIE_NAME = "app_token";

function signJwt(payload) {
  const secret = process.env.JWT_SECRET;
  const expiresIn = process.env.JWT_EXPIRES || "7d";
  return jwt.sign(payload, secret, { expiresIn });
}

function verifyJwt(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function setAuthCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

function clearAuthCookie(res) {
  res.clearCookie(COOKIE_NAME, { path: "/" });
}

function getTokenFromReq(req) {
  const bearer =
    req.headers.authorization && req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.slice(7)
      : undefined;
  const cookie = req.cookies && req.cookies[COOKIE_NAME];
  return bearer || cookie;
}

module.exports = {
  signJwt,
  verifyJwt,
  setAuthCookie,
  clearAuthCookie,
  getTokenFromReq,
};
