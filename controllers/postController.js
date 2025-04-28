const Post=require('../models/Post')



  const createPost=async (req,res)=>{
    try{
        const {title,image,profilePic,username}=req.body;

        const newPost=new Post({
            user: req.userId, // we'll extract this from middleware (JWT)
            title,
            image,
            profilePic,
            username,
        });

        const savedPost=await newPost.save();

        res.status(201).json(savedPost);
    }catch(error){
        res.status(500).json({ message: 'Something went wrong creating post' });
    }
    
}

const getAllPost=async(req,res)=>{
    try{
        const posts=await Post.find()
        .populate('user','username profilePic')
        .sort({createdAt:-1})

        res.status(200).json(posts)
    }catch(error){
        console.error(error.message)
        res.status(500).json({message:'server error while fetching'});
    }
}
module.exports={createPost,getAllPost};