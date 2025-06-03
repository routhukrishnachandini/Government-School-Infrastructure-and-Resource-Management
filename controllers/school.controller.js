import mongoose from "mongoose"
import {School} from "../models/school.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const addSchool = asyncHandler(async (req, res) => {
    
    const { schoolName,location } = req.body;
    
    if ([schoolName,location].some(field => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    
    const school = await School.create({
        schoolName: schoolName,
        location : location
    })

    if(!school){
        throw new ApiError(500, "Something went wrong while registering school");
    }
    const cookieOptions = {
        httpOnly: true, // Cookie can only be modified by the server
        secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
        sameSite: 'None', // Allow cross-site cookies
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    };

    // Set cookies for schoolName and location
    res
        .status(200)
        .cookie("schoolName", schoolName, cookieOptions)
        .cookie("location", location, cookieOptions)
        .json(
            new ApiResponse(200, school, "School added successfully")
        );
})



export {
    addSchool
}

