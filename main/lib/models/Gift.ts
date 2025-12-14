import mongoose, { Schema, model, models } from "mongoose";
import slugify from "slugify";
import { rand } from "../utils";

const giftSchema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
        },
        image: {
            type: String,
        },
        amount: {
            type: Number,
            required: true,
        },
        splits: {
            type: Number,
            default: 1,
        },
        duration: {
            type: Number,
            default: 1,
        },
        dispense: {
            type: Date,
            default: Date.now,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        status: {
            type: String,
            default: "pending",
            enum: ["pending", "funded", "dispensed", "cancelled", "failed"],
        },
        giftBag: {
            airtime: {
                enabled: { type: Boolean, default: false },
                networks: [{ type: String }],
            },
            data: {
                enabled: { type: Boolean, default: false },
                networks: [{ type: String }],
            },
            giftCard: {
                enabled: { type: Boolean, default: false },
                types: [{ type: String }], // e.g. Amazon, iTunes
            },
            bank: {
                enabled: { type: Boolean, default: false },
                banks: [{ type: String }],
                bankCode: [{ type: String }],
            },
            random: {
                enabled: { type: Boolean, default: true }, // If true, pick randomly from other enabled types
            },
            allowParticipantPick: { type: Boolean, default: false },
        },
        expectedParticipant: {
            name: [{ type: String }],
            email: [{ type: String }],
            nin: [{ type: String }],
            bvn: [{ type: String }],
            secretCode: [{ type: String }],
            choice: {
                type: [{ type: String, enum: ["name", "email", "nin", "bvn", "secretCode"] }],
                default: ["name", "email"],
            },
            allowRepeat: { type: Boolean, default: false },
            private: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

// Pre-save hook to generate slug
giftSchema.pre("save", function (next) {
    if (!this.slug && this.title) {
        const randomSuffix = rand(6);
        this.slug = slugify(`${this.title}-${randomSuffix}`, {
            lower: true,
            strict: true,
        });
    }
    next();
});

const Gift = models.Gift || model("Gift", giftSchema);
export default Gift;
