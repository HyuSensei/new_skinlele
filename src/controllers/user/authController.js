const db = require("../../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createJWT = (payload) => {
  let token = null;
  let key = process.env.JWT_SECRET;
  try {
    token = jwt.sign(payload, key);
  } catch (error) {
    console.log(error);
  }
  return token;
};

const verifyToken = (token) => {
  let decoded = null;
  let key = process.env.JWT_SECRET;
  let data = null;
  try {
    decoded = jwt.verify(token, key);
    data = decoded;
  } catch (error) {
    console.log(error);
  }
  return data;
};

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

const register = async (req, res) => {
  try {
    if (
      !req.body.name ||
      !req.body.username ||
      !req.body.email ||
      !req.body.phone ||
      !req.body.address ||
      !req.body.password
    ) {
      return res.status(400).json({
        detail: "Vui lòng điền đầy đủ thông tin đăng ký",
      });
    } else {
      let name = req.body.name;
      let username = req.body.username;
      let email = req.body.email;
      let password = req.body.password;
      let phone = req.body.phone;
      let address = req.body.address;
      let isEmailExit = await checkEmail(email);
      let isUserName = await checkUserName(username);
      if (isEmailExit == true) {
        return res.status(409).json({
          detail: "Email đã tồn tại !",
        });
      }
      if (isUserName == true) {
        return res.status(409).json({
          detail: "Tên đăng nhập đã tồn tại !",
        });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.User.create({
        name: name,
        email: email,
        username: username,
        phone: phone,
        password: hashedPassword,
        address: address,
        RoleId: 3,
      });
      return res.status(200).json({
        success: true,
        message: "Đăng ký thành công !",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        detail: "Vui lòng điền đầy đủ thông tin đăng nhập",
      });
    } else {
      let username = req.body.username;
      let password = req.body.password;
      let user = await db.User.findOne({
        where: { username: username },
      });
      if (!user) {
        return res.status(404).json({
          detail: "Tên đăng nhập không tồn tại !",
        });
      } else {
        let isPasswordExit = await checkPassword(password, user.password);
        if (!isPasswordExit) {
          return res.status(401).json({
            detail: "Mật khẩu không đúng vui lòng kiểm tra lại !",
          });
        } else {
          if (user.RoleId == 1 || user.RoleId == 2) {
            return res.status(401).json({
              detail: "Vui lòng thử tài khoản khác !",
            });
          }
          let dataUser = {
            id: user.id,
            name: user.name,
          };
          let userRes = {
            id: user.id,
            name: user.name,
            username: user.username,
            email: user.email,
          };
          let token = createJWT(dataUser);
          res.cookie("jwt", token, {
            maxAge: 24 * 60 * 60 * 1000,
          });
          return res.status(200).json({
            success: true,
            message: "Đăng nhập thành công !",
            token: token,
            user: userRes,
          });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const authLogin = async (req, res) => {
  try {
    let token = req.params.token;
    let decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        detail: "Xác thực đăng nhập thất bại !",
      });
    }
    let id = decoded.id;
    let user = await db.User.findOne({
      where: { id: id },
    });
    if (user) {
      return res.status(200).json({
        success: true,
        message: "Xác thực đăng nhập thành công !",
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const getUser = async (req, res) => {
  try {
    let user_id = req.params.user_id;
    let user = await db.User.findOne({
      where: {
        id: user_id,
      },
    });
    return res.status(200).json({
      user: user,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  register,
  login,
  authLogin,
  getUser,
};
