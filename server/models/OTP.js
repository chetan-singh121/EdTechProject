const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate=require("../mail/templates/emailVerificationTemplate");


const OTPSchema=new mongoose.Schema({
email:{
    type:String,
    required:true,
},
otp:{
    type:String,
    required:true,
},

createdAt:{
    type:Date,
    default:Date.now(),
    expires:60*60*1000,  //5 minutes me expire ho jae
}

});

//function to send mail
async function sendVerificationEmail(email,otp)
{
    //create a transporter to send eamils
    //define the email option
    //send mail
    try{
        const mailResponse=await mailSender(email,"verification email form course project", emailTemplate(otp));
        console.log("email send successfully",mailResponse.response);


    }
    catch(error)
    {
        console.log("error occure while sending email ",error);
        throw error;

    }

}

//document entry se pehle hmara code run hona chiye
OTPSchema.pre("save",async function(next){
    console.log("new document saved to database");

    if(this.isNew) //ye line samajh ni aayi, babbar ne to ni krwaya but code se dekha
        {
            await sendVerificationEmail(this.email,this.otp);

        }
    next(); //ye kaam krne ke baad next middleware pr chale jao
})

// module.exports = mongoose.model("OTP",OTPSchema);
module.exports=OTP = mongoose.model("OTP",OTPSchema);


//export ka doosra tarika
//const OTP = mongoose.model("OTP", OTPSchema);

//module.exports = OTP;