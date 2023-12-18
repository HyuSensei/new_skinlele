const db = require("../../models/index");

const handleRate = async (req, res) => {
  if (!req.body.rating || !req.body.comment) {
    return res.json({
      success: false,
      message: "Vui lòng chọn đầy đủ thông tin đánh giá !",
    });
  }
  const dataRate = req.body
  try {
    let data = await db.Rate.create({
      ProductId: dataRate.ProductId,
      UserId: dataRate.UserId,
      OrderId: dataRate.OrderId,
      star: dataRate.rating,
      comment: dataRate.comment,
    });
    let infoRate = {
      ProductId: data.ProductId,
      UserId: data.UserId,
      OrderId: data.OrderId,
      star: data.star,
      comment: data.comment,
    };
    return res.json({
      success: true,
      message: "Đánh giá sản phẩm thành công!",
      rate: infoRate,
    });
  } catch (error) {
    console.log(error);
  }
  
};

const getRate = async (req, res) => {
  let productId = req.params.productId;
  let getInfoRate = getRateProduct(productId);
  let countRate = countRateprd(productId);
  let countStar = countStarprd(productId);
  let productDetail = showDetailProduct(productId);
  return res.json({
    success: true,
    message: `Chi tiết san phẩm ${productId}`,
    product: productDetail,
    rate: getInfoRate,
    countRate: countRate,
    countStar: countStar,
  });
};
const showDetailProduct = async (dataProduct) => {
  try {
    let data = await db.Product.findOne({
      where: { id: dataProduct },
    });
    //console.log('s',data)
    return data;
  } catch (error) {
    console.log(error);
  }
};
const countStarprd = async (dataRate) => {
  try {
    let one_star = await db.Rate.count({
      col: "ProductId",
      where: {
        ProductId: dataRate,
        star: 1,
      },
    });
    let two_star = await db.Rate.count({
      where: {
        ProductId: dataRate,
        star: 2,
      },
    });
    let three_star = await db.Rate.count({
      where: {
        ProductId: dataRate,
        star: 3,
      },
    });
    let four_star = await db.Rate.count({
      where: {
        ProductId: dataRate,
        star: 4,
      },
    });
    let fine_star = await db.Rate.count({
      where: {
        ProductId: dataRate,
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
    console.log("Data count star 2:", countStar);
    return countStar;
  } catch (error) {
    console.log(error);
  }
};
const countRateprd = async (dataRate) => {
  try {
    let data = await db.Rate.count({
      where: { ProductId: dataRate },
    });
    console.log("So luot danh gia:", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getRateProduct = async (dataRate) => {
  try {
    let data = await db.Rate.findAll({
      include: {
        model: db.User,
        require: true,
        attributes: ["name"],
      },
      where: {
        ProductId: dataRate,
      },
    });
    console.log("Data rate:", data);
    return data;
  } catch (error) {
    console.log(error);
  }
};
const getAllCountRate = async (req, res) => {
  let countRate = await db.Rate.count()
  return res.json({
    success: true,
    message: `tong so rate la: ${countRate}`,
    countRate: countRate,
  });
};

module.exports = {
  handleRate,
  getRate,
  getAllCountRate
};
