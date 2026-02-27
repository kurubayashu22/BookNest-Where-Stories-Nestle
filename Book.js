const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  genre: {
    type: String,
    required: true,
    enum: ['Fiction', 'Non-Fiction', 'Mystery', 'Science Fiction', 'Fantasy', 
           'Romance', 'Thriller', 'Biography', 'History', 'Self-Help', 'Poetry',
           'Young Adult', 'Children\'s', 'Business', 'Science', 'Other']
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  publisher: {
    type: String,
    required: true
  },
  publicationYear: {
    type: Number,
    required: true
  },
  pages: {
    type: Number,
    required: true
  },
  language: {
    type: String,
    required: true,
    default: 'English'
  },
  coverImage: {
    type: String,
    default: 'https://via.placeholder.com/300x400?text=Book+Cover'
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: Number,
    comment: String,
    date: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add text index for search functionality
bookSchema.index({ title: 'text', author: 'text', description: 'text' });

module.exports = mongoose.model('Book', bookSchema);