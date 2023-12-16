const db = require("../../models/index");

const getCategory = async (req, res) => {
  try {
    let category1 = await db.Category.findAll({
      where: {
        CategoryParentId: 1,
      },
    });
    let category2 = await db.Category.findAll({
      where: {
        CategoryParentId: 2,
      },
    });
    return res.status(200).json({
      category1: category1,
      category2: category2,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductCategory = async (req, res) => {
  try {
    const category_id = req.params.category_id;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const { count, rows: products } = await db.Product.findAndCountAll({
      limit: limit,
      offset: (page - 1) * limit,
      where: {
        CategoryId: category_id,
      },
    });
    const totalPage = Math.ceil(count / limit);
    res.status(200).json({
      success: true,
      total: count,
      total_page: totalPage,
      current_page: page,
      products: products,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getProductCategory,
  getCategory,
};
