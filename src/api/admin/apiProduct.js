const axios = require("axios");
require("dotenv").config();
const getProductHome = async (req, res) => {
    try {

        //console.log("ssss:", process.env.BASE_URL + `products`)
        let currentPage = req.params.currentPage;
        let dataProducts = await axios.get(process.env.BASE_URL + `prodouct/limit/${currentPage}`);
        let countProducts = await axios.get(process.env.BASE_URL + `prodouct/count`);
        //console.log("Data:", countProducts.data.data);
        let products = dataProducts.data.product;

        return res.render("admin/productAdmin.ejs", {
            products: products,
            countProducts: countProducts.data.data,
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports={
    getProductHome,
}