import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  image: {
    type: String,
    required: true,
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    required: true,
    enum: ['rings', 'necklaces', 'earrings', 'bracelets'],
  },
  badge: {
    type: String,
    enum: ['Yeni', 'İndirim', 'Popüler'],
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviews: {
    type: Number,
    default: 0,
    min: 0,
  },
  description: {
    type: String,
    trim: true,
  },
  specifications: {
    material: String,
    weight: String,
    dimensions: String,
  },
  stock: {
    type: Number,
    default: 0,
    min: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
  }
}, {
  timestamps: true,
})

// Index'ler
ProductSchema.index({ category: 1 })
ProductSchema.index({ price: 1 })
ProductSchema.index({ rating: -1 })
ProductSchema.index({ featured: -1 })

// Slug otomatik oluştur
ProductSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }
  next()
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)