const express=require("express");
const app=express();

const userRoutes=require("./routes/User");
const profileRoutes=require("./routes/Profile");
// const paymentRoutes=require("./routes/Payments");
const courseRoutes=require("./routes/Course");


//database wali cheez
const database=require("./config/database");

//cookie
const cookieParser=require("cookie-parser");

//front end host ho 3000 par backend 4000 pr,
// mai chahta hu ki backend frontend ki request ko entertrain kre to cors install krna padega
const cors=require("cors");
const {cloudinaryConnect}=require("./config/cloudinary");
const fileUpload=require("express-fileupload");
const dotenv=require("dotenv");

dotenv.config();
const PORT=process.env.PORT || 4000;

//database connect
database.connect();

//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
     cors({
        origin:"http://localhost:3000",
        credentials:true,
     })
)
app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"/tmp",
    })
)

//cloudinary connection
cloudinaryConnect();

//routes
app.use("/api/v1/auth",userRoutes);
app.use("/api/v1/profile",profileRoutes);
app.use("/api/v1/course",courseRoutes);
// app.use("/api/v1/payment",paymentRoutes);


//default route
app.get("/", (req,res)=>
{
    return res.json({
        success:true,
        message:"your server is up and running",
    })
});

//activate server on this PORt
app.listen(PORT, ()=>
[
    console.log(`app is running at ${PORT}`)
])



