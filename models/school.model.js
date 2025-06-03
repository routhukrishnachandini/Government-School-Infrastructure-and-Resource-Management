import mongoose from "mongoose";

const schoolSchema = mongoose.Schema({
    schoolName :{
        type : String,
        required : true
    },
    location :{
        type : String,
        required : true
    }
    

},{timestamps : true})

export const School = mongoose.model("School",schoolSchema)