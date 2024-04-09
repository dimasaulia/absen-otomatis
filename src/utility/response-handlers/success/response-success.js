const { HttpStatusCodes } = require("../code/response-code");

/**
 * Responds with a success JSON response.
 *
 * @param {Object} options - Configuration options.
 * @param {Object} options.res - Express response object.
 * @param {string} [options.title="Successfully execute task"] - A title or message for the success response.
 * @param {any} [options.data] - Data to include in the response.
 * @param {number} [options.code=HttpStatusCodes.statusOK] - HTTP status code for the response.
 * @returns {Object} - The Express response object with a JSON success response.
 */
const resSuccess = ({
    res,
    title = "Successfully execute task",
    data = null,
    code = HttpStatusCodes.statusOK,
}) => {
    return res.status(code).json({
        success: true,
        message: title,
        data,
    });
};

module.exports = { resSuccess };
