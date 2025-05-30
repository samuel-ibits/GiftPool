import mongoose from "mongoose";

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  username: { type: String },
});

export const Profile =
  mongoose.models.Profile || mongoose.model("Profile", ProfileSchema);
