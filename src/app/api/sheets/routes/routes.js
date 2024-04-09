const { logginRequired } = require("../../../../middlewares/auth-middleware");
const {
    rosterPageList,
    rosterPersonnelList,
    generateSchedulersPreview,
    setSchedulers,
} = require("../controller/controller");

const router = require("express").Router();

router.get("/page/list", logginRequired, rosterPageList);
router.get("/personnel/list/:tabName", logginRequired, rosterPersonnelList);
router.post("/scheduller/preview", logginRequired, generateSchedulersPreview);
router.post("/scheduller/set", logginRequired, setSchedulers);

module.exports = router;
