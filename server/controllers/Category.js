// const Category=require("../models/Category");

//create tag ka handler function
exports.createCategory=async(req,res)=>
    {
        try{
            //fetch data
            const{name,description}=req.body;

            //validation
            if(!name || !description)
                {
                    return res.status(400).json({
                        success:false,
                        message:"all fields are required",
                    })

                }
            
            //create entry in DB.
            const categoryDetails=await Category.create({
                name:name,
                description:description,
            });

            console.log("category just created is ",categoryDetails)
             //jab hum course bnaenege then make sure ki tag bhi update ho. jo isme array hai wo
            //return response
            return res.status(200).json({
                success:true,
                message:"Category created successfully",
            })

        }
        catch(error)
        {
            return res.status(500).json({
                success:false,
                message:error.message,
            })
        }
    }


//getAllTags handler function 
exports.showAllCategories=async(req,res)=>
{
    try
    {
        // console.log("show all categories ke andar");
        const allCategory = await Category.find({},{name:true,description:true});
        return res.status(200).json({
            success:true,
            message:"all tags successfully ",
            data:allCategory,
        });

    }
    catch(error)
    {
        return res.status(500).json({
            success:false,
            message:error.message,
        });

    }

};

exports.CategoryPageDetails= async(req,res)=>
    {
        try{
            //get category
            // get all courses correspond to this category
            //validation
            // get courses for different cuorses
            // get top selling courses
            //return response


            //get categoryId
            const{categoryId}=req.body;


            // get all courses correspond to this category
            const selectedCategory=await Category.findById(categoryId)
                                    .populate({
                                        path:"course",
                                        match:{status:"Published"},
                                        populate:"ratingAndReviews",
                                    })
                                    .exec();

            //validation
            if(!selectedCategory)
                {
                    return res.status(404).json({
                        success:false,
                        message:"data not found for this category",

                    });


                }

            // get courses for different cuorses
            const differentCategories=await Category.find({
                                        _id:{$ne:categoryId},
                                    })
                                    .populate({
                                        path: "course",
                                        match: { status: "Published" },
                                      })
                                      .exec()

            // get top 10 selling courses
            //HW:- wirte top selling course logic
            const allCategories = await Category.find()
                                            .populate({
                                                path: "course",
                                                match: { status: "Published" },
                                                populate: {
                                                    path: "instructor",
                                                },
                                            })
                                            .exec();
            
            //is niche wali line se saari course aa gye ek array me sabhi category ke
            const allCourses = allCategories.flatMap((category) => category.course)

            //top 10 selling course
            const mostSellingCourses = allCourses
                                        .sort((a, b) => b.sold - a.sold)
                                        .slice(0, 10)




            //return response
            return res.status(200).json({
                success:true,
                data:{
                    selectedCategory,
                    differentCategories,
                    mostSellingCourses,
                },

            });


        }
        catch(error)
        {
            console.log("category page details me error aa gyi ",error);
            return res.status(500).json({
                success:false,
                message:error.message,
            });

        }
    }