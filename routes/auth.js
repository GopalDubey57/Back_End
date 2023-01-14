const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");

const JWT_SECRET = "gop@ldubey";
router.post(
  "/createuser",
  [
    body("name", "use atleast 3 characters").isLength({ min: 3 }),
    body("email", "not valid mail").isEmail(),
    body("password", "atleast 5 characters long").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      
      if (user) {
        return res.status(400).json({  success, error: "Sorry with this email exist" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);

      // .then(user => res.json(user))
    
      // res.json({error: "please enter valid email",discription: err.message})})
      // ;
      success = true;
      res.json({ success, authtoken });
    } catch (error) {
      
      res.status(500).send("some error occured");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "not valid mail").isEmail(),
    body("password", "Can't be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success=false;
        return res.status(400).json({ success, error: "Please try to login" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res.status(400).json({ success, error: "Please try to login" });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authtoken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({ success,authtoken });
    } catch (error) {
      
      res.status(500).send("Internal server error");
    }
  }
);

router.post("/getuser", fetchuser, async (req, res) => {
  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
