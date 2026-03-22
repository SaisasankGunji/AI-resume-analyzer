const express = require("express");
const router = express.Router();
const resumeCtrl = require("../controllers/resume");
const { upload } = require("../utils/multer");

router.post("/add-resume", upload.single("resume"), resumeCtrl.addResume);
router.get("/get-resumes/:user", resumeCtrl.getAllResumesForUser);
router.get("/get-resumes", resumeCtrl.getResumesForAdmin);

module.exports = router;
