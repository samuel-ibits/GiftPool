import mongoose, { Schema, Document } from "mongoose";

// Define an interface for the RaisePool document
export interface IRaisePool extends Document {
    type: "public" | "private";
    targetAmount: number;
    title: string;
    description: string;
    image?: string;
    websiteLink: string;
    socials: {
        x?: string;
        instagram?: string;
        facebook?: string;
        linkedin?: string;
    };
    duration: number;
    creatorId: mongoose.Types.ObjectId;
    status: "active" | "completed" | "cancelled";
}

// Define the schema for the RaisePool model
const raisePoolSchema = new Schema<IRaisePool>(
    {
        type: {
            type: String,
            enum: ["public", "private"],
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        },
        websiteLink: {
            type: String,
            required: true,
        },
        socials: {
            x: { type: String },
            instagram: { type: String },
            facebook: { type: String },
            linkedin: { type: String },
        },
        duration: {
            type: Number,
            required: true,
        },
        creatorId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        status: {
            type: String,
            enum: ["active", "completed", "cancelled"],
            default: "active",
        },
    },
    {
        timestamps: true,
    }
);

// Export the model, reusing an existing one if it already exists
const RaisePool = mongoose.models.RaisePool || mongoose.model<IRaisePool>("RaisePool", raisePoolSchema);

export default RaisePool;
