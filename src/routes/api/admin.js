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

//router.all("*", middleware.checkLogin);

router.post("/loginAdmin", authController.loginAdmin);
router.get("/logoutAdmin", authController.logoutAdmin);

router.get("/users", userController.indexUser);
router.get("/users/:id", userController.showUser2);
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
router.get("/category/sale", categoryController.getCategoriesSale);

router.get("/role", roleController.indexRole);
router.get("/role/:id", roleController.roleById);
router.get("/order", orderController.indexOrder);

router.get("/statistics", orderController.getStatistics);
router.get("/statisticsByMonht", orderController.getStatisticsByMonht);
router.get("/statisticsByYear", orderController.getStatisticsByYear);

router.get("/updateStatusOrder/:orderId", orderController.updateStatus);
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

//dung de phan trang
router.get("/prodouct/count", productController.getCountProduct);
router.get("/prodouct/limit/:currentPage", productController.getProductLimit);
router.get("/user/limit/:currentPage", userController.getUserLimit);
module.exports = router;
