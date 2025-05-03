const Post=require('../models/Post')
const Users=require('../models/Users')



  const createPost=async (req,res)=>{
    console.log(req.body); // Check if the title and username are correctly passed
    console.log(req.file); // Check if the file is being received by multer
    try{
        const {title,content,profilePic}=req.body;
        const image = req.file ? `/uploads/${req.file.filename.replace(/\\/g, '/')}` : null;


        if(!title||!content||!image){
            return res.status(400).json({message:'title,content, images are required'})
        }

        const user = await Users.findById(req.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
          }

        const newPost=new Post({
            user: req.userId, // we'll extract this from middleware (JWT)
            title,
            content,
            image:'/uploads/' + req.file.filename,
            profilePic,
            username:user.username,
        });

        const savedPost=await newPost.save();

        res.status(201).json(savedPost);
    }catch(error){
        console.error('Error creating post:', error.message, error.stack);  
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