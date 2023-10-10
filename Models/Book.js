const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://lavanurutarak:tarak@cluster0.srruvyp.mongodb.net/bookstore')

const bookSchema = new mongoose.Schema({
  image:String,
  title: String,
  author: String,
  ISBN: {type:String, unique:true},
  price: Number,
  quantity: Number,
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
});

module.exports = mongoose.model('Book', bookSchema);
