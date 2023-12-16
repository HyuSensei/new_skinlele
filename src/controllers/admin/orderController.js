const db = require("../../models/index");
const { Sequelize, DataTypes, Op } = require('sequelize');
const indexOrder = async (req, res) => {
  try {
    //console.log(id)
    let data = await db.Order.findAll();
    return res.json({
      success: true,
      message: `Tim thanh cong`,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};
const getStatistics = async (req, res) => {
  try {
    //console.log(id)
    let data = await db.Order.findAll({
      attributes: [
        [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m'), 'thang'],
        [Sequelize.fn('SUM', Sequelize.col('total')), 'tong_thu_nhap'],
      ],
      group: [Sequelize.fn('DATE_FORMAT', Sequelize.col('createdAt'), '%Y-%m')],
    });
    const currentYear = new Date().getFullYear();
    for (let i = 1; i <= 12; i++) {
      const formattedMonth = `${currentYear}-${i.toString().padStart(2, '0')}`;
      const existingData = data.find(row => row.dataValues.thang === formattedMonth);
      if (!existingData) {
        data.push({
          dataValues: {
            thang: formattedMonth,
            tong_thu_nhap: 0,
          },
        });
      }
    }
    // Sắp xếp kết quả theo tháng
    data.sort((a, b) => (a.dataValues.thang > b.dataValues.thang ? 1 : -1));

    const arr = []
    //Hiển thị kết quả
    for (const row of data) {
      //console.log(row.dataValues);
      arr.push(row.dataValues)
    }

    return res.json({
      success: true,
      message: `Tim thanh cong`,
      data: arr,
    });
  } catch (error) {
    console.log(error);
  }
};
const getStatisticsByMonht = async (req, res) => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    let data = await db.Order.sum('total', {
      where: {
        createdAt: {
          [Op.and]: [
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('createdAt')), currentYear),
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('createdAt')), currentMonth),
          ],
        },
      },
    })
    return res.json({
      success: true,
      message: `Tim thanh cong`,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};
const getStatisticsByYear = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    let data = await db.Order.sum('total', {
      where: {
        createdAt: {
          [Op.between]: [`${currentYear}-01-01`, `${currentYear}-12-31`],
        },
      },
    });
    return res.json({
      success: true,
      message: `Tim thanh cong`,
      data: data,
    });
  } catch (error) {
    console.log(error);
  }
};


const handleOrder = async (req, res) => {
  let cart = req.body.cart;
  if (cart.length === 0) {
    return res.json({
      success: false,
      message: "Vui lòng thêm sản phẩm vào giỏ hàng để đặt hàng !",
    });
  } else {
    if (
      !req.body.user.name ||
      !req.body.user.phone ||
      !req.body.user.address ||
      !req.body.user.method
    ) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đặt hàng !",
      });
    } else {
      if (req.body.user.method === "orderoff") {
        const userOrder = req.body.user
        const UserId = req.body.UserId
        try {
          let total = 0;
          for (let i = 0; i < cart.length; i++) {
            total = cart[i].price * cart[i].quantity;
          }
          let payment = "Thanh toán khi nhận hàng";
          let orderInsert = await db.Order.create({
            payment: payment,
            status: 0,
            name: userOrder.name,
            address: userOrder.address,
            phone: userOrder.phone,
            total: total,
            UserId: UserId,
          });
          for (let i = 0; i < cart.length; i++) {
            await db.Order_Product.create({
              ProductId: cart[i].id,
              OrderId: orderInsert.id,
              quantity: cart[i].quantity,
            });
          }
          return res.json({
            success: true,
            message: "Đặt hàng thành công !",
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        return res.json({
          success: false,
          message: "Hiện tại website SkinLeLe chưa hỗ trợ thanh toán VNPAY",
        });
      }
    }
  }
};

const orderConfirm = async (req, res) => {
  let listLastProduct = [];
  let lastProduct = null;
  try {
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
        UserId: dataOrder,
        status: 0,
      },
      raw: true,
    });
    for (const itemOrder of data) {
      
      let data = await db.Order_Product.findOne({
        attributes: ["ProductId"],
        where: { OrderId: itemOrder.id },
        order: [["id", "DESC"]],
        limit: 1,
        raw: true,
      });
      let checkOrderProduct = data
      
      if (checkOrderProduct.ProductId === itemOrder["Order_Products.ProductId"]) {
        lastProduct = itemOrder["Order_Products.ProductId"];
        listLastProduct.push(lastProduct);
      }
    }
    return res.json({
      success: true,
      order: data,
      lastProduct: listLastProduct,
    });
  } catch (error) {
    console.log(error);
  }
  
};

