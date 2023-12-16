const db = require("../../../models/index");
const bcrypt = require("bcrypt");
const JWTAction = require("../../../middleware/JWTAction");

const checkEmail = async (emailUser) => {
  let user = await db.User.findOne({
    where: { email: emailUser },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const checkPhone = async (phoneUser) => {
  let user = await db.User.findOne({
    where: { phone: phoneUser },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const checkUserName = async (userName) => {
  let user = await db.User.findOne({
    where: { username: userName },
  });
  if (user) {
    return true;
  } else {
    return false;
  }
};

const checkPassword = async (password, hashedPassword) => {
  const checkPass = await bcrypt.compare(password, hashedPassword);
  return checkPass;
};
const registerUser = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.username ||
      !req.body.email ||
      !req.body.password ||
      !req.body.phone ||
      !req.body.address
    ) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng ký",
      });
    } else {
      try {
        const dataRegister = req.body
        let isEmailExit = await checkEmail(dataRegister.email);
        let isPhoneExit = await checkPhone(dataRegister.phone);
        let isUserName = await checkUserName(dataRegister.username);
        if (isEmailExit == true) {
          return res.json({
            success: false,
            message: "Email đã tồn tại !",
          });
        }
        if (isPhoneExit == true) {
          return res.json({
            success: false,
            message: "Số điện thoại đã tồn tại !",
          });
        }
        if (isUserName == true) {
          return res.json({
            success: false,
            message: "Tên đăng nhập đã tồn tại !",
          });
        }
        const hashedPassword = await bcrypt.hash(dataRegister.password, 10);
        await db.User.create({
          name: dataRegister.name,
          email: dataRegister.email,
          username: dataRegister.username,
          password: hashedPassword,
          phone: dataRegister.phone,
          address: dataRegister.address,
          RoleId: 3,
        });
        return res.json({
          success: true,
          message: "Đăng ký thành công !",
        });
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const loginUser = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng nhập",
      });
    } else {
      try {
        const dataLogin = req.body
        let user = await db.User.findOne({
          where: { username: dataLogin.username },
        });
        if (!user) {
          return {
            success: false,
            message: "Tên đăng nhập không tồn tại !",
          };
        } else {
          let isPasswordExit = await checkPassword(
            dataLogin.password,
            user.password
          );
          if (!isPasswordExit) {
            return res.json({
              success: false,
              message: "Mật khẩu không đúng vui lòng kiểm tra lại !",
            });
          } else {
            let dataUser = {
              id: user.id,
              name: user.name,
            };
            let userRes = {
              id: user.id,
              name: user.name,
              username: user.username,
              phone: user.phone,
              address: user.address,
            };
            let token = JWTAction.createJWT(dataUser);
            return res.json({
              success: true,
              message: "Đăng nhập thành công !",
              token: token,
              user: userRes,
            });
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const logoutUser = (req, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.cookie("UserId", "", { maxAge: 0 });
  res.json({
    success: true,
    message: "Đăng xuất thành công !",
  });
};

const loginAdmin = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.json({
        success: false,
        message: "Vui lòng điền đầy đủ thông tin đăng nhập",
      });
    } else {
      try {
        const dataLogin = req.body
        let user = await db.User.findOne({
          where: { username: dataLogin.username },
          include: {
            model: db.Role,
          },
          raw: true,
          nest: true,
        });
        if (!user) {
          return res.json({
            success: false,
            message: "Tên đăng nhập không tồn tại !",
          });
        } else {
          let isPasswordExit = await checkPassword(
            dataLogin.password,
            user.password
          );
          if (!isPasswordExit) {
            return res.json({
              success: false,
              message: "Mật khẩu không đúng vui lòng kiểm tra lại !",
            });
          } else {

            //console.log(user)
            if (user.Role.name === "Admin" || user.Role.name === "SuperAdmin") {
              let dataUser = {
                id: user.id,
                name: user.name,
              };
              let userRes = {
                id: user.id,
                name: user.name,
                username: user.username,
                phone: user.phone,
                address: user.address,
              };
              let token = JWTAction.createJWT(dataUser);
              return res.json({
                success: true,
                message: "Đăng nhập thành công !",
                token: token,
                user: userRes,
              });
            } else {
              return res.json({
                success: false,
                message: "Tài khoản của bạn không có quyền truy cập trang admin !",
              });
            }
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const logoutAdmin = (req, res) => {
  res.cookie("jwtadmin", "", { maxAge: 0 });
  res.cookie("adminUserId", "", { maxAge: 0 });
  res.json({
    success: true,
    message: "Đăng xuất thành công !",
  });
};
module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  loginAdmin,
  logoutAdmin
};
