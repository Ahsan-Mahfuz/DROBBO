import {
  addProduct,
  showProduct,
  showProductByID,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js'
import express from 'express'
import authMiddleware from '../middlewares/authMiddleware.js'

const productRoute = express.Router()

productRoute.post('/add-product', authMiddleware, addProduct)
productRoute.get('/show-product', authMiddleware, showProduct)
productRoute.get('/show-product/:id', authMiddleware, showProductByID)
productRoute.put('/update-product/:productId', authMiddleware, updateProduct)
productRoute.delete('/delete-product/:productId', authMiddleware, deleteProduct)

export default productRoute
