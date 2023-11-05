const Book = require("../Models/Book");
const Review = require("../Models/Review");

exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find().populate("reviews");
    const admin = req.session.Admin;
    res.render("Index", { books, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.getSingleBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId).populate("reviews");
    console.log(book);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
    req.session.book = book;
    req.session.ISBN = book.ISBN;
    req.session.Id = book._id;
    const admin = req.session.Admin;
    res.render("books", { book, admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.AddBook = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.send("Login into the account");
    }
    if (req.session.user.isAdmin == false) {
      return res.send("Only Admins can view this page");
    }
    res.render("AddBook");
  } catch (err) {
    res.send(err);
  }
};
exports.addBook = async (req, res) => {
  try {
    const bookData = req.body;
    const existingBook = await Book.findOne({ ISBN: bookData.ISBN });
    if (existingBook) {
      existingBook.quantity += bookData.quantity;
      await existingBook.save();
      res.json({
        success: true,
        message: "Book quantity updated successfully",
        bookId: existingBook._id,
      });
    } else {
      const book = new Book(bookData);
      await book.save();
      res.json({
        success: true,
        message: "Book added successfully",
        bookId: book._id,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ success: false, message: "Invalid input" });
  }
};

exports.UpdateBook = async (req, res) => {
  const bookId = req.session.Id;
  res.render("UpdateBook", { bookId });
};
exports.updateBook = async (req, res) => {
  const { newtitle, newauthor, newquantity, newprice } = req.body;
  let ISBN = req.session.ISBN;
  console.log(ISBN);
  ISBN = { ISBN };
  const book = await Book.findOne(ISBN);
  try {
    if (book) {
      if (newtitle) {
        book.title = newtitle;
      }
      if (newauthor) {
        book.author = newauthor;
      }
      if (newquantity) {
        book.quantity = newquantity;
      }
      if (newprice) {
        book.price = newprice;
      }
      await book.save();
      const admin = req.session.Admin;
      res.render("books", { book, admin });
    } else {
      console.error("Book not found");
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.deleteBook = async (req, res) => {
  await Book.findByIdAndRemove(req.params.bookId);
  const admin = req.session.Admin;
  res.redirect("books", { admin });
};

exports.review = (req, res) => {
  const book = req.session.book;
  res.render("Review", { book });
};
exports.addReview = async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found" });
    }

    const review = new Review(req.body);
    review.book = book._id;
    await review.save();

    book.reviews.push(review._id);
    await book.save();

    res.json({ success: true, message: "Review added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const mongoose = require("mongoose");

exports.searchBooks = async (req, res) => {
  try {
    const query = req.query.query;
    console.log(query);
    let filter = {};

    if (query) {
      if (mongoose.Types.ObjectId.isValid(query)) {
        filter._id = mongoose.Types.ObjectId(query);
      } else {
        filter.$or = [
          { title: { $regex: query, $options: "i" } },
          { author: { $regex: query, $options: "i" } },
        ];
      }
    } else {
      console.log("Error");
    }
    const books = await Book.find(filter);
    req.session.books = books;
    res.render("Index", { books, admin });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
exports.index = async (req, res) => {
  const books = req.session.books;
  const admin = req.session.Admin;
  res.render("Index", { books, admin });
};
