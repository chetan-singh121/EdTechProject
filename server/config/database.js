const mongoose =require("mongoose");
const dotenv =require( 'dotenv');
dotenv.config();

exports.connect=()=>
    {
        mongoose.connect(process.env.MONGODB_URL)
        .then(()=>console.log("DB connection succefull"))
        .catch((error)=>
        {
            console.log("db connection failed");
            console.error(error);
            process.exit(1);
        })
    }