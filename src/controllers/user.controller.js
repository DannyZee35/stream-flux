import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
 

const registerUser = asyncHandler(async (req,res,next)=>{
  
    const {fullname,email,password,username} = req.body
    
    if ([fullname,email,password,username].some((fields)=>
    fields?.trim() === ""  )) {
        throw new ApiError(400,"All fields are required");
    }
    
    const existingUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existingUser){
        throw new ApiError(409, "User with email or username already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage= await uploadOnCloudinary(coverImageLocalPath)

      if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }


  const user = await  User.create({
        fullname,
        username:username.toLowerCase(),
        email,
        password,
        avatar: avatar.url,
        coverImage: coverImage?.url || ""
    })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if(!createdUser){
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(201).json(
    new ApiResponse(201, "User registered successfully", createdUser)
  )
}) 


export {
    registerUser
}