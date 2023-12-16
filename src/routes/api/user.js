const express = require("express");
const router = express.Router();

const productController = require("../../controllers/user/productController");
const authController = require("../../controllers/user/authController");
const orderController = require("../../controllers/user/orderController");
const categoryController = require("../../controllers/user/categoryController");
const rateController = require("../../controllers/user/rateController");

router.get("/products/sale", productController.getProductSale);
router.get("/products/top", productController.getProductTop);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/authenticate/:token", authController.authLogin);

router.post("/order", orderController.addOrder);
router.get("/order_wait/:user_id", orderController.getOrderWait);
router.get("/order_ship/:user_id", orderController.getOrderShip);
router.get("/order_complete/:user_id", orderController.getOrderComplete);
router.get("/order_cancel/:user_id", orderController.getOrderCancel);
router.get("/action_cancel_order/:order_id", orderController.handleCancelOrder);
router.get(
  "/handle_confirm_order/:order_id",
  orderController.handleUpdateConfirm
);

router.get("/products/detail/:id", productController.getProductDetail);

router.get(
  "/products/search/:product_name",
  productController.getProductSearch
);

router.get("/categories/:category_id", categoryController.getProductCategory);
router.get("/categories", categoryController.getCategory);

router.get("/user/:user_id", authController.getUser);

router.get("/rate/:order_id/:user_id", rateController.getProductRate);
router.post("/rate", rateController.handleRate);

module.exports = router;
