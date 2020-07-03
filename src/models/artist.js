require('dotenv').config()
const db = require('../data/db')
const BaseModel = require('./base')

const addressSchema = require('./schemas/address')
const socialSchema = require('./schemas/media')
const productsSchema = require('./schemas/product')
const productItemsSchema = require('./schemas/productItem')
const productItemSelectionSchema = require('./schemas/productItemSelection')

const { Schema } = db

const artistSchema = new Schema({
  user :{
    type: db.Schema.Types.ObjectId,
    ref: 'User'
  },

  company_name: { type: String },
  document: { type: String },
  phone: { type: String },
  story: { type: String },
  media: {
    bg: { type: String },
    presentations: [String]
  },
  category: {
    name: { type: String },
    subcategories: [String]
  },

  products: [productsSchema],

  tags: [String],
  social: [socialSchema],
  address: addressSchema
})

class Artist extends BaseModel {
  constructor() {
    super()
  }
}

artistSchema.index({ company_name: 'text', story: 'text', 'category.name': 'text', 'category.subcategory': 'text', tags: 'text' });
artistSchema.loadClass(Artist)
module.exports = db.model('Artist', artistSchema)
