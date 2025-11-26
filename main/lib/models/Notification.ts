import mongoose, { Schema, model, models } from "mongoose";

const NotificationSchema = new Schema(
    {
        content: {
            type: String,
            required: true,
        },
        creator_id: {
            type: String,
            required: true,
        },
        creator: {
            type: String,
            required: true,
        },
        isRead: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

export const Notification =
    models.Notification || model("Notification", NotificationSchema);
