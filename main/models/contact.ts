import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
    {
        name: { type: String, },
        email: { type: String, required: true },
        message: { type: String, required: true },
        subject: { type: String, },
        phonenumber: { type: String, },
        source: { type: String, enum: ['landing', 'support', 'other'], default: 'other' },
    },
    { timestamps: true }
);

export const Contact =
    mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
