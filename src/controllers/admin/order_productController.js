const db = require("../../models/index");
const { Sequelize, DataTypes, Op } = require('sequelize');
const getAllByDESC = async (req, res) => {
    try {
        let data = await db.Order_Product.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('Order_Product.quantity')), 'sold_quantity'],
            ],
            include: [{
                model: db.Product,
                attributes: ['name'],
            }],
            group: ['product.name'],
            order: [[Sequelize.fn('SUM', Sequelize.col('Order_Product.quantity')), 'DESC']],
        });
        //console.log(data.product.Product.name)
        return res.json({
            success: true,
            message: `tim thanh cong`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};
const getAll = async (req, res) => {
    try {
        let data = await db.Order.findAll({
            include: [
                {
                    model: db.Order_Product,
                    include: [{ model: db.Product }],
                },
            ],
        });
        return res.json({
            success: true,
            message: `tim thanh cong`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};
const getAllLimit = async (req, res) => {
    let currentPage = req.params.currentPage
    const limit = 3;
    const offset = (currentPage - 1) * limit;
    try {
        let data = await db.Order.findAll({
            include: [
                {
                    model: db.Order_Product,
                    include: [{ model: db.Product }],
                },
            ],
            limit: limit,
            offset: offset,
        });
        return res.json({
            success: true,
            message: `tim thanh cong`,
            data: data,
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    getAll,
    getAllByDESC,
    getAllLimit
};