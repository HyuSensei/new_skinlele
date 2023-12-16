const axios = require("axios");
require("dotenv").config();
const getOrderHome = async (req, res) => {
    try {
        let dataOrder = await axios.get(process.env.BASE_URL + `order_product`);
        //console.log("Data order:", dataOrder.data.data);
        return res.render("admin/orderAdmin.ejs", { 
            dataOrder: dataOrder.data.data,
            countdataOrder: dataOrder.data.data.length
        });
    } catch (error) {
        console.log(error);
    }
};
const confirmOrder = async (req, res) => {
    try {
        orderId = req.params.orderId
        console.log(orderId)
        let dataOrder = await axios.get(process.env.BASE_URL + `updateStatusOrder/confirm/${orderId}`);
        //console.log("Data order:", dataOrder);
        if (dataOrder.data.success !== false) {
            return res.render('success.ejs', { message: "Xác nhận đơn hàn thành công", url: '/admin/order/' })
        } else {
            return res.render('success.ejs', { message: "Xác nhận đơn hàn thất bại", url: '/admin/order/' })
        }
    } catch (error) {
        console.log(error);
    }
};
const deleteOrder = async (req, res) => {
    try {
        orderId = req.params.orderId
        console.log(orderId)
        let dataOrder = await axios.delete(process.env.BASE_URL + `deleteOrder/${orderId}`);
        //console.log("Data order:", dataOrder);
        if (dataOrder.data.success !== false) {
            return res.render('success.ejs', { message: "Xóa đơn hàn thành công", url: '/admin/order/' })
        } else {
            return res.render('success.ejs', { message: "Xóa đơn hàn thất bại", url: '/admin/order/' })
        }
    } catch (error) {
        console.log(error);
    }
};
const paginationOrder = async (req, res) => {
    try {
        let currentPage = req.params.currentPage;
        let dataOrderALL = await axios.get(process.env.BASE_URL + `order_product`);
        let dataOrder = await axios.get(process.env.BASE_URL + `order_product/limit/${currentPage}`);
        //console.log("Data order:", dataOrder.data.data);
        return res.render("admin/orderAdmin.ejs", { 
            dataOrder: dataOrder.data.data ,
            countdataOrder: dataOrderALL.data.data.length
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getOrderHome,
    confirmOrder,
    deleteOrder,
    paginationOrder
}