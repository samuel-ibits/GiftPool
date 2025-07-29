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
            required: true,
        },
        duration: {
            type: Number, // in days
            required: true,
        },
        dispense: {
            type: Date,
            default: null,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
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
                banks: [{ type: String }], // optional: GTB, Access, etc.
            },
            random: {
                enabled: { type: Boolean, default: true }, // If true, pick randomly from other enabled types
            }
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
