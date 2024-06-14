const employerUser = require("../modal/employer.js");
const regEmployerUser = require("../modal/regemployer.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

exports.employersignUp = async (req, res) => {
  try {
    const emailCheck = await employerUser.find({
      workEmail: req.body.workEmail,
    });
    if (emailCheck.length > 0) {
      return res
        .status(400)
        .json({ success: false, message: "Email already exist" });
    }
    req.body.password = await bcrypt.hashSync(req.body.password);
    const user = await employerUser.create(req.body);
    return res.status(200).json({
      success: true,
      data: user,
      message: "Employer Register Successfully",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.employersignIn = async (req, res) => {
  try {
    const { password } = req.body;
    const emailCheck = await employerUser.findOne({
      workEmail: req.body.workEmail,
    });

    if (!emailCheck) {
      return res.status(400).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!bcrypt.compareSync(password, emailCheck.password)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: emailCheck._id,
      },
      process.env.JWTSECRET,
      {
        expiresIn: 86400,
      }
    );

    let result = {
      token: token,
      firstName:emailCheck.firstName,
      lastName:emailCheck.lastName,
      companyName:emailCheck.companyName,
      workEmail: emailCheck.workEmail,
    };

    return res.status(200).json({
      success: true,
      data: result,
      message: "Login successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.employerregister = async (req, res) => {
  try {
    const introVideolink = req.files["introVideolink"];
    const workVideolink = req.files["workVideolink"];
    if (req.files["introVideolink"]) {
      req.body.introVideolink = introVideolink[0].filename;
    }

    if (req.files["workVideolink"]) {
      req.body.workVideolink = workVideolink[0].filename;
    }

    if (req.body.jobId) {
      await regEmployerUser.updateOne(
        { _id: req.body.jobId },
        { $set: req.body }
      );

      return res.status(200).json({
        success: true,
        data: {},
        message: "",
      });
    }

    const user = await regEmployerUser.create(req.body);

    return res.status(200).json({
      success: true,
      data: user,
      message: "",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.employerJobPost = async (req, res) => {
  try {
    const jobPost = await regEmployerUser.findOne({
      userId: req.body.userId,
      _id: req.body.jobId,
    });
    return res.status(200).json({
      success: true,
      data: jobPost,
      message: "",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.employerDashboard = async (req,res)=>{
  try {
    const userData = await regEmployerUser.find({userId:req.user.id})
    return res.status(200).json({
      success: true,
      data: userData,
    message: "",
  });
} catch (error) {
  return res.status(400).json({ success: false, message: error.message });
  
}
}

// const jobPost = await regEmployerUser.aggregate([
//   {
//     $lookup: {
//       from: "employer",
//       localField: "userId",
//       foreignField: "_id",
//       as: "employerObj",
//     },
//   },
//   {
//     $match: {
//       userId: mongoose.Types.ObjectId(req.body.userId),
//     },
//   },
// ])