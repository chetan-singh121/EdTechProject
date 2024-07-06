// const { findById } = require("../models/Course");
const Profile=require("../models/Profile");
const User= require("../models/User");
const Course = require("../models/Course");
const { uploadImageCloudinary } = require("../utils/imageUploader")


exports.updateProfile=async(req,res)=>
    {
        try{
            //get data
            //get userid
            //validation
            // find profile
            //update profile
            //return response


            //get data
            const{dateOfBirth="",about="",contactNumber,gender}=req.body;

            //get userid
            const id=req.user.id;

            //validation
            if(!contactNumber|| !gender)
                {
                    return res.status(400).json({
                        success:false,
                        message:"all fields are required",
                         
                    })
                }

            // find profile
            //---profile to user ke andr padi hogi.
            const userDetails=await User.findById(id);

            const profileId=userDetails.additionDetails;
            const profileDetails=await Profile.findById(profileId);

            //update profile
            profileDetails.dateOfBirth=dateOfBirth;
            profileDetails.about=about;
            profileDetails.gender=gender;
            profileDetails.contactNumber=contactNumber;
                 //yhaha doosre tarike se update kra hai.
            await profileDetails.save();

            //return response
            return res.status(200).json({
                success:true,
                message:"profile updated successfully",
                profileDetails,
            })

        }
        catch(error)
        {
            return res.status(200).json({
                success:false,
                message:"some error occured while updaing profile",
                error:error.message,
            })
             
        }
    };

    //delete account
    //  --- explore how can we schedule this deletion operation, after one or two day
    exports.deleteAccount= async(req,res)=>
    {
        try
        {
            //getid
            //validate
            //delete profile
            //delete user
            //return response

            //getid
            const id=req.user.id;

            //validate
            const userDetails=await User.findById(id);
            if(!userDetails)
                {
                    return res.status(404).json(
                        {
                            success:false,
                            message:"user not found",
                        }
                    )

                }
            
            //delete profile
            await Profile.findByIdAndDelete({_id:userDetails.additionDetails});

            //delete user from courses
            for (const courseId of userDetails.courses) {
                await Course.findByIdAndUpdate(
                  courseId,
                  { $pull: { studentsEnroled: id } },
                  { new: true }
                )
              }

            //delete user
            await User.findByIdAndDelete({_id:id});
            //TODO: HW unenroll user from all enrolled courses

            //return response
            return res.status(200).json({
                success:true,
                message:"user deleted successfully",

            })

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:"user deletion failed, something went wrong",

            })

        }
    }

    exports.getUserDetails= async(req,res)=>
        {
            try{
                //get id
                //find deltails validation
                //return response

                //get id
                const id=req.user.id;
                console.log("user id=",id);

                //find deltails validation
                const userDetails=await User.findById(id).populate("additionDetails").exec();
                console.log(userDetails);
                
                //return response
                return res.status(200).json({
                    success:true,
                    message:"user ki data fetch successfully",
                    data:userDetails,
                })

            }
            catch(error)
            {
                return res.status(200).json({
                    success:false,
                    message:error.message,
                })

            }

        }

        exports.updateDisplayPicture = async (req, res) => {
            try {
              const displayPicture = req.files.displayPicture
              const userId = req.user.id

              //save imgae to cloudinary
              const image = await uploadImageCloudinary(
                displayPicture,
                process.env.FOLDER_NAME,
                1000,
                1000
              )
              console.log(image)

              //id se user nikalo and uski image me ye jo displayPicture hai iska cloudinary ka url store kr do.
              const updatedProfile = await User.findByIdAndUpdate(
                { _id: userId },
                { image: image.secure_url },
                { new: true }
              )

              //send response
              res.send({
                success: true,
                message: `Image Updated successfully`,
                data: updatedProfile,
              })
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: "error in display picture updation",
                error:error.message,
              })
            }
          }
          
          exports.getEnrolledCourses = async (req, res) => {
            try {
              const userId = req.user.id
              let userDetails = await User.findOne({
                _id: userId,
              })
                .populate({
                  path: "courses",
                  populate: {
                    path: "courseContent",
                    populate: {
                      path: "subSection",
                    },
                  },
                })
                .exec()
              userDetails = userDetails.toObject()
              var SubsectionLength = 0
              for (var i = 0; i < userDetails.courses.length; i++) {
                let totalDurationInSeconds = 0
                SubsectionLength = 0
                for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
                  totalDurationInSeconds += userDetails.courses[i].courseContent[
                    j
                  ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
                  userDetails.courses[i].totalDuration = convertSecondsToDuration(
                    totalDurationInSeconds
                  )
                  SubsectionLength +=
                    userDetails.courses[i].courseContent[j].subSection.length
                }
                let courseProgressCount = await CourseProgress.findOne({
                  courseID: userDetails.courses[i]._id,
                  userId: userId,
                })
                courseProgressCount = courseProgressCount?.completedVideos.length
                if (SubsectionLength === 0) {
                  userDetails.courses[i].progressPercentage = 100
                } else {
                  // To make it up to 2 decimal point
                  const multiplier = Math.pow(10, 2)
                  userDetails.courses[i].progressPercentage =
                    Math.round(
                      (courseProgressCount / SubsectionLength) * 100 * multiplier
                    ) / multiplier
                }
              }
          
              if (!userDetails) {
                return res.status(400).json({
                  success: false,
                  message: `Could not find user with id: ${userDetails}`,
                })
              }
              return res.status(200).json({
                success: true,
                data: userDetails.courses,
              })
            } catch (error) {
              return res.status(500).json({
                success: false,
                message: error.message,
              })
            }
          }
          
          exports.instructorDashboard = async (req, res) => {
            try {
              const courseDetails = await Course.find({ instructor: req.user.id })
          
              const courseData = courseDetails.map((course) => {
                const totalStudentsEnrolled = course.studentsEnroled.length
                const totalAmountGenerated = totalStudentsEnrolled * course.price
          
                // Create a new object with the additional fields
                const courseDataWithStats = {
                  _id: course._id,
                  courseName: course.courseName,
                  courseDescription: course.courseDescription,
                  // Include other course properties as needed
                  totalStudentsEnrolled,
                  totalAmountGenerated,
                }
          
                return courseDataWithStats
              })
          
              res.status(200).json({ courses: courseData })
            } catch (error) {
              console.error(error)
              res.status(500).json({ message: "Server Error" })
            }
          }
