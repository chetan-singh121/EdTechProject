const jwt=require("jsonwebtoken");
require("dotenv").config();
const User=require("../models/User");

//auth
//is student
//isInstructor
//isAdmin

//auth |
//     |
//    \|/
exports.auth=async(req,res,next)=>
    {
        try
        {
            //extract token
            console.log("before token extraction");
            const token = req.cookies.token
                          || req.body.token
                          || req.header("Authorization").replace("Bearer ","");
                        
            console.log("after token extraction");

            
            //if token missing , then return response
            if(!token)
                {
                    return res.status(401).json({
                        success:false,
                        message:"token missing, you have to login first",
                    });
                }

                
            //verify token
            try{
                const decode=await jwt.verify(token, process.env.JWT_SECRET);
                console.log(decode);
                req.user=decode;

                 
            }
            catch(err)
            {
                //verification issue
                return res.status(401).json({
                    success:false,
                    message:"token invalid",
                    
                });
                

            }
            next(); //next middlware pr pahuch gye 
            
        }
        catch(error)
        {
            return res.status(401).json({
                success:false,
                message:" something went wrong, while validating token",
                error:error.message,
            });

        }

    }


//is student
exports.isStudent = async(req,res,next)=>
    {
        try
        {
            if(req.user.accountType!="Student")
                {
                    return res.status(401).json({
                        success:false,
                        message:" this is for student and you are not student ",
                    })


                }
            next();
            

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:" user role cannot be verified,try again"
            })

        }
    }

//isInstructor
exports.isInstructor = async(req,res,next)=>
    {
        try
        {
            if(req.user.accountType!="Instructor")
                {
                    return res.status(401).json({
                        success:false,
                        message:" this is for instructor and you are not instructor",
                    })


                }
            next();
            

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:" user role cannot be verified,try again"
            })

        }
    }

//isAdmin
exports.isAdmin= async(req,res,next)=>
    {
        try
        {
            if(req.user.accountType!="Admin")
                {
                    return res.status(401).json({
                        success:false,
                        message:" this is for admin and you are not admin",
                    })


                }
            next();
            

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:" user role cannot be verified,try again"
            })

        }
    }
