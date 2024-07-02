import mongoose, {isValidObjectId, isValidObjectId} from "mongoose"
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
    // check that file lupload successfully with response like url and duration
    // create a video document
    // check that document created successfully or not 
    
    const user = await User.findById(req.user._id)

    if(!user) throw new ApiError(400, "user is not found")
    
    if([title, description].some((field) => field?.trim() == "")){
        throw new ApiError(400, "all fieds are required")
    }


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const isValidObjectId = isValidObjectId(videoId)
    if(!isValidObjectId) throw new ApiError(400, "video id required")

    const video = await Video.findById(videoId)

    if(!video) throw new ApiError(400, "video is not found")

    return res.status(200)
    .json(200, {video}, "video is fetched successfully")
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

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
