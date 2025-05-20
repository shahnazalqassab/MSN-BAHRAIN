const mongoose = require('mongoose')

// THE APPLICATION SCHEMA
const AdsSchema = new mongoose.Schema(
  {
    // properties of Ads
    img: { type: String },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, enum: ['books', 'phones', 'cars', 'spare parts'] }
  },
  { timestamps: true }
)

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  contactNo: { type: Number, required: true },
  email: { type: String, required: true },
  profile: { type: String, required: true},
  Ads: [AdsSchema]
})

const User = mongoose.model('User', userSchema)

module.exports = User
