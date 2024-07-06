const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");

 const { mongo, default: mongoose } = require("mongoose");


//create rating
exports.createRating= async(req,res)=>
    {
        try{
            //get user id
            //fetch data from user body
            //check if user is enrolled or not, bina enroll kre kaise rating de dega 
            //check if user already gave rating, ek banda ek baar hi rating de skta h,
            //create rating and review,
            //update course with this rating/review
            //return response


            //get user id
            const userId=req.user.id;

            //fetch data from user body
            const {rating,review,courseId}=req.body;

            //check if user is enrolled or not, bina enroll kre kaise rating de dega 
            const courseDetails=await Course.findOne(
                                    {_id:courseId,
                                        studentsEnrolled: {$eleMatch:{$eq:userId} },
                                    });
            
            if(!courseDetails)
                {
                    return res.status(404).json({
                        success:false,
                        message:"student is not enrolled",
                    });
                }

            //check if user already gave rating, ek banda ek baar hi rating de skta h,
            const alreadyReviewed=await RatingAndReview.findOne({
                                            user:userId,
                                            course:courseId,
                                        });

            if(alreadyReviewed)
                {
                    return res.status(403).json({
                        success:false,
                        message:"course is already reviewed by user",
                    });
                }

            //create rating and review,
            const ratingReview=await RatingAndReview.create({
                                        rating,review,
                                        course:courseId,
                                        user:userId,
                                    });

            //update course with this rating/review
            const updatedCourseDetails=await Course.findByIdAndUpdate(courseId,  //iski jagah {_id:courseId},  // bhi kr sskte the
                                            {
                                                $push:{
                                                    ratingAndReviews:ratingReview._id,
                                                }
                                            },
                                            {new:true}
                                        );

            console.log(updatedCourseDetails);
            //return response
            return res.status(200).json({
                success:true,
                message:"rating and revidew created successfully",
                ratingReview,
            })

        }
        catch(error)
        {
            console.log("error aa gyi rating creation me =>",error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }


//get avg rating
exports.getAverageRating= async(req,res)=>
    {
        try{
            //get course id,
            //calculate avg rating
            //return response

            //get course id,
            const courseId=req.body.courseId;

            //calculate avg rating
            const result=await RatingAndReview.aggregate([
                {
                    $match:{
                        course:new mongoose.Types.ObjectId(courseId),
                    },
                },
                {
                    $group:{
                        _id:null,
                        averageRating:{$avg:"$rating"},
                    }
                }
            ])
            //return response
            if(result.length>0)
                {
                    return res.status(200).json({
                        success:true,
                        averageRating:result[0].averageRating,
                    })
                }
            
            //if no rating exist
            return res.status(200).json({
                success:true,
                message:"avg rating is 0, no rating give till now",
                averageRating:0,
            })
            

        }
        catch(error)
        {
            console.log("error aa gyi rating avg krne me =>",error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }

//get all ratings
exports.getAllRating  = async(req,res)=>
    {
        try{
            const allReviews=await RatingAndReview.find({})
                                    .sort({rating:"desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email image",
                                    })
                                    .populate({
                                        path:"course",
                                        select:"courseName",

                                    })
                                    .exec();
            
            //return response
            return res.sttus(200).json({
                success:true,
                message:"all review fetched successfully",
                data:allReviews,
            });

        }
        catch(error)
        {
            console.log("error aa gyi get all rating me me =>",error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }
