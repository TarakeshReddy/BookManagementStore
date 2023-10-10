const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lavanurutarak:tarak@cluster0.srruvyp.mongodb.net/bookstore')
const reviewSchema = new mongoose.Schema({
  comment: String,
  rating: Number,
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
});

module.exports = mongoose.model('Review', reviewSchema);
