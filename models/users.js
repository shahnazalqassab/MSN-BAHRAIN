const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  contactNo: { type: Number, required: true },
  email: { type: String, required: true },
  profile: { type: String, required: true },
  category: { type: String, enum: ['Admin', 'Seller', 'Buyer'] },
},
{
  timestamps: true
});

const User = mongoose.model('User', userSchema)
module.exports = User;