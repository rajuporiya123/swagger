const express = require("express");

const {
  employersignUp,
  employersignIn,
  employerregister,
  employerJobPost,
  employerDashboard,
} = require("../controller/employercontroller");

const token = require("../midleware/tokencheck");

const multer = require("multer");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/video");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

var upload = multer({ storage: storage });

router.post("/employersignup", employersignUp);
router.post("/employersignin", employersignIn);

router.post(
  "/employerregister",
  upload.fields([
    { name: "introVideolink", maxCount: 1 },
    { name: "workVideolink", maxCount: 1 },
  ]),
  employerregister
);
router.post("/employerjobpost", employerJobPost);
router.get("/employerdashboard", token(), employerDashboard);

module.exports = router;
