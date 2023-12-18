const express = require("express");
const router = express.Router();
const apiUser = require("../../api/admin/apiUser");
const apiOrderManagement = require("../../api/admin/apiOrderManagement");
const apiProductAdmin = require("../../api/admin/apiProduct");
const upload = require("../../middleware/UploadImg");
const JWTAction = require("../../middleware/JWTAction");
const apiAdmin = require("../../api/admin/apiAdmin");
const apiAuthAdmin = require("../../api/admin/apiAuthAdmin");

// admin
router.get("/loginAdmin", apiAuthAdmin.loginAdmin);
router.post("/loginAdmin", apiAuthAdmin.handleLoginAdmin);
router.get("/logoutAdmin", (req, res) => {
  res.cookie("jwtadmin", "", { maxAge: 0 });
  res.cookie("adminUserId", "", { maxAge: 0 });
  res.cookie("adminname", "", { maxAge: 0 });
  res.cookie("adminemail", "", { maxAge: 0 });
  res.cookie("adminphone", "", { maxAge: 0 });
  res.cookie("adminusername", "", { maxAge: 0 });
  res.cookie("adminaddress", "", { maxAge: 0 });
  return res.redirect("/loginAdmin");
});
router.get("/admin", JWTAction.checkPremission, apiAdmin.getHome);
//get all product
router.get(
  "/admin/product",
  JWTAction.checkPremission,
  apiProductAdmin.getProductHome2
);
router.get(
  "/admin/product/page/:currentPage",
  JWTAction.checkPremission,
  apiProductAdmin.getProductHome
);
//delete product
router.get(
  "/admin/product/delete/:id",
  JWTAction.checkPremission,
  apiProductAdmin.deleteProduct
);
//get product by name
router.post(
  "/admin/product",
  JWTAction.checkPremission,
  apiProductAdmin.getProductByName
);
//edit product
router.get(
  "/admin/product/edit/:id",
  JWTAction.checkPremission,
  apiProductAdmin.getProductDetail2
);
router.post(
  "/admin/product/edit",
  JWTAction.checkPremission,
  upload.single("image"),
  apiProductAdmin.updateProduct
);
//create product
router.get(
  "/admin/product/create",
  JWTAction.checkPremission,
  apiProductAdmin.getCreateProduct
);
router.post(
  "/admin/product/create",
  JWTAction.checkPremission,
  upload.single("image"),
  apiProductAdmin.createProduct
);

//crud user
router.get("/admin/user", JWTAction.checkPremission, apiUser.getUserHome);
router.get(
  "/admin/user/page/:currentPage",
  JWTAction.checkPremission,
  apiUser.paginationUser
);
router.get(
  "/admin/user/delete/:id",
  JWTAction.checkPremission,
  apiUser.deleteUser
);
router.post(
  "/admin/user/",
  JWTAction.checkPremission,
  apiUser.getUserByUserName
);
router.get(
  "/admin/user/update/:id",
  JWTAction.checkPremission,
  apiUser.getUpdateUser
);
router.post(
  "/admin/user/update",
  JWTAction.checkPremission,
  apiUser.UpdateUser
);
//admin order
router.get(
  "/admin/order",
  JWTAction.checkPremission,
  apiOrderManagement.getOrderHome
);
router.get(
  "/admin/order/page/:currentPage",
  JWTAction.checkPremission,
  apiOrderManagement.paginationOrder
);
router.get(
  "/admin/order/confirm/:orderId",
  JWTAction.checkPremission,
  apiOrderManagement.confirmOrder
);
router.get(
  "/admin/order/delete/:orderId",
  JWTAction.checkPremission,
  apiOrderManagement.deleteOrder
);

module.exports = router;
