const {
    HttpStatusCodes,
} = require("../utility/response-handlers/code/response-code");
const {
    CustomError,
} = require("../utility/response-handlers/error/response-error");
const { verifyAccessToken } = require("../utility/auth/auth");

function logginRequired(req, res, next) {
    const authorization =
        req.headers["authorization"] || req.cookies.Authorization;

    if (authorization === undefined || authorization === "")
        throw new CustomError(
            HttpStatusCodes.statusForbidden,
            "Please login to access this menu"
        );

    const token = String(authorization).split(" ")[1]; // structure ==> Bearer TOKEN
    if (token === undefined || token === "")
        throw new CustomError(
            HttpStatusCodes.statusForbidden,
            "Please login to access this menu"
        );

    const payload = verifyAccessToken(token);
    req.userId = payload.userID;
    req.username = payload.username;
    next();
}

function logoutRequired(req, res, next) {
    const authorization =
        req.headers["authorization"] || req.cookies.Authorization;
    if (String(authorization).length > 0 && authorization != undefined)
        throw new CustomError(
            HttpStatusCodes.statusForbidden,
            "Please logout first to access this menu, or remove any data from Auhtorization Header"
        );
    next();
}

module.exports = { logginRequired, logoutRequired };
