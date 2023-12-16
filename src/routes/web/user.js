const express = require("express");
const router = express.Router();
const apiProduct = require("../../api/user/apiProduct");
const apiAuth = require("../../api/user/apiAuth");
const apiOrder = require("../../api/user/apiOrder");
const apiCategory = require("../../api/user/apiCategory");
const apiRate = require("../../api/user/apiRate");
const cart = require("../../cart/cart");
const middleware = require("../../middleware/middleware");

router.get("/", middleware.getAllCategory, apiProduct.getProductHome);

router.get("/login", middleware.getAllCategory, middleware.checkAuth);
router.get("/register", middleware.getAllCategory, (req, res) => {
  let erro = req.flash("erro");
  let success = req.flash("success");
  res.render("user/register.ejs", { success, erro });
});
router.post("/login", apiAuth.handleLogin);
router.post("/register", apiAuth.handleRegister);
router.get("/logout", (req, res) => {
  res.cookie("token", "", { maxAge: 0 });
  res.cookie("UserId", "", { maxAge: 0 });
  return res.redirect("/login");
});

router.get(
  "/detail/:id",
  middleware.getAllCategory,
  apiProduct.getProductDetail
);

router.get("/addCart/:product_id", cart.handleAddCart);
router.get("/viewCart", middleware.getAllCategory, (req, res) => {
  let erro = req.flash("erro");
  let success = req.flash("success");
  let carts = req.session.cart;
  return res.render("user/cart.ejs", { carts, success, erro });
});
router.get("/deleteCart/:id", cart.deleteCart);
router.get("/increaseCart/:id", cart.upCart);
router.get("/decreaseCart/:id", cart.deCart);

router.post("/order", middleware.checkRequireLogin, apiOrder.order);
router.get(
  "/order_wait/:user_id",
  middleware.checkRequireLogin,
  middleware.getAllCategory,
  apiOrder.getOrderWait
);
router.get(
  "/order_ship/:user_id",
  middleware.checkRequireLogin,
  middleware.getAllCategory,
  apiOrder.getOrderShip
);
router.get(
  "/order_complete/:user_id",
  middleware.checkRequireLogin,
  middleware.getAllCategory,
  apiOrder.getOrderComplete
);
router.get(
  "/order_cancel/:user_id",
  middleware.checkRequireLogin,
  middleware.getAllCategory,
  apiOrder.getOrderCancel
);
router.get(
  "/action_confirm_order/:order_id",
  middleware.checkRequireLogin,
  apiOrder.handleConfirmOrder
);
router.get(
  "/action_cancel_order/:order_id",
  middleware.checkRequireLogin,
  apiOrder.handleCancelOrder
);

router.get("/search", middleware.getAllCategory, apiProduct.getProductSearch);

router.get(
  "/categories/skincare/:category_id",
  middleware.getAllCategory,
  apiCategory.getCategorySkinCare
);
router.get(
  "/categories/makeup/:category_id",
  middleware.getAllCategory,
  apiCategory.getCategoryMakeUp
);

router.get(
  "/user/:user_id",
  middleware.getAllCategory,
  middleware.checkRequireLogin,
  apiAuth.getUser
);

router.get(
  "/rate/order=:order_id/user=:user_id",
  middleware.getAllCategory,
  middleware.checkRequireLogin,
  apiRate.productRate
);

router.post(
  "/rate",
  middleware.getAllCategory,
  middleware.checkRequireLogin,
  apiRate.handleRate
);

module.exports = router;
