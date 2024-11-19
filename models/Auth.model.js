import mongoose from 'mongoose'

const authSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, minLength: 3 },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minLength: 6 },
  },
  { timestamps: true }
)
const AuthModel = mongoose.model('USER', authSchema)
export default AuthModel
