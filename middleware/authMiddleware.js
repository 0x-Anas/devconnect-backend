const JWT=require('jsonwebtoken')
const 

authMiddleware=async(req,res,next)=>{
    
    const authHeader=req.headers.authorization;

    if(!authHeader||!authHeader.startsWith('Bearer')){
        return res.status(401).json({message:'no token provided'});
    }

    const token=authHeader.split(' ')[1];

    try{
        const decoded=JWT.verify(token,process.env.JWT_SECRET)
        req.userId = decoded.id;

        next(); // move to next middleware or controller
      } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
      }
    }

    module.exports=authMiddleware;