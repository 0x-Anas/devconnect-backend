const express= require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const cors=require('cors')
const authRoutes=require('./routes/auth')
const postRoutes=require('./routes/postRoutes')

dotenv.config();
const app=express();

app.use(cors()); //act as a middlemen
app.use(express.json()); //convert incoming data to jsons

app.use("/api/auth", authRoutes);
app.use('/api/posts',postRoutes);
//mongo connect
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log('✅ MongoDB Connected'))
.catch(error=>console.error("❌ MongoDB connection error:", error));

const PORT=process.env.PORT||5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));