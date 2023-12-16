const { where } = require("sequelize");
const db = require("../../models/index");

const getProductSale = async (req, res) => {
  try {
    products = await db.Product.findAll();
    const today = new Date();
    const validProducts = [];
    products.forEach((product) => {
      if (product.manufacture !== null && product.expiry !== null) {
        // Ngày sản xuất
        const manufactureDate = new Date(product.manufacture);
        // Hạn sử dụng (số năm)
        const expiryYears = product.expiry;
        // Tính ngày hết hạn
        const expiryDate = new Date(
          manufactureDate.getFullYear() + expiryYears,
          manufactureDate.getMonth(),
          manufactureDate.getDate()
        );
        const daysBeforeExpiry = Math.floor(
          (expiryDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysBeforeExpiry >= 0 && daysBeforeExpiry <= 365) {
          validProducts.push(product);
        }
      }
    });
    return res.json({
      success: true,
      products: validProducts,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductTop = async (req, res) => {
  try {
    let products = await db.Product.findAll({
      where: {
        id: {
          [db.Sequelize.Op.between]: [10, 17],
        },
      },
      raw: true,
    });
    return res.json({
      success: true,
      products: products,
    });
  } catch (error) {}
};

const getProductDetail = async (req, res) => {
  try {
    let id = req.params.id;
    let product = await db.Product.findOne({
      where: {
        id: id,
      },
    });
    let data_rate = await db.Rate.findAll({
      include: {
        model: db.User,
        require: true,
        attributes: ["name"],
      },
      where: {
        ProductId: product.id,
      },
    });
    let count_rate = await db.Rate.count({
      where: { ProductId: product.id },
    });
    let one_star = await db.Rate.count({
      col: "ProductId",
      where: {
        ProductId: product.id,
        star: 1,
      },
    });
    let two_star = await db.Rate.count({
      where: {
        ProductId: product.id,
        star: 2,
      },
    });
    let three_star = await db.Rate.count({
      where: {
        ProductId: product.id,
        star: 3,
      },
    });
    let four_star = await db.Rate.count({
      where: {
        ProductId: product.id,
        star: 4,
      },
    });
    let fine_star = await db.Rate.count({
      where: {
        ProductId: product.id,
        star: 5,
      },
    });
    let countStar = {
      one: one_star,
      two: two_star,
      three: three_star,
      four: four_star,
      fine: fine_star,
    };
    res.status(200).json({
      success: true,
      message: `Chi tiết sản phẩm ID:${product.id}`,
      product: product,
      rate: data_rate,
      countRate: count_rate,
      countStar: countStar,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductSearch = async (req, res) => {
  try {
    let limit = 8;
    let page = req.query.page;
    let product_name = req.params.product_name;
    const offset = (page - 1) * limit;
    const totalProducts = await db.Product.count();
    const totalPages = Math.ceil(totalProducts / limit);
    const products = await db.Product.findAll({
      limit,
      offset,
      where: {
        name: {
          [db.Sequelize.Op.like]: `%${product_name}%`,
        },
      },
    });
    const result = {
      success: true,
      total_product: totalProducts,
      total_page: totalPages,
      current_page: page,
      products,
    };
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getProductDetail,
  getProductSearch,
  getProductSale,
  getProductTop,
};
