import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';

const feedbackSchema = mongoose.Schema(
    {
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
    },
    {   
    timestamps : true
    }
) 

feedbackSchema.plugin(mongooseAggregatePaginate);

export const Feedback = mongoose.model("Feedback",feedbackSchema);