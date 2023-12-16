const db = require("../../models/index");

const addOrder = async (req, res) => {
  try {
    let cart = req.body.cart;
    let userOrder = req.body.user;
    if (cart.length === 0) {
      return res.status(400).json({
        detail: "Vui lòng thêm sản phẩm vào giỏ hàng để đặt hàng !",
      });
    } else {
      if (
        !req.body.user.name ||
        !req.body.user.phone ||
        !req.body.user.method ||
        !req.body.user.address
      ) {
        return res.status(400).json({
          detail: "Vui lòng điền đầy đủ thông tin đặt hàng !",
        });
      } else {
        if (req.body.user.method == "off") {
          await orderOff(cart, userOrder);
          return res.status(200).json({
            success: true,
            method: "Thanh toán khi nhận hàng",
            message: "Đặt hàng thành công !",
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const orderOff = async (cart, userOrder) => {
  try {
    let total = 0;
    for (let i = 0; i < cart.length; i++) {
      total = cart[i].price * cart[i].quantity;
    }
    let orderInsert = await db.Order.create({
      payment: "Thanh toán khi nhận hàng",
      status: 0,
      name: userOrder.name,
      address: userOrder.address,
      phone: userOrder.phone,
      total: total,
      UserId: userOrder.user_id,
    });
    for (let i = 0; i < cart.length; i++) {
      await db.Order_Product.create({
        ProductId: cart[i].id,
        OrderId: orderInsert.id,
        quantity: cart[i].quantity,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const checkMaxOrder = async (order_id) => {
  try {
    let data = await db.Order_Product.findOne({
      attributes: ["ProductId"],
      where: { OrderId: order_id },
      order: [["id", "DESC"]],
      limit: 1,
      raw: true,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

const getOrderWait = async (req, res) => {
  try {
    let listLastProduct = [];
    let user_id = req.params.user_id;
    let data = await db.Order.findAll({
      include: [
        {
          model: db.Order_Product,
          attributes: ["id", "OrderId", "ProductId", "quantity"],
          include: [
            {
              model: db.Product,
              attributes: ["name", "image", "price", "sale"],
              require: true,
            },
          ],
        },
      ],
      where: {
        UserId: user_id,
        status: 0,
      },
    });
    res_order = [];
    listLastProduct = [];
    for (const order of data) {
      let checkOrderProduct = await checkMaxOrder(order.id);
      for (const orderProduct of order.Order_Products) {
        if (checkOrderProduct.ProductId === orderProduct.ProductId) {
          lastProduct = orderProduct.ProductId;
          listLastProduct.push(lastProduct);
        }
        const order_data = {
          id: order.id,
          status: order.status,
          name: order.name,
          address: order.address,
          phone: order.phone,
          user_id: order.UserId,
          total: order.total,
          product_id: orderProduct.ProductId,
          quantity: orderProduct.quantity,
          product_name: orderProduct.Product.name,
          price: orderProduct.Product.price,
          sale: orderProduct.Product.sale,
          product_image: orderProduct.Product.image,
        };
        res_order.push(order_data);
      }
    }
    return res.status(200).json({
      message: "Thông tin đơn hàng đang chờ duyệt !",
      order: res_order,
      last_product: listLastProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderShip = async (req, res) => {
  try {
    let listLastProduct = [];
    let user_id = req.params.user_id;
    let data = await db.Order.findAll({
      include: [
        {
          model: db.Order_Product,
          attributes: ["id", "OrderId", "ProductId", "quantity"],
          include: [
            {
              model: db.Product,
              attributes: ["name", "image", "price", "sale"],
              require: true,
            },
          ],
        },
      ],
      where: {
        UserId: user_id,
        status: 1,
      },
    });
    res_order = [];
    listLastProduct = [];
    for (const order of data) {
      let checkOrderProduct = await checkMaxOrder(order.id);
      for (const orderProduct of order.Order_Products) {
        if (checkOrderProduct.ProductId === orderProduct.ProductId) {
          lastProduct = orderProduct.ProductId;
          listLastProduct.push(lastProduct);
        }
        const order_data = {
          id: order.id,
          status: order.status,
          name: order.name,
          address: order.address,
          phone: order.phone,
          user_id: order.UserId,
          total: order.total,
          product_id: orderProduct.ProductId,
          quantity: orderProduct.quantity,
          price: orderProduct.Product.price,
          product_name: orderProduct.Product.name,
          sale: orderProduct.Product.sale,
          product_image: orderProduct.Product.image,
        };
        res_order.push(order_data);
      }
    }
    return res.status(200).json({
      message: "Thông tin đơn hàng đang vận chuyển !",
      order: res_order,
      last_product: listLastProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderComplete = async (req, res) => {
  try {
    let listLastProduct = [];
    let user_id = req.params.user_id;
    let data = await db.Order.findAll({
      include: [
        {
          model: db.Order_Product,
          attributes: ["id", "OrderId", "ProductId", "quantity"],
          include: [
            {
              model: db.Product,
              attributes: ["name", "image", "price", "sale"],
              require: true,
            },
          ],
        },
      ],
      where: {
        UserId: user_id,
        status: 2,
      },
    });
    res_order = [];
    listLastProduct = [];
    listCount = [];
    for (const order of data) {
      let countOrder = await db.Order_Product.count({
        where: {
          OrderId: order.id,
        },
      });
      let countRate = await db.Rate.count({
        where: {
          OrderId: order.id,
        },
      });
      let count_order_rate = {
        order_id: order.id,
        countOrder: countOrder,
        countRate: countRate,
      };
      listCount.push(count_order_rate);
      let checkOrderProduct = await checkMaxOrder(order.id);
      for (const orderProduct of order.Order_Products) {
        if (checkOrderProduct.ProductId === orderProduct.ProductId) {
          lastProduct = orderProduct.ProductId;
          listLastProduct.push(lastProduct);
        }
        const order_data = {
          id: order.id,
          status: order.status,
          name: order.name,
          address: order.address,
          phone: order.phone,
          user_id: order.UserId,
          total: order.total,
          product_id: orderProduct.ProductId,
          quantity: orderProduct.quantity,
          price: orderProduct.Product.price,
          product_name: orderProduct.Product.name,
          sale: orderProduct.Product.sale,
          product_image: orderProduct.Product.image,
        };
        res_order.push(order_data);
      }
    }
    return res.status(200).json({
      message: "Thông tin đơn hàng đã giao !",
      order: res_order,
      last_product: listLastProduct,
      countCheck: listCount,
    });
  } catch (error) {
    console.log(error);
  }
};

const getOrderCancel = async (req, res) => {
  try {
    let listLastProduct = [];
    let user_id = req.params.user_id;
    let data = await db.Order.findAll({
      include: [
        {
          model: db.Order_Product,
          attributes: ["id", "OrderId", "ProductId", "quantity"],
          include: [
            {
              model: db.Product,
              attributes: ["name", "image", "price", "sale"],
              require: true,
            },
          ],
        },
      ],
      where: {
        UserId: user_id,
        status: 3,
      },
    });
    res_order = [];
    listLastProduct = [];
    for (const order of data) {
      let checkOrderProduct = await checkMaxOrder(order.id);
      for (const orderProduct of order.Order_Products) {
        if (checkOrderProduct.ProductId === orderProduct.ProductId) {
          lastProduct = orderProduct.ProductId;
          listLastProduct.push(lastProduct);
        }
        const order_data = {
          id: order.id,
          status: order.status,
          name: order.name,
          address: order.address,
          phone: order.phone,
          user_id: order.UserId,
          total: order.total,
          product_id: orderProduct.ProductId,
          quantity: orderProduct.quantity,
          price: orderProduct.Product.price,
          product_name: orderProduct.Product.name,
          sale: orderProduct.Product.sale,
          product_image: orderProduct.Product.image,
        };
        res_order.push(order_data);
      }
    }
    return res.status(200).json({
      message: "Thông tin đơn hàng đã hủy !",
      order: res_order,
      last_product: listLastProduct,
    });
  } catch (error) {
    console.log(error);
  }
};

const handleCancelOrder = async (req, res) => {
  try {
    let order_id = req.params.order_id;
    await db.Order.update(
      {
        status: 3,
      },
      {
        where: {
          id: order_id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Hủy đơn hàng thành công !",
    });
  } catch (error) {
    console.log(error);
  }
};

const handleUpdateConfirm = async (req, res) => {
  try {
    let order_id = req.params.order_id;
    await db.Order.update(
      {
        status: 2,
      },
      {
        where: {
          id: order_id,
        },
      }
    );
    return res.status(200).json({
      success: true,
      message: "Xác nhận đã nhận đơn hàng thành công !",
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  addOrder,
  getOrderWait,
  getOrderShip,
  getOrderComplete,
  getOrderCancel,
  handleCancelOrder,
  handleUpdateConfirm,
};
