const Profile=require('../models/Profile')

//to fetch users profile
const getMyProfile=async(req,res)=>{
    try{
        const profile=await Profile.findOne({user:req.userId}).populate('user', 'username profilePic');
        if(!profile){
            res.status(404).json({message:'profile not found'})
        }
        res.status(200).json(profile)
    }
    catch(error){
        console.error('error',error)
        res.status(500).json({message:'server error while fetching profile'})
    }
}

//create and updating profile
const createOrUpdateProfile=async(req,res)=>{
    const { bio, skills, github, linkedin, website, location } = req.body;

    const profileData={
        user: req.userId,
        bio,
        skills: skills?.split(',').map(s => s.trim()),
        github,
        linkedin,
        website,
        location
    }
    try{

        let profile = await Profile.findOne({ user: req.userId });
        if (profile) {
            profile = await Profile.findOneAndUpdate(
              { user: req.userId },
              { $set: profileData },
              { new: true }
            );
            return res.json(profile);
          }

        profile=new Profile(profileData)
        await Profile.save();
        return res.status(201).json(profile)
}catch (error) {
    console.error('Error saving profile:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports={
    getMyProfile,
    createOrUpdateProfile
}