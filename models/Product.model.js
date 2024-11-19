import mongoose from 'mongoose'
const productSchema = new mongoose.Schema(
  {
    email: { type: String, required: true },
    productTitle: { type: String, required: true },
    productPrice: { type: Number, required: true },
    productDescription: { type: String, required: true },
    productImage: { type: String, default: null },
  },
  { timestamps: true }
)

const ProductModel = mongoose.model('PRODUCT', productSchema)
export default ProductModel
