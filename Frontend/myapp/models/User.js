// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  userName: { type: String },
  emailId: { type: String, required: true },
  fullName: { type: String, required: true },
  streams: [{
    streamId: String,
    streamKey: String,
    playbackUrl: String,
    playbackId: String,
    createdAt: Date,
    status: String,
    streamTitle: String, // Add this line to include streamTitle
  }],
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
