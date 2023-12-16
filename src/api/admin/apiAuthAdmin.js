const jwt = require("jsonwebtoken");
require("dotenv").config();
const axios = require("axios");

const verifyToken = (token) => {
  let decoded = null;
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};
const loginAdmin = async (req, res) => {
  let cookie = req.cookies;
  let erro = req.flash("erro");
  if (cookie && cookie.jwtadmin) {
    let token = cookie.jwtadmin;
    let decoded = verifyToken(token);
    if (decoded) {
      res.cookie("adminUserId", decoded.id, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      let getUser = await axios.get(
        process.env.BASE_URL + `users/${decoded.id}`
      );
      console.log(getUser.data);
      res.cookie("adminname", getUser.data.name, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("adminusername", getUser.data.username, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("adminphone", getUser.data.phone, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("adminemail", getUser.data.email, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("adminaddress", getUser.data.address, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res.redirect("/admin");
    } else {
      return res.render("admin/loginAdmin.ejs", { erro });
    }
  } else {
    return res.render("admin/loginAdmin.ejs", { erro });
  }
};
const handleLoginAdmin = async (req, res) => {
  try {
    let data = await axios.post(process.env.BASE_URL + `loginAdmin`, req.body);
    if (data.data.success == false) {
      req.flash("erro", `${data.data.message}`);
    } else {
      req.flash("success", `${data.data.message}`);
      res.cookie("adminUserId", data.data.user.id, {
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("jwtadmin", data.data.token, {
        maxAge: 24 * 60 * 60 * 1000,
      });
    }
    console.log(data.data);
    return res.redirect("/loginAdmin");
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  loginAdmin,
  handleLoginAdmin,
};
