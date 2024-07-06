const {instance}=require("../config/razorpay");
const Course=require("../models/Course");
const User=require("../models/User");
const mailSender=require("../utils/mailSender");
const {courseEnrollmentEmail}=require("../mail/templates/courseEnrollmentEmail");
const  mongoose  = require("mongoose");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")



//capture the payment and initiate the razorpay order
exports.capturePayment=async(req,res)=>
    {
        //course kon buy kr ra h and konsa course buy kr ra h
        //get course id and user id
        //validation
        //valid course id
        //valid coursedetails
        //user ne already pay to ni kr rkha
        //order create
        //return response

        //get course id and user id  --- userid to payload krke append ki thi auth me
         const {course_id}=req.body;
         const userId=req.user.id;

        //validation
        //valid course id
        if(!course_id)
            {
                return res.json({
                    success:false,
                    message:"please provide valid course ID",
                })
            }
        //valid coursedetails
        let course;
        try{
            course=await Course.findById(course_id);
            if(!course)
                {
                    return res.json({
                        success:false,
                        message:"could not find the course details",
                    })
                }
            
            //user ne already pay kr rkha ho to,  -- course me id padi hogi student/user ki..
            //mere paas user id string me hai and course me ObjectId ki form me to apni wali ko change kro object form me
            const uid=new mongoose.Types.ObjectId(userId);
            if(course.studentsEnrolled.includes(uid)){
                return res.status(200).json({
                    success:false,
                    message:"students is already enrolled",
                });
            }
            


        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:"could not inititate order",
            })

        }
        //order create
        const amount=course.price;
        const currency="INR";

        const options={
            amount:amount*100,
            currency,
            receipt:Math.random(Date.now()).toString(),
            notes:{
                courseId:course_id,
                userId,
            }
        };

        //fcuntion call order creation ke lie
        try{
            //initiate the payment using razorpay
            const paymentResponse = await instance.orders.create(option);
            console.log(paymentResponse);

            //return response
            return res.status(200).json({
                success:true,
                courseName:course.courseName,
                courseDescription:course.courseDescription,
                thumbnail:course.thumbnail,
                orderId:paymentResponse.id,
                currencey:paymentResponse.currency,
                amount:paymentResponse.ammount,

            })

        }
        catch(error)
        {
            console.log(error);
            return res.json({
                succeess:false,
                message:"could not initiate order",
            })

        }

        //return response

    };

    //verfigy signatire of Razorpay and Server

    exports.verifySignature = async(req,res)=>
        {
            //match server ke undar jo secret hai wo and jo razorpay ne bheja hai wo,
            const webhookSecret="12345678";

            //doosra razorpay jab webhook activate krega  --> jab api route hit hoga, tab waha se aega doosra signauter input me
            // ye request ke andar header ke undar send hota h,
            const signature=req.headers("x-razorpay-signature");

            // sha256 algo use kr re h
            const shasum=crypto.createHmac("sha256",webhookSecret);

            //convert hmac object into string format
            shasum.update(JSON.stringify(req.body));

            //hash algo output is showed by term called digest that is in hexadecimal form
            const digest=shasum.digest("hex");


            //now match digest and signature
            if(signature==digest)
                {
                    console.log("payment is Authorised");

                    //ab req to razorpay se aayin hai usme to userid , course id nahi pade
                    // to kaha se lae---> hmne notes me to bheji thi na , usi ko use krnege

                    const{courseId,userId}=req.body.payload.payment.entity.notes;

                    try
                    {
                        //fulfill the action

                        //find teh course and enroll the student in it
                        const enrolledCourse= await Course.findOneAndUpdate(
                                                {_id:courseId},
                                                {$push:{studentsEnrolled:userId}},
                                                {new:true},

                                                 );
                        if(!enrolledCourse)
                            {
                                return res.status(500).json({
                                    success:false,
                                    message:"course not found",
                                });
                            }

                            console.log("enrolledCourse = ",enrolledCourse);


                            //find teh student and add the course to their list enrolled courses me
                            const enrolledStudent = await User.findOneAndUpdate(
                                {_id:userId},
                                {$push:{courses:courseId}},
                                {new:true},
                            ) ;

                            console.log("enrolled Student ",enrolledStudent);

                            //now send confrimation mail of course buy
                            const emailResponse=await mailSender(enrolledStudent.email,
                                "Congratulations from CodeHelp",
                                paymentSuccessEmail(
                                    `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                                    amount / 100,
                                   
                                  )
                                  //isme Order id and payment id bhi bhejni hai,

                            );  //abhi ke lie aise hi kr diya baad me template se attach krenge.
                            console.log("email response",emailResponse);

                            return res.status(200).json({
                                success:true,
                                message:"signature verifyed and course added",
                            })



                    }
                    catch(error)
                    {
                        console.log(error);
                        return res.status(500).json({
                            success:false,
                            message:error.message,
                        });

                    }


                }

                else{
                    return res.status(400).json({
                        success:false,
                        message:"invalid requeset",

                    })
                }
            
            






        }


        //enroll Strudent bhi hai usme....
        //wo dekhna hai
