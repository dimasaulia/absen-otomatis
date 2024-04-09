const router = require("express").Router();
const {
    logoutRequired,
    logginRequired,
} = require("../../../../middlewares/auth-middleware");
const {
    userFormValidation,
    loginFormValidation,
} = require("../../../../utility/validation/user-validation");
const {
    validationMiddleware,
} = require("../../../../utility/validation/validation");
const { signup, signin, signout } = require("../controller/controller");

router.post(
    "/signup",
    logoutRequired,
    validationMiddleware(userFormValidation),
    signup
);
router.post(
    "/signin",
    logoutRequired,
    validationMiddleware(loginFormValidation),
    signin
);
router.get("/signout", logginRequired, signout);

module.exports = router;
