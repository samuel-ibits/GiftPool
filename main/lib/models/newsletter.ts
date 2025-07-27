import mongoose, { Schema, Document, models, model } from 'mongoose';

export interface INewsletter extends Document {
    email: string;
    unsubscribe: boolean;
}

const NewsletterSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    unsubscribe: {
        type: Boolean,
        default: false,
    },
});

// Prevent OverwriteModelError
export default models.Newsletter
    ? (models.Newsletter as mongoose.Model<INewsletter>)
    : model<INewsletter>('Newsletter', NewsletterSchema);
