const User = require("../Models/User");
const bcrypt = require("bcrypt");

exports.verifyAdminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingEmail = await User.findOne({ email });

    if (!existingEmail || existingEmail.isAdmin == false) {
      return res.status(401).json({ error: "Invalid email" });
    }

    const isPasswordValid = bcrypt.compare(password, existingEmail.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.user = existingEmail;
    if (existingEmail) {
      req.session.Admin = true;
    }
    return res.redirect("/admin-profile");
  } catch (err) {
    console.error("Error in verifying login:", err);
    return res.redirect("/admin-login");
  }
};

exports.adminLogin = async (req, res) => {
  try {
    return res.render("admin", {});
  } catch (err) {}
};
exports.getAdminProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/admin-login");
    }

    res.render("admin-profile", { user_details: req.session.user });
  } catch (err) {
    console.error("Error in loading admin profile:", err);
    res.redirect("/admin-login");
  }
};
