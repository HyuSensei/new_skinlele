const db = require("../../models/index");

const handleRate = async (req, res) => {
  if (!req.body.rating || !req.body.comment) {
    return res.status(400).json({
      detail: "Vui lòng chọn đầy đủ thông tin đánh giá !",
    });
  }
  let data = await db.Rate.create({
    ProductId: req.body.ProductId,
    UserId: req.body.UserId,
    OrderId: req.body.OrderId,
    star: req.body.rating,
    comment: req.body.comment,
  });
  return res.status(200).json({
    success: true,
    message: "Đánh giá sản phẩm thành công!",
    rate: data,
  });
};
const getProductRate = async (req, res) => {
  try {
    let listCount = [];
    let user_id = req.params.user_id;
    let order_id = req.params.order_id;
    let data = await db.Order.findAll({
      include: [
        {
          model: db.Order_Product,
          attributes: ["id", "OrderId", "ProductId", "quantity"],
          include: [
            {
              model: db.Product,
              attributes: ["name", "image", "price"],
              require: true,
            },
          ],
        },
      ],
      where: {
        UserId: user_id,
        id: order_id,
        status: 2,
      },
      raw: true,
    });
    let checkRatedData = [];
    for (const item of data) {
      let result = await db.Rate.findAll({
        where: {
          ProductId: item["Order_Products.ProductId"],
          OrderId: item.id,
        },
        raw: true,
      });
      checkRatedData.push(...result);
    }
    let order_all = await db.Order.findAll();
    for (const itemOrderAll of order_all) {
      let countOrder = await db.Order_Product.count({
        where: {
          OrderId: itemOrderAll.id,
        },
      });
      let countRate = await db.Rate.count({
        where: {
          OrderId: itemOrderAll.id,
        },
      });
      count_obj = {
        OrderId: itemOrderAll.id,
        countOrder: countOrder,
        countRate: countRate,
      };
      listCount.push(count_obj);
    }
    return res.json({
      success: true,
      orders: data,
      checkRated: checkRatedData,
      countCheck: listCount,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleRate,
  getProductRate,
};
