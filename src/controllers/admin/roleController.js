const db = require("../../models/index");

const indexRole = async (req, res) => {
    try {
        let data = await db.Role.findAll();
        return res.json({
            success: true,
            message: `tim thanh cong`,
            Role: data,
        });
    } catch (error) {
        console.log(error);
    }
};
const roleById = async (req, res) => {
    try {
        //console.log(id)
        let data = await db.Role.findOne({
            where: { id: req.params.id },
        });
        return res.json({
            success: true,
            message: `Role id=${data.id}`,
            Role: data,
        });
    } catch (error) {
        console.log(error);
    }
    
};
module.exports = {
    indexRole,
    roleById
};