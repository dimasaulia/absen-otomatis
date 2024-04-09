const router = require("express").Router();

const USER_V1 = require("../app/api/user/routes/routes");
const SHEETS_V1 = require("../app/api/sheets/routes/routes");
const EOFFICE_V1 = require("../app/api/eoffice/routes/routes");

router.use("/api/user/v1/", USER_V1);
router.use("/api/sheet/v1/", SHEETS_V1);
router.use("/api/eoffice/v1/", EOFFICE_V1);

module.exports = router;
