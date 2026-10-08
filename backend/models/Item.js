const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['Men', 'Women', 'Kids', 'Unisex', 'Accessories'] 
  },
  size: { 
    type: String, 
    required: true, 
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'] 
  },
  brand: { type: String, required: true },
  condition: { 
    type: String, 
    required: true, 
    enum: ['Brand New with Tags', 'Like New', 'Gently Used', 'Good'] 
  },
  estimatedValue: { type: Number, required: true },
  images: [{ type: String, required: true }],
  location: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Swap Pending', 'Swapped'], 
    default: 'Available' 
  },
  owner: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);