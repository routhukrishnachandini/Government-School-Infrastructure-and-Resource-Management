import mongoose from "mongoose"
import {Complaint} from "../models/complaint.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"

const getAllComplaints = asyncHandler(async (req, res) => {
    try {
        // Group complaints by schoolName, count the occurrences, and sort by count descending
        const complaints = await Complaint.aggregate([
            {
                $group: {
                    _id: "$schoolName",
                    count: { $sum: 1 },
                    complaints: { $push: "$$ROOT" }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
  
        return res.status(200).json({
            success: true,
            data: {
                complaints
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch complaints',
            error: error.message
        });
    }
  });
  


const publishAComplaint = asyncHandler(async (req, res) => {
    
    
    const { name,school,email,location,category, description} = req.body;
    console.log({name,email,school,location,category, description});
    
    if (!category || !description){
        throw new ApiError(400,"Title and description are required");
    }

    const newComplaint = await Complaint.create({
      schoolName : school,
      schoolLocation: location,
      category : category,
      description : description,
      ownerName : name,
      ownerEmail: email
    })

    if(! newComplaint) {
        throw new ApiError(500,"Error while uploading complaint");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newComplaint,"The Complaint has been published successfully")
    )
})



export {
    publishAComplaint,
    getAllComplaints
}
