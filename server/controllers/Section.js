const Section=require("../models/Section");
const Course=require("../models/Course");
const SubSection=require("../models/SubSection");

exports.createSection=async(req,res)=>
    {
        try{
            //data fetch
            // data validation
            // create section
            // update course with section objectID
            //return response

            //data fetch
            const{sectionName,courseId}=req.body;

            // data validation
            if(!sectionName || ! courseId)
                {
                    return res.status(400).json({
                        success:false,
                        message:'missing proerties',
                    });
                }
            // create section
            const newSection = await Section.create({sectionName});

            // update course with section objectID
            const updatedCourse= await Course.findByIdAndUpdate(courseId,
                {
                    $push:{
                        courseContent:newSection._id,
                    }
                },
                {new:true},
            )
            .populate({
                path:"courseContent",
                populate:{ path:"subSection",},
            }) .exec();
            
            //HW: populate se section and subsection dono ki details print krwani hai.---/|\ upar kr dia hai.

            //return response
            return res.status(200).json({
                success:true,
                message:'section created successfully',
                updatedCourse,
            })

        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({
                success:false,
                message:'error occured while creating section',
              
            })

        }
    }

    exports.updateSection = async(req,res)=>
        {
            try{
                //data input
                //validation
                //update data
                //return response

                 //data input
                 const{sectionName,sectionId,courseId}=req.body;

                //validation
                if(!sectionName || !sectionId)
                    {
                        return res.status(400).json({
                            success:false,
                            message:'missing proerties',
                        });
                    }

                //update data
                const section = await Section.findByIdAndUpdate(sectionId,{sectionName},{new:true});

                const course=await Course.findById(courseId).populate({
                                                             path:"courseContent",
                                                             populate:{path:"subSection"},
                                                             }).exec();

                 
                //return response
                return res.status(200).json({
                    success:true,
                    message:'section updted successfully',
                    data:course,
                })


            }
            catch(error)
            {
                console.log(error);
                return res.status(500).json({
                    success:true,
                    message:'error in update section',
                    
                })

            }
        }

exports.deleteSection=async(req,res)=>
    {
        try{
            //fetch id
            //use findByIdAndDelete
            //return response

             //fetch id
             //--there are two ways to fetch data, req body and form parameter
             //-- here we are using parameter,assume we are sending ID in paramas
             const{sectionId}=req.body; //req.params se nahi hua pata nahi kyu, doubt hai mera
             const {courseId}=req.body;

             console.log("section Id",sectionId);
             console.log("courseid=",courseId);


          
            const section= await Section.findById(sectionId);
            console.log("section",section);

            //delete subsection me se section id
            await SubSection.deleteMany({_id: {$in: section.subSection}});

            //use findByIdAndDelete
            await Section.findByIdAndDelete(sectionId);

            await Course.findByIdAndUpdate(courseId,
                {
                    $pull:{
                        courseContent:sectionId,
                    }
                }
            )

            const course = await Course.findById(courseId).populate({
                path:"courseContent",
                populate: {
                    path: "subSection"
                }
            })
            .exec();

            //return response
            return res.status(200).json({
                success:true,
                message:"section deleted successfully",
                data:course,
            })
            
            //TODO : do we need to delete it from course schema ----> ans auto update(delete) ho jaega.
            //Doubt: delete pr course me se bhi to delete krnege. ya nahi?

            //pata nahi ye upar wali ki jarurat hai ya ni but kr deta hu, /|\ kr dia upar course me update
           

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:"section deleted unsuccessfully,something went wrong.",
                error:error.message,
            })

        }
    }






