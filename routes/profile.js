const express=require('express')
const Profile=require('../models/Profile')
const authMiddleware=require('../middleware/authMiddleware')

const router=express.Router();

//gets the users current profile
router.get('/me',authMiddleware,async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['email']);
        if(!profile){
          return   res.status(404).json({message:'Profile not found '})
        }
        res.json(profile);
    }catch(err){
        res.status(500).json({message:'server error!'})
    }
});

//create proifle

router.post('/',authMiddleware,async(req,res)=>{
    const{bio,skills,github,linkedin,website,location}=req.body;
    
        const profileData={
            user:req.user.id,
            bio,
            skills:skills?.split(',').map(s=>s.trim()),
            github,
            linkedin,
            website,
            location
             }
  //for updating
        try{
        const profile=await Profile.findOne({user:req.user.id})
        if(profile){
            profile=await Profile.findOneAndUpdate(
                { user: req.user.id },
               { $set: profileData },
                 { new: true }
            )
            return res.json(profile)
        } 
        profile=new Profile(profileData);
        await profile.save();
        res.status(201).json(profile)
        }catch(err){
            res.status(500).json({message:'server error'});
        }
    
})

module.exports=router;