import mongoose from 'mongoose';

import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2'; //used to write aggregate pipelines in mongodb

const complaintSchema = mongoose.Schema({
    schoolName : {
        type : String,
        required : true
    },
    schoolLocation:{
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    ownerName : {
        type : String,
        required : true
    },
    ownerEmail: {
        type : String,
        required : true
    }

},{
    timestamps:true
})

complaintSchema.plugin(mongooseAggregatePaginate);

export const Complaint = mongoose.model("Complaint",complaintSchema); 