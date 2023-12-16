const apiAuth = require("../api/user/apiAuth");
const apiCategory = require("../api/user/apiCategory");

const checkAuth = async (req, res) => {
  let cookie = req.cookies;
  let erro = req.flash("erro");
  if (cookie && cookie.token) {
    let token = cookie.token;
    let check = await apiAuth.handleAuth(token);
    if (check.detail) {
      return res.render("user/login.ejs", { erro: erro });
    }
    return res.redirect("/");
  } else {
    return res.render("user/login.ejs", { erro: erro });
  }
};

const checkRequireLogin = async (req, res, next) => {
  let cookie = req.cookies;
  let erro = req.flash("erro");
  if (cookie && cookie.token) {
    let token = cookie.token;
    let check = await apiAuth.handleAuth(token);
    if (check.detail) {
      return res.render("user/login.ejs", { erro: erro });
    }
    next();
  } else {
    return res.render("user/login.ejs", { erro: erro });
  }
};

const getAllCategory = async (req, res, next) => {
  let data = await apiCategory.getCategory();
  res.locals.category1 = data.category1;
  res.locals.category2 = data.category2;
  next();
};

module.exports = {
  checkAuth,
  checkRequireLogin,
  getAllCategory,
};
