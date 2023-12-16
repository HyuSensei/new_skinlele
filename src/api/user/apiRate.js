const axios = require("axios");
const handleRate = async (req, res) => {
  let userId = req.cookies.UserId;
  let orderId = req.body.OrderId;
  try {
    let data = await axios.post(process.env.BASE_URL + `rate`, req.body);
    if (data.data.success === false) {
      req.flash("erro", `${data.data.message}`);
    }
    return res.redirect(`/rate/order=${orderId}/user=${userId}`);
  } catch (error) {
    console.log(error.response.data);
    if (error.response.data.detail) {
      req.flash("erro", `${error.response.data.detail}`);
    }
    return res.redirect(`/rate/order=${orderId}/user=${userId}`);
  }
};

const productRate = async (req, res) => {
  try {
    let erro = req.flash("erro");
    let success = req.flash("success");
    let user_id = req.params.user_id;
    let order_id = req.params.order_id;
    let data = await axios.get(
      process.env.BASE_URL + `rate/${order_id}/${user_id}`
    );
    if (data.data.success === true) {
      return res.render("user/rate.ejs", {
        orders: data.data.orders,
        checkRated: data.data.checkRated,
        countCheck: data.data.countCheck,
        erro,
        success,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handleRate,
  productRate,
};
