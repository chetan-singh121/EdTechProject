// const User=require("../models/User");
const OTP=require("../models/OTP");
const otpgenerator =require("otp-generator");
const bcrypt=require("bcrypt");
const Profile = require("../models/Profile");
const jwt=require("jsonwebtoken");
const mailSender=require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate")
require("dotenv").config();

//send otp
exports.sendOTP=async(req,res)=>{
    try{
        //fetch email from request ki body
        console.log("send otp weale me aa gye");
        const {email}=req.body;

        //check if email means user already exist
        const checkUserPresent =await User.findOne({email});
         

        if(checkUserPresent)
            {
                return res.status(401).json({
                    success:false,
                    message:"user already exist with this email",
                })
            }
        
        //otp generation 
        var otp=otpgenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("otp generated: ",otp); 

        //now check that otp is unique
        const result=await OTP.findOne({otp:otp});
        console.log("first");

        //jab tak mujhe result ki value mil rahi hai tab tak mai generate krta rahunga dobara dobara
        // kyuki mujhe to naya krna hai na
        while(result)
            {
                 otp=otpgenerator.generate(6,{
                    upperCaseAlphabets:false,
                    lowerCaseAlphabets:false,
                    specialChars:false,
                });
                result=await OTP.findOne({otp:otp});

            }
        console.log("second");
        
        //otp ki entry database me daal do
        const otpPayload={email,otp}; //created at nahi dala , kyuki wo to uski value default date.now kr rkhi h
        const otpbody=await OTP.create(otpPayload);
        console.log("otp body - ",otpbody);

        //return response successful
        res.status(200).json({
            success:true,
            messge:"otp sent successfully",
            otp,
        })






         

    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}

//signup

exports.signUp=  async(req,res)=>
    {
        try{
            //data fetch form request ki body
        //validate data
        // dono passwoerd match
        // check user already exist
        //find most recent otp stroed for user
        //validate otp
        //hashpassword
        //entry crete in DB
        //return response


         //data fetch form request ki body
         const {firstName,lastName, email,password,confirmPassword,
            accountType,contactNumber,otp}=req.body;

    //validate data
    if(!firstName || !lastName || !email || !password || !confirmPassword ||!otp)
        {
            return res.status(403).json({
                success:false,
                message:"all fields are required",
            })
        }

    // dono passwoerd match
    if(password!=confirmPassword)
        {
            return res.status(400).json({
                success:false,
                message:"password and confirm password are different",
            })

        }
    // check user already exist
    const checkExisting=await User.findOne({email});
    if(checkExisting)
        {
            return res.status(400).json({
                success:false,
                message:"user with this email already exists",
            })

        }

    //find most recent otp stroed for user
    

    const rc2 = await OTP.find({})
    console.log("rc2 printed details",rc2);
   
    console.log("our otp ",otp);
    console.log("email = ",email);
    const recentotp=  await OTP.find({email}).sort({createdAt:-1}).limit(1);
    console.log("recent otp",recentotp.otp);

    //validate otp
    if(recentotp.length==0)
        { //otp not found
             return res.status(400).json({
                success:false,
                message:"OTP Not found",
            });

        }
    else if(otp!=recentotp[0].otp)
        {
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"otp send to mail, and you entered are differnt",
            })
        }
    //hashpassword
    const hashedPassword= await bcrypt.hash(password,10);

    //entry crete in DB

    const profile=await Profile.create({
        gender:null,
        dateOfBirth:null,
        about:null,
        contactNumber:null,
    })
    const user=await User.create({
        firstName,
        lastName,
        email,
        contactNumber,
        password:hashedPassword,
        accountType,
        additionDetails:profile._id, //additional detail me to profile thi to wo upar bni hai profile,
        image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,

    })
    //return response
    return res.status(200).json({
        success:true,
        message:"user is registered succcessfully",
        user,

    })

        }
        catch(error)
        {
            console.log("error aa gyei",error);
            return res.status(400).json({
                success:false,
                message:"user registration not done, try again ",
              
        
            })
        }

        //
    }

//login

exports.login = async(req,res)=>
    {
        try{
            //get data from req ki body
            //validation data
            //user check exist or not
            // generate JWT, after password matching
            //create cookie
            //response send

            //get data from req ki body
            const {email,password}=req.body;

            //validation data
            if(!email || !password)
                {
                    return res.status(403).json({
                        success:false,
                        message:"all field are require",
                    });
                }

            //user check exist or not
            const user = await User.findOne({email}).populate("additionDetails");
            if(!user)
                {
                    return res.status(401).json({
                        success:false,
                        message:"user is not registered",
                    });
                }

            // generate JWT, after password matching
            if(await bcrypt.compare(password,user.password))
                {
                    const payload={
                        email:user.email,
                        id:user._id,
                        accountType:user.accountType,
                    }
                    //password match hai to login ke liye token create krwa do
                    const token = jwt.sign(payload,process.env.JWT_SECRET,{
                        expiresIn:"2h",
                    });
                    //save token to user document in database
                    user.token=token;
                    user.password=undefined;

                    //create cookie
                    const options={
                        expires:new Date(Date.now()+ 3*24*60*60*1000),
                    }
                    res.cookie("token",token,options).status(200).json({
                        success:true,
                        token,
                        user,
                        message:'logged in successfully',
                    })

                }
            else
            {
                return res.status(401).json({
                    success:false,
                    message:"passowrd is incorrect",
                });
                
            }
            
            //response send


        }
        catch(error)
        {
            console.log(" eror aa gyi login me ",error);
            return res.status(401).json({
                success:false,
                message:"Login failure, try again",
            });

        }

    }

//changepassword
exports.changePassword = async(req,res)=>
    {
        try{
             //get data from req body
        //get oldpassword,new password, confirm passowrd
        const {email,oldPassword,newPassword,confirmPassword}=req.body;

        //validation
        const user=await User.findOne({email});
        if(bcrypt.compare(user.password,oldPassword))
            {
                return res.json({
                    success:false,
                    message:"you entered wrong old password",
                })
            }
        
        if(newPassword!=confirmPassword)
            {
                return res.json({
                    success:false,
                    message:"new password and confirm password does not match",
                })

            }
                
        //hashed new password
        const hashedPassword=await bcrypt.hash(newPassword,10);

        //update the password
        await User.findOneAndUpdate({email:email},{password:hashedPassword},{new:true},);

        //send mail - password updated
        //mail ko bhi try catch ke andar
        try{
            const emailResponse=await mailSender(email,
                "Password updated",
                passwordUpdated(email,`password updated successfully for ${user.firstName} ${user.lastName}`));

            console.log("mail sent successfully:",emailResponse.response)

        }
        catch{
            // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
             console.error("Error occurred while sending email:", error)
            return res.status(500).json({
                success: false,
                message: "Error occurred while sending email",
                error: error.message,
            })

        }
       

        //return response
        return res.status(200).json({
            success:true,
            message:"password is updated",
            user
        })

        }
        catch(error)
        {
            console.log(error);
            return res.status(200).json({
                success:false,
                message:"something went wrong while updating password",
                
            })


        }
       

    }


