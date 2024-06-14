const express = require("express");

const {
  employeesignUp,
  employeesignIn,
} = require("../controller/employeecontroller");

const router = express.Router();

router.post("/employeesignup", employeesignUp);
router.post("/employeesignin", employeesignIn);

module.exports = router