const {
    HttpStatusCodes,
} = require("../utility/response-handlers/code/response-code");
const {
    CustomError,
} = require("../utility/response-handlers/error/response-error");
const { ValidationError } = require("joi");

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next();
        return;
    }

    if (err instanceof CustomError) {
        return res
            .status(err.status)
            .json({
                success: err.success,
                message: err.message,
                data: null,
            })
            .end();
    } else if (err instanceof ValidationError) {
        return res
            .status(HttpStatusCodes.statusBadRequest)
            .json({
                success: false,
                message: err.message,
                data: null,
            })
            .end();
    } else {
        return res
            .status(HttpStatusCodes.statusInternalServerError)
            .json({
                success: false,
                message: err.message,
                data: null,
            })
            .end();
    }
};

module.exports = { errorMiddleware };
