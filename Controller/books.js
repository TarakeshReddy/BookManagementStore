const Book = require('../Models/Book');
const Review = require('../Models/Review');

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate('reviews');
    const user = req.session.user
    res.render('Index', { books,user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate('reviews');
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
    req.session.book = book
    const user = req.session.user
    req.session.Id = book._id
    res.render('books', { book,user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.AddBook = async(req, res) => {
  try{
    if(!req.session.user){
      return res.send("Login into the account")
    }
    if(req.session.user.isAdmin==false){
      return res.send("Only Admins can view this page")
    }
    res.render('AddBook')
  }
 catch(err){
  res.send(err)
 }
}
exports.addBook = async (req, res) => {
  try {
    const bookData = req.body; 
    req.session.ISBN = bookData.ISBN;
    const existingBook = await Book.findOne({ ISBN: bookData.ISBN });
    if (existingBook) {
      existingBook.quantity += bookData.quantity;
      await existingBook.save();
      res.json({ success: true, message: 'Book quantity updated successfully', bookId: existingBook._id });
    } else {
      const book = new Book(bookData);
      await book.save()
    res.json({ success: true, message: 'Book added successfully', bookId: book._id });
    }
   } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: 'Invalid input' });
  }
};


exports.UpdateBook = async (req, res) => {
  const bookId = req.session.Id
  console.log(bookId)
  res.render('UpdateBook', { bookId });
}
exports.updateBook = async (req, res) => {
  const {newtitle,newauthor,newprice} = req.body
  const ISBN = req.session.ISBN
  const book = await Book.findOne(ISBN)
  try{
  if(book){
    if(newtitle){
      book.title = newtitle
    }
    if(newauthor){
      book.author = newauthor
    }
    if(newprice){
      book.price = newprice
    }
    await book.save()
    res.render('books',{book})
  } 
  else{
      console.error('Book not found');
      return res.status(404).json({ success: false, message: 'Book not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


exports.deleteBook = async (req,res) => {
  await Book.findByIdAndRemove(req.params.bookId);
  res.redirect('/get-AllBooks');
}


exports.review = (req, res) => {
  const book = req.session.book
  res.render('Review',{book})
}
exports.addReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const review = new Review(req.body);
    review.book = book._id; 
    await review.save();

    book.reviews.push(review._id); 
    await book.save();

    res.json({ success: true, message: 'Review added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


const mongoose = require('mongoose');

exports.searchBooks = async (req, res) => {
  try {
    const query = req.query.query;
    let filter = {};

    if (query) {

      if (mongoose.Types.ObjectId.isValid(query)) {
        filter._id = mongoose.Types.ObjectId(query);
      } else {
      
        filter.$or = [
          { title: { $regex: query, $options: 'i' } },
          { author: { $regex: query, $options: 'i' } },
        ];
      }
    }
    const books = await Book.find(filter).populate('reviews');
    req.session.books = books
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.index = async(req,res) =>
{
  const books = req.session.books
  res.render("Index",{books})
}


