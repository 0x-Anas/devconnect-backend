const User = require("../models/Users");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "user already exist!" });
    }

    //hash password
    const salt = await bcrypt.genSalt(10); //produce random 10 strings
    const hashedPassword = await bcrypt.hash(password, salt); //mixx it

    //create new user
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save(); //save it in mongo
    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (err) {
    res
      .status(500)
      .json({
        message: "Server error while registering 😓",
        error: err.message,
      });
  }
};

//login with 2 tokens(refresh and access)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "invalid credentials" });
    }
    //check users password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: "incorrect email or password" });
    }
    //access token
    const accessToken = JWT.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    //refresh token
    const refreshToken = JWT.sign(
      { id: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    //store refresh token securely in cookie!
    res
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        token: accessToken,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
        },
        message: "Login successful ✅",
      });
  } catch (err) {
    res.status(500).json({ message: "server error while logged in:", err });
  }
};

//refresh token end point
exports.refreshToken=async(req,res)=>{
  try{
    const token=req.cookies.refreshToken;//collect the token from cookies

    //check if token exist
    if (!token){
      return res.status(401).json({message:'no refresh token provided!'})
    }
    //step 2:verify refresh token
    JWT.verify(token,process.env.JWT_REFRESH_SECRET,async(err,decoded)=>{
             if(err){
              return res.status(403).json({ message: "Invalid or expired refresh token ⛔" });
             }

      //step 3:find user from decoded id
      const user=await User.findById(decoded.id);
      if(!user){
        return res.status(404).json({ message: "User not found ❌" });
      }

      //step 4:Generate new access token
      const newAccessToken=JWT.sign(
       {
        id: user._id,
        username: user.username,
       },
       process.env.JWT_SECRET,
       { expiresIn: "1h" }
      );
      res.status(200).json({token:newAccessToken,
         message: "Access token refreshed ✅"
      });
    });

    }catch (err) {
      res.status(500).json({
        message: "Error while refreshing access token 😓",
        error: err.message,
      });
    }
  };
