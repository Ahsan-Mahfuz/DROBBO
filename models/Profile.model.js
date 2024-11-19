import mongoose from 'mongoose'

const profileSchema = new mongoose.Schema(
  {
    profilePicture: { type: String },
    email: { type: String },
    username: { type: String },
  },
  { timestamps: true }
)
const ProfileModel = mongoose.model('PROFILE', profileSchema)

export default ProfileModel
