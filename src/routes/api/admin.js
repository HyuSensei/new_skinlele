const express = require("express");
const router = express.Router();

const authController = require("../../controllers/admin/authentication/authController");
const userController = require("../../controllers/admin/userController");
const productController = require("../../controllers/admin/productController");
const categoryController = require("../../controllers/admin/categoryController");
const roleController = require("../../controllers/admin/roleController");
const orderController = require("../../controllers/admin/orderController");
const rateController = require("../../controllers/admin/rateController");
const order_productController = require("../../controllers/admin/order_productController");
const middleware = require("../../middleware/JWTAction");
const upload = require("../../middleware/UploadImg");

//router.all("*", middleware.checkLogin);

router.post("/register", authController.registerUser);
router.post("/login", authController.loginUser);
router.post("/loginAdmin", authController.loginAdmin);
router.get("/logoutAdmin", authController.logoutAdmin);
router.get("/logout", authController.logoutUser);

router.get("/users", userController.indexUser);
router.get("/users/:id", userController.showUser2);
router.get("/users/create", userController.createUser);
router.post("/users", userController.searchByUserName);
router.get("/users/update", userController.editUser);
router.post("/users/update", userController.updateUser);
router.delete("/users/:id", userController.destroyUser);

router.post("/products/create", productController.storeProduct);
router.get("/products", productController.indexProduct);
router.get("/products/:id", productController.showProduct);
router.post("/products/update", productController.updateProduct);
router.post("/products/update", productController.updateProduct);
router.get("/products/delete/:id", productController.destroyProduct);
router.post("/products/getbyname", productController.getProductByName);

router.get("/categories", categoryController.indexCategory);
router.get("/categories/sale", categoryController.getCategoriesSale);

router.get("/role", roleController.indexRole);
router.get("/role/:id", roleController.roleById);
router.get("/order", orderController.indexOrder);

router.get("/statistics", orderController.getStatistics);
router.get("/statisticsByMonht", orderController.getStatisticsByMonht);
router.get("/statisticsByYear", orderController.getStatisticsByYear);

router.post("/order", orderController.handleOrder);
router.get("/orderConfirm/:UserId", orderController.orderConfirm);
router.get("/orderShip/:UserId", orderController.orderShip);
router.get("/orderComplete/:UserId", orderController.orderComplete);
router.get("/orderRate/:userId/:orderId", orderController.viewRateOrder);
router.post("/rateOrder", rateController.handleRate);
router.get("/updateStatusOrder/:orderId", orderController.updateStatus);
router.get("/updateStatusOrder/confirm/:orderId", orderController.handConfirm);
router.delete("/deleteOrder/:orderId", orderController.deleteOrder);
// order product desc
router.get("/order_product/desc", order_productController.getAllByDESC);
router.get("/order_product", order_productController.getAll);
router.get(
  "/order_product/limit/:currentPage",
  order_productController.getAllLimit
);
//rate admin
router.get("/allCountRate", rateController.getAllCountRate);
router.get("/allProductRate", productController.getAllRateProduct);

router.get("/starDetailProdouct/:productId", rateController.getRate);

//dung de phan trang
router.get("/prodouct/count", productController.getCountProduct);
router.get("/prodouct/limit/:currentPage", productController.getProductLimit);
router.get("/user/limit/:currentPage", userController.getUserLimit);
module.exports = router;