const db = require("../../models/index");

const indexUser = async (req, res) => {
  try {
    let dataUser = await db.User.findAll();
    return res.json({
      success: true,
      message: "Lấy thông tin user thành công",
      dataUser: dataUser,
    });
  } catch (erro) {
    console.log("loi get all user:", erro);
  }
};

const showUser = async (req, res) => {
  try {
    let data = await db.User.findOne({
      where: { id: req.cookies.UserId },
    });
    //console.log("a",data);
    let user = data
    return res.render("user/myaccount.ejs", { user });
  } catch (error) {
    console.log(error);
  }
  
  
};
const showUser2 = async (req, res) => {
  try {
    let data = await db.User.findOne({
      where: { id: req.params.id },
    });
    //console.log("a",data);
    return res.json(data);

  } catch (error) {
    console.log(error);
  }
};

const createUser = () => {};

const searchByUserName = async (req, res) => {
  try {
    let data = await db.User.findAll({
      where: {
        username: {
          [Op.like]: `%${req.query.username}%`,
        },
      },
    });
    return res.json({
      success: true,
      message: "tìm thấy người dùng",
      dataUser: data,
    });
  } catch (erro) {
    console.log("loi tim user:", erro);
  }
};

const destroyUser = async (req, res) => {
  try {
    await db.User.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.json({
      success: true,
      message: "xóa user thành công",
    });
  } catch (erro) {
    console.log("loi xóa user:", erro);
  }
  
};

const editUser = () => {};

const updateUser = async (req, res) => {
  try {
    //console.log("api",dataUser)
    await db.User.update(
      {
        name: dataUser.name,
        email: dataUser.email,
        password: dataUser.password,
        phone: dataUser.phone,
        RoleId: dataUser.RoleId,
      },
      {
        where: {
          id: dataUser.id,
        },
      }
    );
    let data = await db.User.findOne({ where: { id: dataUser.id } });
    return res.json({
      success: true,
      message: "cập nhật thông tin người dùng thành công",
      dataUser: data,
    });
  } catch (erro) {
    console.log("err ud user", erro);
  }
};

const getUserLimit = async (req, res) => {
  let currentPage = req.params.currentPage
  try {
    const limit = 6;
    const offset = (currentPage - 1) * limit;
    let data = await db.User.findAll({
      limit: limit,
      offset: offset,
    })
    return res.json({
      success: true,
      message: `tìm người dùng thành công`,
      user: data,
    });
  } catch (error) {
    console.log(error);
    return res.json({
      success: false,
      message: `khong có người dùng nào`,
    });
  }
};

module.exports = {
  indexUser,
  createUser,
  destroyUser,
  showUser,
  searchByUserName,
  editUser,
  updateUser,
  showUser2,
  getUserLimit
};
