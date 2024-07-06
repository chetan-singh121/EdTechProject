
const mongoose=require("mongoose");


const sectionSchema=new mongoose.Schema({
  sectionName:{
    type:String,
  },
  subSection:[
    {
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"SubSection",
    },
  ],


});

module.exports= Section = mongoose.model("Section",sectionSchema);