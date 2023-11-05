const User = require("../Models/User");
const bcrypt = require("bcrypt");

exports.Signup = async (req, res) => {
  res.render("Signup");
};
exports.signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // New User
    const newUser = new User({ email, password: hashedPassword, username });
    await newUser.save();

    res.redirect("/login");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed" });
  }
};

exports.Login = (req, res) => {
  res.render("Login");
};
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }); // Checking the user
    if (!user) {
      return res.status(401).json({ message: "User Not Found" });
    }

    // Validating the password
    const passwordMatch = bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect Email or Password" });
    }

    req.session.user = user;
    req.session.email = email;
    if (user) {
      req.session.User = true;
    }

    // const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
    // res.cookie('token', token, {httpOnly: true,})
    res.redirect("/profile");
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(500).json({ message: "Authentication failed" });
  }
};
exports.Updateprofile = async (req, res) => {
  try {
    const user1 = req.session.user;
    console.log(user1);
    if (!user1) {
      res.status(401).json({ message: "User not authenticated" });
    }

    const { newUsername, newpassword } = req.body;
    const user = await User.findOne({ email: user1.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (newUsername) {
      user.username = newUsername;
    }
    if (newpassword) {
      user.password = await bcrypt.hash(newpassword, 10);
      console.log(newpassword);
    }
    req.session.user = user; // updating user session
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Profile update failed" });
  }
};
exports.profile = (req, res) => {
  const user = req.session.user;
  if (!user) {
    res.redirect("/login");
    return;
  }
  res.render("Profile", { user });
};
exports.update = async (req, res) => {
  res.render("Updateprofile");
};
