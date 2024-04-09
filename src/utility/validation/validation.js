const validate = (schemaToValidate, req) => {
    const result = schemaToValidate.validate(req);
    if (result.error) {
        throw result.error;
    } else {
        return result.value;
    }
};

const validationMiddleware = (schemaToValidate) => {
    return async (req, res, next) => {
        try {
            const data = validate(schemaToValidate, req.body);
            if (data != null || data != undefined) {
                next();
            }
        } catch (error) {
            next(error);
        }
    };
};

module.exports = { validate, validationMiddleware };
