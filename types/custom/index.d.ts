import mongoose from "mongoose";

export interface UserDocument extends mongoose.Document {
    _id: string,
    username: string,
    password: string,
    createdAt: Date,
    updatedAt: Date,
}

export interface SafeUserDocument extends mongoose.Document {
    _id: mongoose.Types.ObjectId,
    username: string,
    createdAt: Date,
    updatedAt: Date,
}

