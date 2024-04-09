class CustomError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.success = false;
    }
}

module.exports = { CustomError };
