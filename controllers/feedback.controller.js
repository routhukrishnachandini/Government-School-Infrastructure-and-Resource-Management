import mongoose from "mongoose"
import {Feedback} from "../models/feedback.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getAllFeedbacks = asyncHandler(async (req, res) => {
    try {
        // Fetch all complaints without pagination
        const feedbacks = await Feedback.find();
  
        return res.status(200).json({
            success: true,
            data: {
                feedbacks
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

const publishAFeedback = asyncHandler(async (req, res) => {
    
    
    const { name,school,email,location,category, description} = req.body;
    console.log({name,email,school,location,category, description});
    
    if (!category || !description){
        throw new ApiError(400,"Title and description are required");
    }

    const newFeedback = await Feedback.create({
      schoolName : school,
      schoolLocation: location,
      category : category,
      description : description,
      ownerName : name,
      ownerEmail: email
    })
    console.log(newFeedback);
    
    if(! newFeedback) {
        throw new ApiError(500,"Error while uploading feedback");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,newFeedback,"The feedback has been published successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    
    const {commentId} = req.params;

    const {comment} = req.body;

    if ( !comment || comment === null ) {
        throw new ApiError(400,"Comment is required");
    }

    if ( !commentId) {
        throw new ApiError(400,"Comment id is missing");
    }

    const updatedComment = await Comment.updateOne({_id:commentId},{content:comment});

    if ( !updatedComment) {
        throw new ApiError(500,"Error while updating comment");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,updatedComment,"Comment updated successfully")
    )
})

const deleteComment = asyncHandler(async (req, res) => {
    
    const {commentId} = req.params;

    if( !commentId){
        throw new ApiError(400,"Comment id is required");    
    }

    const deletedComment = await Comment.deleteOne({_id:commentId});

    if ( !deletedComment ){
        throw new ApiError(500,"Error while deleting comment");
    }  

    return res
    .status(200)
    .json(
        new ApiResponse(200,deletedComment,"Comment has been deleted successfully")    
    )

})

export {
    publishAFeedback, 
    getAllFeedbacks
    }