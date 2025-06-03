import {asyncHandler} from '../utils/asyncHandler.js';
import {ApiError} from '../utils/ApiError.js';
import {User} from '../models/user.model.js'; // the user was created in the user model and can directly connect with mongodb
import {ApiResponse} from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { Complaint } from '../models/complaint.model.js';
import {Admin} from '../models/admin.model.js';



const generateAccessAndRefreshTokens = async(userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = await refreshToken;
        await user.save({validateBeforeSave : false}); //in order to handle the error that is password is required

        console.log(user);
        return {accessToken,refreshToken};

    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token");
    }
}

const registerUser = asyncHandler(async (req, res) => {
   
    const { fullname, username, userType, email, password } = req.body;
    
    if ([fullname, username, userType, email, password].some(field => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    console.log("Registering user with:", { fullname, username, userType, email, password });

    try {
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });

        if (existingUser) {
            throw new ApiError(409, "User with username or email already exists");
        }
        const user = await User.create({
            fullname,
            email,
            password,
            username: username.toLowerCase(),
            role: userType
        });
        
        const isUserCreated = await User.findById(user._id).select("-password -refreshToken");

        if (!isUserCreated) {
            throw new ApiError(500, "Something went wrong while registering the user");
        }

        return res.status(201).json(new ApiResponse(200, "User registered successfully"));

    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json(new ApiResponse(409, "User with username or email already exists"));
        }

        throw error; // Re-throw other errors
    }
});

const registerAdmin = asyncHandler(async (req, res) => {
   
    const { fullname, username,  email, password } = req.body;
    console.log(({ fullname, username,  email, password }));
    
    if ([fullname, username, email, password].some(field => field.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }
    console.log("Registering user with:", { fullname, username,  email, password });

    try {
        const existingAdmin = await Admin.findOne({ $or: [{ username }, { email }] });

        if (existingAdmin) {
            throw new ApiError(409, "Admin with username or email already exists");
        }
        const admin = await Admin.create({
            ownerName:fullname,
            ownerEmail:email,
            password:password,
            userName: username.toLowerCase(),
        });
        
        const isAdminCreated = await Admin.findById(admin._id).select("-password -refreshToken");

        if (!isAdminCreated) {
            throw new ApiError(500, "Something went wrong while registering the Admin");
        }

        return res.status(201).json(new ApiResponse(200, "Admin registered successfully"));

    } catch (error) {
        if (error.code === 11000) { // MongoDB duplicate key error code
            return res.status(409).json(new ApiResponse(409, "Admin with username or email already exists"));
        }

        throw error; 
    }
});

const loginUser = asyncHandler(async (req, res) => {
    
    const { username, email, password,loginType } = req.body;
    console.log({username, email, password,loginType });
    
    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required");
    }

    // Find user by username or email
    if (loginType=="normal") {
        const user = await User.findOne({
            $or: [
                { email: email }, 
                { username: username }
            ]
        });
    
        if (!user) {
            throw new ApiError(404, "User does not exist");
        }
    
        // Check if password is correct
        const isPasswordValid = await user.isPasswordCorrect(password);
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Password is incorrect");
        }
    
        // Generate access and refresh tokens
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    
        // Exclude password and refresh token from the response
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
                
        const cookieOptions = {
            httpOnly: true, // Cookie can only be modified by the server
            secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
            sameSite: 'None' // Allow cross-site cookies
        };
    
        
        // Send cookies and response
        return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("userName", loggedInUser.fullname, cookieOptions) // Add user's name to cookies
        .cookie("userEmail", loggedInUser.email, cookieOptions) // Add user's email to cookies
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, 
                    accessToken, 
                    refreshToken
                },
                "Logged in successfully"
            )
        );
    } else if (loginType == "admin"){
        const admin = await Admin.findOne({
            $or: [
                { email: email }, 
                { username: username }
            ]
        });
    
        if (!admin) {
            throw new ApiError(404, "Admin does not exist");
        }
    
        // Check if password is correct
        const isPasswordValid = await admin.isPasswordCorrect(password);
    
        if (!isPasswordValid) {
            throw new ApiError(401, "Password is incorrect");
        }
    
        // Exclude password and refresh token from the response
        const loggedInUser = await Admin.findById(admin._id).select("-password");
    
    
        
        // Send cookies and response
        return res
        .status(200) // Add user's email to cookies
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, 
                },
                "Logged in successfully"
            )
        );
    }
});


const logoutUser = asyncHandler(async(req, res) => {
   
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the refreshToken field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options) // removing the tokens from the cookies so that the user is completely removed
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

const refreshAccessToken = asyncHandler( async (req,res,) => {
    
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken; //extracting the refresh token from the cookies
    
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request");
    }
    
    const decodedTokenData = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    
    if(!decodedTokenData){
        throw new ApiError(400,"Invalid refresh token");
    }
    
    const user = await User.findById(decodedTokenData?._id);
    
    if(!user){
       throw new ApiError(400,"Invalid refresh token");
    }
    
    if(incomingRefreshToken !== user?.refreshToken){
        throw new ApiError(400,"Refresh token doesnot match refresh token in database");
    } 
        
    const {accessToken,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
    const options = {
            httpOnly: true,
            secure: true
    }
    
    return res
    .status(200)
    .cookie("accessToken",await accessToken,options)
    .cookie("refreshToken",await newrefreshToken,options)
    .json(
        new ApiResponse(200,{
            accessToken:await accessToken,
            refreshToken:await newrefreshToken
          })
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    registerAdmin
} ;