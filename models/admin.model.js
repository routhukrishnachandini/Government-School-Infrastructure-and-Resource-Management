import mongoose from 'mongoose';
import mongooseAggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcrypt'; //for hashing passwords
import jwt from 'jsonwebtoken'; //authentication 

const adminSchema = mongoose.Schema(
    {
        ownerName : {
            type : String,
            required : true
        },
        ownerEmail: {
            type : String,
            required : true
        },
        userName : {
            type : String,
            required : true
        },
        password : {
            type : String,
            required : [true,'Password is required']
        }, 
    },
    {   
    timestamps : true
    }
) 

adminSchema.plugin(mongooseAggregatePaginate);

adminSchema.methods.isPasswordCorrect = async function(password){ // creating a custom function to check password
    return await bcrypt.compare(password,this.password); //compares the given password and encrypted password
} 

adminSchema.pre('save', async function (next) {//prehook to encrpyt password before saving in db if password is modified
    if(!this.isModified("password")){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    next();
})


export const Admin = mongoose.model("Admin",adminSchema);