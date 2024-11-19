import AuthModel from '../models/Auth.model.js'
import bcrypt from 'bcrypt'
import getTokenAndSetCookies from '../utils/getTokenAndSetCookies.js'

const signUp = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = await AuthModel.findOne({ email })
    if (user)
      return res.status(400).json({ message: 'Already Have any account' })
    const hashPassword = await bcrypt.hash(password, 10)
    const newUser = await AuthModel.create({
      username,
      email,
      password: hashPassword,
    })
    if (!newUser)
      return res.status(400).json({ message: 'User is not created' })
    res.status(201).json({ message: 'User is created' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await AuthModel.findOne({ email })
    if (!user)
      return res
        .status(400)
        .json({ message: `Don't have an account. Please SignUp` })
    const isPassRight = await bcrypt.compare(password, user.password)
    if (!isPassRight)
      return res.status(400).json({ message: `Password wrong ` })
    const token = getTokenAndSetCookies(user._id, email, res)
    res.status(200).json({
      username: user.username,
      token,
      email,
      message: 'Successfully Login',
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
const logout = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 })
    res.status(200).json({ message: 'Successfully Logout' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

export { signUp, login, logout }
