const express = require("express");
const { errorMiddleware } = require("../../middlewares/error-middleware");
const {
    resSuccess,
} = require("../../utility/response-handlers/success/response-success");
const {
    HttpStatusCodes,
} = require("../../utility/response-handlers/code/response-code");
const cookieParser = require("cookie-parser");
const ROUTES = require("../../routes/routes");
const { logginRequired } = require("../../middlewares/auth-middleware");

const app = express();
const PORT = 8000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use("/", ROUTES);

app.get("/", logginRequired, (req, res) => {
    return resSuccess({
        res,
        title: "API Work",
        code: HttpStatusCodes.statusOK,
        data: "Server running successfully",
    });
});

app.use(errorMiddleware);

module.exports = { app };
