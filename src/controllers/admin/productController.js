const db = require("../../models/index");
const { Sequelize, DataTypes, Op } = require('sequelize');
const storeProduct = async (req, res) => {
  try {
    const dataStore = req.body
    console.log("data", dataStore);
    nameprd = dataStore.body.name;
    price = dataStore.body.price;
    description = dataStore.body.description;
    quantity = dataStore.body.quantity;
    CategoryId = dataStore.body.CategoryId;

    if (
      nameprd == "" ||
      price == "" ||
      description == "" ||
      quantity == "" ||
      CategoryId == 0
    ) {
      return res.json({
        success: false,
        message: "Vui lòng nhập đầu đủ thông tin !",
      });
    }
    if (typeof dataStore.file == "undefined") {
      return res.json( {
        success: false,
        message: "Vui lòng chọn ảnh sản phẩm !",
      });
    }
    image = "/images/products/" + dataStore.file.originalname;
    await db.Product.create({
      name: nameprd,
      image: image,
      price: price,
      description: description,
      quantity: quantity,
      CategoryId: CategoryId,
    });
    return res.json({
      success: true,
      message: "Thêm sản phẩm thành công !",
    });
  } catch (error) {
    console.log(error);
  }
  
  
};
const indexProduct = async (req, res) => {
  try {
    let data = await db.Product.findAll();
    return res.json({
      success: true,
      message: "Lấy sản phẩm thành công",
      product: data,
    });
  } catch (error) {
    console.log(error);
  }
};
const updateProduct = async (req, res) => {
  // console.log("kkk",req.params)
  // let data = await productService.updateNewProduct(req.body);
  try {
    const dataProduct = req.body.body
    //console.log("ass", dataProduct.body);
    await db.Product.update(
      {
        name: dataProduct.name,
        price: dataProduct.price,
        image:
          typeof dataProduct.file != "undefined"
            ? "/images/products/" + dataProduct.file.originalname
            : dataProduct.image,
        description: dataProduct.description,
        quantity: dataProduct.quantity,
        CategoryId: dataProduct.CategoryId,
      },
      {
        where: { id: dataProduct.id },
        returning: true,
      }
    );

    let data = await db.Product.findOne({ where: { id: dataProduct.id } });
    return res.json({
      success: true,
      message: "Update sản phẩm thành công",
      product: data,
    });
  } catch (error) {
    console.log("loi update", error);
  }
};

const destroyProduct = async (req, res) => {
  try {
    const dataProduct = req.params.id
    let data = await db.Product.findOne({
      where: { id: dataProduct },
    });
    await data.destroy();
    let order_product = await db.Order_Product.findAll({
      where: { ProductId: dataProduct },
    });
    if (order_product.length>0){
      await db.Order.destroy(
        {
          where: { id: order_product[0].OrderId }
        }
      )
      await db.Order_Product.destroy(
        {
          where: { OrderId: order_product[0].OrderId }
        }
      )
    }

    return res.json({
      success: true,
      message: `xóa sản phẩm thành công`,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: `xóa sản phẩm thất bại`,
    });
  }
};

const showProduct = async (req, res) => {
  try {
    const dataProduct = req.params.id
    let data = await db.Product.findOne({
      where: { id: dataProduct },
    });
    console.log('s',data)
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};

const getProductByName = async (req, res) => {
  // const name = req.body.name;
  // console.log(name)
  try {
    const name = req.body.name
    let data = await db.Product.findAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
    });
    console.log('name', name)
    if (data.length > 0) {
      return res.json({
        success: true,
        message: `tìm sản phẩm thành công`,
        product: data,
      });
    } else {
      return res.json({
        success: false,
        message: `tìm sản phẩm thất bại`,
        product: data,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const getCountProduct = async (req, res) => {
  try {
    let data = await db.Product.count();
    return res.json({
      success: true,
      message: `số lượng sản phẩm là`,
      data: data,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: `khong có sản phẩm nào`,
    });
  }
};
const getProductLimit = async (req, res) => {
  try {
    const currentPage = req.params.currentPage
    const limit = 6;
    const offset = (currentPage - 1) * limit;
    let data = await db.Product.findAll({
      limit: limit,
      offset: offset,
    })
    return res.json({
      success: true,
      message: `tìm sản phẩm thành công`,
      product: data,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: `khong có sản phẩm nào`,
    });
  }
};
const getAllRateProduct = async (req, res) => {
  try {
    let data = await db.Product.findAll({
      include: [db.Rate],
    });
    return res.json({
      success: true,
      message: `tìm sản phẩm thành công`,
      product: data,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: `khong có sản phẩm nào`,
    });
  }
};

module.exports = {
  storeProduct,
  updateProduct,
  destroyProduct,
  showProduct,
  indexProduct,
  getProductByName,
  getCountProduct,
  getProductLimit,
  getAllRateProduct
};
