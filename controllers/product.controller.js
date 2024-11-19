import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import ProductModel from '../models/product.model.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const addProduct = async (req, res) => {
  try {
    const { productTitle, productPrice, productDescription, productImage } =
      req.body
    const email = req.user.email

    if (
      !productTitle ||
      !productPrice ||
      !productDescription ||
      !productImage
    ) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    const uploadDir = path.resolve(__dirname, '..', 'uploads') // This will resolve to 'project-root/uploads'

    // Create the uploads directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    let fileName
    try {
      const base64Data = productImage.replace(/^data:image\/\w+;base64,/, '')
      fileName = `${Date.now()}.png` // Save with the timestamp as the filename

      // Save the file in the correct uploads directory at the root level
      fs.writeFileSync(path.join(uploadDir, fileName), base64Data, 'base64')

      // Return the file path as part of the response (optional)
      fileName = `uploads/${fileName}`
    } catch (err) {
      return res
        .status(500)
        .json({ message: 'Error saving image', error: err.message })
    }

    const product = await ProductModel.create({
      email,
      productTitle,
      productPrice,
      productDescription,
      productImage: fileName,
    })

    if (!product) {
      return res
        .status(400)
        .json({ message: 'Product not added. Some problem occurred' })
    }

    res.status(200).json({ message: 'Product added successfully', product })
  } catch (error) {
    console.error('Error adding product:', error)
    res
      .status(500)
      .json({ message: 'Error adding product', error: error.message })
  }
}

const showProduct = async (req, res) => {
  try {
    const product = await ProductModel.find()
    if (product.length === 0) {
      return res.status(404).json({ message: 'No products found' })
    }
    const email = req.user.email
    res.status(200).json({ product: product, email: email })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error ' + error.message })
  }
}
const showProductByID = async (req, res) => {
  try {
    const { id } = req.params
    const product = await ProductModel.findById(id)
    res.status(200).json({ product: product })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error ' + error.message })
  }
}
const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Invalid Product ID' })
    }
    const email = req.user.email
    const product = await ProductModel.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (product.email !== email) {
      return res
        .status(403)
        .json({ message: 'You are not authorized to update this product' })
    }
    const { productTitle, productPrice, productDescription } = req.body
    if (!productTitle || !productPrice || !productDescription) {
      return res.status(400).json({ message: 'All fields are required' })
    }
    const updatedProduct = await ProductModel.findByIdAndUpdate(
      productId,
      { productTitle, productPrice, productDescription },
      { new: true }
    )
    res.status(200).json({
      message: 'Product updated successfully',
      product: updatedProduct,
    })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + error.message })
  }
}
const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params
    if (!productId || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ message: 'Enter valid Product ID' })
    }
    const email = req.user.email
    let product = await ProductModel.findById(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product not found' })
    }
    if (email !== product.email) {
      return res.status(403).json({ message: 'Unauthorized to delete product' })
    }
    product = await ProductModel.findByIdAndDelete(productId)
    if (!product) {
      return res.status(404).json({ message: 'Product is not deleted' })
    }
    res.status(201).json({ message: 'Product successfully deleted' })
  } catch (error) {
    res.status(500).json({ message: 'Internal server error: ' + error.message })
  }
}

export {
  addProduct,
  showProduct,
  updateProduct,
  deleteProduct,
  showProductByID,
}
