const User=require('../models/Users')
const bcrypt=require('bcryptjs')
const JWT=require('jsonwebtoken');

exports.register=async(req,res)=>{
    try{
    const{username,email,password}=req.body;
    const existingUser=await User.findOne({email});

    if(existingUser){
        return res.status(400).json({message:'user already exist!'})
    }


    //hash password
    const salt=await bcrypt.genSalt(10); //produce random 10 strings 
    const hashedPassword=await bcrypt.hash(password,salt); //mixx it 

    //create new user
    const newUser= new User({username,email,password:hashedPassword});
    await newUser.save();//save it in mongo
    res.status(201).json({ message: "User registered successfully ✅" });
}
    catch(err){
    res.status(500).json({ message: "Server error while registering 😓",error:err.message });
}};

//login
exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //compare password
        const isMatch=await bcrypt.compare(password,user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

        //create token
        const token=JWT.sign({
            id:user._id,
            username:user.username
        },process.env.JWT_SECRET,{
            expiresIn:"1h"
        });
        res.status(200).json({token,message:'Login successful ✅'});
    }catch(err){
        res.status(500).json({message:"Server error while logging in 😓",error:err});
    }
}