//  const User=require("../models/User");

const mailSender =require("../utils/mailSender");
const bcrypt=require("bcrypt");
const crypto=require("crypto");


//reset Password --token creation token
//reset password

//reset Password  -- token creation.
exports.resetPasswordToken = async(req,res)=>
    {
        try{
        //get mail form req body
        //check user for this email, email validateion
        // front end ka link create kro and usme token daal diya. kyuki har diff ke liye different link bnega.
        //for the token generation, we have to use crypto.
        //generate token
        //update user by adding token and expiration time
        //create url
        //send mail contianing url
        //return response

        //get mail form req body
        const {email}=req.body;

        //check user for this email, email validateion
        console.log("mail=",email);
        const user=await User.findOne({email}).exec();
        console.log("user=",user);
        if(!user)
            {
                return res.json({
                    success:true,
                    message:"your email is not registered with us",
                });
            }

        // front end ka link create kro and usme token daal diya. kyuki har diff ke liye different link bnega. --> ye link niche likha h
        //for the token generation, we have to use crypto.
        //generate token
        const token=crypto.randomUUID();

        //update user by adding token and expiration time
        const updatedDetails = await User.findOneAndUpdate(
            {email:email},
            {
                token:token,
                resetPasswordExpires:Date.now()+1000*60*5,
            },
            {
                new:true
            }
        );

        //crete url
        const url=`http://localhost:3000/update-password/${token}`

        //send mail contianing url
        await mailSender(email,
                         "Password Reset Link",
                         `Password Reset link: ${url}`);
        //return response
        return res.json({
            success:true,
            message:'email sent successgully, please check email and change password',
        });

        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:'something went wrong while reset pwd',
                error:error.message,
            });

        }

    }
//reset password
exports.resetPassword=async(req,res)=>
    {
       try{
         //data fetch
        //validation
        //get user details form db using token
        // if no entry -- invalid token
        //token time check-- if expires then invalid token
        //hashed new password
        //update the password
        //return response;


        //data fetch
        const {password,confirmPassword, token}=req.body;

        //validation
        if(password!=confirmPassword)
            {
                return res.json({
                    success:false,
                    message:'password not matching',
                });;
            }

        //get user details form db using token
        const userDetails=await User.findOne({token:token});

        // if no entry -- invalid token 
        if(!userDetails)
            {
                return res.json({
                    success:false,
                    message:"token is invalid"
                });
            }

        //token time check-- if expires then invalid token
        if(userDetails.resetPasswordExpires < Date.now())
            {
                return res.json({
                    success:false,
                    message:"token is expired , please regenerate your token",
                });
            }

        //hashed new password
        const hashedPassword=await bcrypt.hash(password,10);

        //update the password
        await User.findOneAndUpdate({token:token},{password:hashedPassword},{new:true},);

        //return response;
        return res.status(200).json({
            success:true,
            message:"password reset successfull"
        }); 


       }
       catch(error)
       {
            console.log(error);
            res.status(400).json({
                success:false,
                message:"something wernt wrong while reset password",
            })

       }


    }