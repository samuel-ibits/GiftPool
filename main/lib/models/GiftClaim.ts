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
        account: { type: String, default: '' },
        claimedAt: { type: Date },
    },
}, {
    timestamps: true,
});

export default mongoose.models.GiftClaim || mongoose.model('GiftClaim', GiftClaimSchema);
