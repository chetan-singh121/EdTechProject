// const SubSection=require("../models/SubSection");
// const Section = require("../models/Section");
const {uploadImageCloudinary} =require("../utils/imageUploader");

// Note:- Ye saare import route me kr die h jis se ye link hai. mtlb Course.route me
//         Double dependency wali error aa rahi thi ni to, wahi aman anushka wali

//create subsection
exports.createSubSection = async(req,res)=>
    {
        try{
            //fetch data form req body
            //extract file/video
            //validation
            //upload video on cloudinary and get video url
            //create subsection 
            //updte section with this sub section object id
            //return response

            //fetch data form req body
            const{sectionId,title, description}=req.body;

            //extract file/video
            const video=req.files.video; //video file ka naam--- videoFile hai.

            //validation
            if(!sectionId || !title  ||!description ||!video)
                {
                    return res.status(400).json({
                        success:false,
                        message:"all fields are required",
                    });
                }

            //upload video on cloudinary and get video url
            const uploadDetails=await uploadImageCloudinary(video,process.env.FOLDER_NAME);

            //create subsection 
            const SubSectionDetails= await SubSection.create({
                title:title,
                timeDuration:`${uploadDetails.duration}`,
                description:description,
                videoUrl:uploadDetails.secure_url,
            })

            //updte section with this sub section object id
            const updatedSection= await Section.findByIdAndUpdate({_id:sectionId},
                                                                    { 
                                                                        $push:{
                                                                            subSection:SubSectionDetails._id,
                                                                        }

                                                                    },
                                                                    {new:true} ).populate("subSection");
             
             //HW: print updated section here, by populate querry                                                      
            //return response
            return res.status(200).json({
                success:true,
                message:'sub section created successfully',
                data:updatedSection,
            })

        }
        catch(error)
        {
            console.log("error aa gyi, ",error);
            return res.status(500).json({
                success:false,
                message:'some problem in creating subsection',
                error:error.message,
            })

        }
    };


    //HW: update subsection ===========> maine kra hai ye.
    exports.updateSubSection = async(req,res)=>
        {
            try{
                //fetch details
                const{sectionId,subSectionId,title, description}=req.body;
                const subSectionDetails=await SubSection.findById(subSectionId);

                //validation
                if(!subSectionDetails )
                    {
                        return res.status(400).json({
                            success:false,
                            message:"subsection id missing",
                        });
                    }
                if(title)
                    {
                        subSectionDetails.title=title;
                    }
               
                if(description)
                    {
                        subSectionDetails.description=description;
                    }
                if(req.files && req.files.video!==undefined)
                    {
                        const video=req.files.video
                        const uploadDetails=await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
                        subSectionDetails.videoUrl=uploadDetails.secure_url;
                    }
                await subSectionDetails.save();
                const updatedSection = await Section.findById(sectionId).populate("subSection");

                return res.status(200).json({
                    success:true,
                    message:"subsection updation successful",
                    data:updatedSection,
                })
                


            }
            catch(error)
            {
                console.log("error aa gyi, ",error);
                return res.status(500).json({
                success:false,
                message:'some problem in updating subsection',
                error:error.message,
            })

            }
        }

    // HW: delete Subsection ====> maine kra ha ye
    exports.deleteSubSection=async(req,res)=>
        {
            try{
                //fetch id
                //use findByIdAndDelete
                //return response
    
                 //fetch id
                 
                 const{subSectionId,sectionId}=req.body;
    
                //use findByIdAndDelete in section
                // await Section.findByIdAndUpdate({_id:sectionId},
                //                                 {
                //                                     $pull:{subSection:subSectionId,},
                //                                 }
                //                                )

                // ha is ko kre tab bhi sahi , na karo tab bhi sahi, na krne par bhi auto delete ho jaega
               const subsection= await SubSection.findByIdAndDelete({_id:subSectionId});
               if(!subsection)
                {
                    return res.status(404).json({
                        success:false,
                        message:"subsection not found",
                    })
                }

                // find updated section and return it
                const updatedSection = await Section.findById(sectionId).populate(
                    "subSection"
                )
    
                //return response
                return res.status(200).json({
                    success:true,
                    message:"subsection deleted successfully",
                    data:updatedSection,
                })
                
    
            }
            catch(error)
            {
                return res.status(500).json({
                    success:false,
                    message:"SubSection deleted unsuccessfully,something went wrong.",
                    error:error.message,
                })
    
            }
        }