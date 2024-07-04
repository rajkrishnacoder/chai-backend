import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    // check that user is login or not 
    // check that all fields are available or not 
    // make a lockalpath for files and upload on cloudinary
    // check that file upload successfully with response like url and duration
    // create a video document
    // check that document created successfully or not 
    
    const user = await User.findById(req.user._id).select("-password -refreshToken")

    if(!user) throw new ApiError(400, "user is not found")
    
    if([title, description].some((field) => field?.trim() == "")){
        throw new ApiError(400, "all fieds are required")
    }

    const videoLocalPath = req.files?.videoFile[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail[0]?.path
    if(!videoLocalPath && !thumbnailLocalPath) throw new ApiError(400, "video and thumbnail file is required")
    
    const video = await uploadOnCloudinary(videoLocalPath)
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)

    if(!video && !thumbnail){
        let error = "video"
        if(video) error = "thoumbnail"
        throw new ApiError(400, `${error} file is required from cloudinary`)
    }

    const videoDoc = await Video.create({
        videoFile: video.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: video.duration,
        owner: user._id
    })

    if(!videoDoc) throw new ApiError(500, "Something went wrong while registering the video")

    return res.status(200)
    .json( new ApiResponse(200, {videoDoc}, "video registered successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id

    if(!isValidObjectId(videoId)) throw new ApiError(400, "video id required")

    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(400, "video is not found")

    return res.status(200)
    .json( new ApiResponse(200, {video}, "video is fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

    if(!videoId) throw new ApiError(400, "video id is missing")

    if(!req.user?._id) throw new ApiError(400, "user is not logedin")

    const thumbnailLocalPath = req.file?.path
    if(!thumbnailLocalPath) throw new ApiError(400, "thumbnail is required")
    
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath)
    
    if(!thumbnail) throw new ApiError(400, "thumbnail is required from cloudinary")

    const video = await Video.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                thumbnail: thumbnail.url
            }
        }, 
        {new: true}
    )
    
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
