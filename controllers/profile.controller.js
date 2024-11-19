import { fileURLToPath } from 'url'
import ProfileModel from '../models/Profile.model.js'
import AuthModel from '../models/Auth.model.js'
import path from 'path'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const profileAdd = async (req, res) => {
  try {
    const { profilePicture } = req.body
    const email = req.user.email
    const user = await AuthModel.findOne({ email })
    const findAndDel = await ProfileModel.findOne({ email })

    if (findAndDel) {
      const deletePic = await ProfileModel.findByIdAndDelete(findAndDel._id)
      if (!findAndDel)
        res.status(400).json({ message: 'Error to delete picture' })
    }

    if (!profilePicture) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const uploadDir = path.resolve(__dirname, '..', 'profilePicture')

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    let fileName
    try {
      const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      fileName = `${Date.now()}.png`
      fs.writeFileSync(path.join(uploadDir, fileName), buffer)
      fileName = `profilePicture/${fileName}`
    } catch (error) {
      console.error('Error saving image:', error.message)
      return res
        .status(500)
        .json({ message: 'Error saving image', error: error.message })
    }

    const profile = await ProfileModel.create({
      profilePicture: fileName,
      username: user.username,
      email: email,
    })

    if (!profile) {
      return res
        .status(400)
        .json({ message: 'Profile picture not added. Some problem occurred' })
    }

    res
      .status(200)
      .json({ message: 'Profile picture added successfully', profile })
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error Adding Profile Picture', error: error.message })
  }
}

const profileShow = async (req, res) => {
  try {
    const email = req.user.email
    const profile = await ProfileModel.findOne({ email }).sort({
      createdAt: -1,
    })
    if (email === profile.email)
      res.status(200).json({ profilePicture: profile.profilePicture })
    else {
      res.status(200).json('')
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error ' + error.message })
  }
}

export { profileAdd, profileShow }
