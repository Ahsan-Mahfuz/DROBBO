import mongoose from 'mongoose'

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL)
    console.log('Connected to MongoDB')
  } catch (error) {
    console.log('Internal error: ' + error.message)
  }
}

export default dbConnection
