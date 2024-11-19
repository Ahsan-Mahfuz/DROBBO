import jwt from 'jsonwebtoken'
const getTokenAndSetCookies = (userId, email, res) => {
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  })
  res.cookie('jwt', token, {
    maxAge: 1 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: 'None',
    secure: process.env.NODE_ENV === 'production',
  })
  return token
}

export default getTokenAndSetCookies
