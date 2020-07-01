require('dotenv').config()
const db = require('../data/db')
const BaseModel = require('./base')
const userMediaSchema = require('./schemas/userMedia')

const { Schema } = db

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['artist', 'contractor', 'admin'] },
  name: { type: String, required: true },  
  access_token: { type: String, required: true, select: false },
  media: userMediaSchema,
  first_name: { type: String },
  last_name: { type: String },
  accept_terms: { type: Boolean },  
  verification_token: { type: String, select: false },
  is_verified: { type: Boolean, default: false },
  reset_token: { type: String, select: false },
  reset_token_expiry: { type: Date },
  facebook_id: { type: String},
  google_id: { type: String },
  artist: {
    type: db.Schema.Types.ObjectId,
    ref: 'Artist'
  },
  contractor: {
    type: db.Schema.Types.ObjectId,
    ref: 'Contractor'
  },
  date_created: { type: Date, default: Date.now },
  date_updated: { type: Date },
})

class User extends BaseModel {
  constructor() {
    super()    
  }

  static findFromCredentials({ email, password }) {
    return this.findOne({ email, password })
  }

  static fetchdById(id) {
    return this.findById(id)      
      .populate('artist')
      .populate('contractor')      
  }

  static fetchWithSensitiveDataById(id) {
    return this.findById(id)
      .select('+password +access_token +verification_token')
      .populate('artist')
      .populate('contractor')
  }

  static fetchWithSensitiveData(conditions) {    
    return this.findOne(conditions)
      .select('+password +access_token +verification_token')
      .populate('artist')
      .populate('contractor')      
  }

  generateVerificationUrl() {
    return `${process.env.WEB_URL}/register/verify/${this.verification_token}`
  }

  generateResetPasswordUrl() {
    return `${process.env.WEB_URL}/reset/password/${this.verification_token}`
  }

  getRoleId() {
    console.log('Getting role id...')
    if (this.role === 'artist') {      
      console.log(this.artist.id)
      return this.artist.id
    }

    if (this.role === 'contractor') {
      return this.contractor.id
    }

    return null
  }
}

// https://mongoosejs.com/docs/api.html#schema_Schema-loadClass
userSchema.loadClass(User)
module.exports = db.model('User', userSchema)
