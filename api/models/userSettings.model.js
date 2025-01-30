import { mongoose } from 'mongoose';

const userSettingsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to User model
    required: true,
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light', // Default to light mode
  },
}, { timestamps: true });

const UserSettings = mongoose.model('UserSettings', userSettingsSchema);
export default UserSettings;
