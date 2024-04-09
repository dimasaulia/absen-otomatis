const { logginRequired } = require("../../../../middlewares/auth-middleware");
const { integrateToEoffice } = require("../controller/controller");

const router = require("express").Router();

router.post("/integration", logginRequired, integrateToEoffice);

module.exports = router;