const orderShip = async (req, res) => {
  let listLastProduct = [];
  let lastProduct = null;
  
  try {
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
        UserId: dataOrder,
        status: 1,
      },
      raw: true,
    });
    
  
  for (const itemOrder of data) {
    let checkOrderProduct = await db.Order_Product.findOne({
      attributes: ["ProductId"],
      where: { OrderId: itemOrder.id },
      order: [["id", "DESC"]],
      limit: 1,
      raw: true,
    });
    if (checkOrderProduct.ProductId === itemOrder["Order_Products.ProductId"]) {
      lastProduct = itemOrder["Order_Products.ProductId"];
      listLastProduct.push(lastProduct);
    }
  }
  return res.json({
    success: true,
    order: data,
    lastProduct: listLastProduct,
  });
  } catch (error) {
    console.log(error);
  }
};

const orderComplete = async (req, res) => {
  let listLastProduct = [];
  let listCount = [];
  let lastProduct = null;
  try {
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
      UserId: req.params.UserId,
      status: 2,
    },
    raw: true,
  });
  let dataOrderAll = await db.Order.findAll();
  for (const itemOrderAll of dataOrderAll) {
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
    let count  = {
      OrderId: itemOrderAll.id,
      countOrder: countOrder,
      countRate: countRate,
    };
    listCount.push(count);
  }
  for (const itemOrder of data) {
    let checkOrderProduct = await db.Order_Product.findOne({
      attributes: ["ProductId"],
      where: { OrderId: itemOrder.id },
      order: [["id", "DESC"]],
      limit: 1,
      raw: true,
    });
    if (checkOrderProduct.ProductId === itemOrder["Order_Products.ProductId"]) {
      lastProduct = itemOrder["Order_Products.ProductId"];
      listLastProduct.push(lastProduct);
    }
  }
  return res.json({
    success: true,
    order: data,
    lastProduct: listLastProduct,
    countCheck: listCount,
  });
  } catch (error) {
    console.log(error);
  }
};

const viewRateOrder = async (req, res) => {
  let listCount = [];
  let dataOrder = {
    userId: req.params.userId,
    orderId: req.params.orderId,
  };
  try {
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
      UserId: dataOrder.userId,
      id: dataOrder.orderId,
      status: 2,
    },
    raw: true,
  });
  let checkRatedData = [];
  for (const item of data) {
    let dataCheck = {
      ProductId: item["Order_Products.ProductId"],
      OrderId: item.id,
    };
    let result = await db.Rate.findAll({
      where: {
        ProductId: dataCheck.ProductId,
        OrderId: dataCheck.OrderId,
      },
      raw: true,
    });
    checkRatedData.push(...result);
  }
  let dataOrderAll = await db.Order.findAll();
  for (const itemOrderAll of dataOrderAll) {
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
    let count =  {
      OrderId: itemOrderAll.id,
      countOrder: countOrder,
      countRate: countRate,
    };
    
    listCount.push(count);
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

const updateStatus = async (req, res) => {
  try {
    await db.Order.update(
      {
        status: 2,
      },
      {
        where: { id: req.params.orderId },
      }
    );
    return res.json({
      success: true,
      message: "Xác nhận đã nhận hàng thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};
const handConfirm = async (req, res) => {
  //console.log(req.params.orderId)
  try {
    await db.Order.update(
      {
        status: 1,
      },
      {
        where: { id: req.params.orderId },
      }
    );
    return res.json({
      success: true,
      message: "Xác nhận giao hàng!",
    });
  } catch (error) {
    console.log(error);
  }
};
const deleteOrder = async (req, res) => {
  //console.log(req.params.orderId)
  try {
    await db.Order.destroy(
      {
        where: { id: req.params.orderId },
      }
    );
    return res.json({
      success: true,
      message: "Xóa thành công!",
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports = {
  handleOrder,
  orderConfirm,
  orderShip,
  orderComplete,
  viewRateOrder,
  updateStatus,
  indexOrder,
  getStatistics,
  getStatisticsByMonht,
  getStatisticsByYear,
  handConfirm,
  deleteOrder
};
