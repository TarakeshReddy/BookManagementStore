const Cart = require("../Models/Cart");
exports.displaycart = async (req, res) => {
  try {
    if (!req.session.user) {
      res.redirect("/login");
      return;
    }
    const userId = req.session.user._id;
    let totalPrice = 0;

    const cartItems = await Cart.find({ userId }).exec();
    if (!cartItems) {
      console.error("No cart items found for user:", userId);
      res.status(404).json({ success: false, message: "No cart items found." });
      return;
    }

    for (const cartItem of cartItems) {
      totalPrice += cartItem.price * cartItem.quantity;
    }

    res.render("DisplayCart", { shoppingCart: cartItems, totalPrice });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const book = req.session.book;
    const user = req.session.user;
    if (!user) {
      res.redirect("/login");
    }
    const userId = user._id;
    const image = book.image;
    const bookId = book._id;
    const quantity = 1;
    const price = book.price;
    const title = book.title;
    if (!book) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found." });
    }
    let cartItem = await Cart.findOne({ userId, bookId });
    if (!cartItem) {
      cartItem = new Cart({ image, title, price, userId, bookId, quantity });
    } else {
      cartItem.quantity += parseInt(quantity, 10);
    }
    await cartItem.save();
    res.redirect("/displaycart");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const userId = req.session.user._id;
    const cartItem = await Cart.findOne({ userId, bookId });
    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found in cart." });
    }
    const newQuantity = cartItem.quantity + parseInt(quantity, 10);
    console.log("quant", newQuantity);
    if (isNaN(newQuantity)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity value." });
    }
    cartItem.quantity = newQuantity;
    if (cartItem.quantity > 0) {
      await cartItem.save();
    }
    res.redirect("/displaycart");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.session.user._id;

    const cartItem = await Cart.findOne({ userId, bookId });

    if (!cartItem) {
      return res
        .status(404)
        .json({ success: false, message: "Book not found in cart." });
    }
    const cartItemDoc = cartItem.toObject(); //we can use findbyidandremove method
    await Cart.deleteOne({ _id: cartItemDoc._id });
    res.redirect("/displaycart");
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
