const express = require("express");
const Router = express.Router();

const adminController = require("../Controller/admin");
Router.post("/verify-admin-login", adminController.verifyAdminLogin);

Router.get("/admin-login", adminController.adminLogin);
Router.get("/admin-profile", adminController.getAdminProfile);

const userController = require("../Controller/user");
Router.get("/register", userController.Signup);
Router.post("/signup", userController.signup);
Router.get("/login", userController.Login);
Router.post("/login", userController.login);
Router.get("/profile", userController.profile);
Router.get("/updateprofile", userController.update);
Router.post("/profile/update", userController.Updateprofile);

const booksController = require("../Controller/books");

Router.get("/get-AllBooks", booksController.getAllBooks);
Router.get("/books/:bookId", booksController.getSingleBook);
Router.get("/get-add-book", booksController.AddBook);
Router.post("/addbook", booksController.addBook);
Router.get("/update", booksController.UpdateBook);
Router.put("/books/update/:bookId", booksController.updateBook);
Router.get("/deleteBook/:bookId", booksController.deleteBook);
Router.get("/review", booksController.review);
Router.post("/books/:bookId/reviews", booksController.addReview);
Router.post("/search", booksController.searchBooks);
Router.get("/index1", booksController.index);

const cartController = require("../Controller/cart");
Router.get("/addcart", cartController.addToCart);
Router.get("/displaycart", cartController.displaycart);

Router.post("/cart/update/:bookId", cartController.updateCartItem);
Router.get("/cart/:bookId", cartController.removeFromCart);

module.exports = Router;
