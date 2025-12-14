import mongoose, { Schema } from 'mongoose';

const GiftClaimSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },

    giftId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Gift', // Optional if you have a separate Gift model
    },

    giftName: {
        type: String,
        required: true,
    },

    claimed: {
        type: Boolean,
        default: false,
    },

    claimDetails: {
        phone: { type: String, default: '' },
        wallet: { type: String, default: '' },
        bank: {
            bankName: { type: String, default: '' },
            accountNumber: { type: String, default: '' }
        },
        secretCode: { type: String },
        nin: { type: String },
        bvn: { type: String },
        name: { type: String },
        claimedAt: { type: Date },
    },
}, {
    timestamps: true,
});

export default mongoose.models.GiftClaim || mongoose.model('GiftClaim', GiftClaimSchema);
