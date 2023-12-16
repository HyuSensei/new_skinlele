require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
//const webRoute = require("./routes/web");
const cors = require("cors");
//const apiRoute = require("./routes/api");
const cookieParser = require("cookie-parser");
const configViewEngine = require("./config/viewEngine");
const connection = require("./config/connectDB");
const session = require("express-session");
const flash = require("express-flash");
const routeAPIUser = require("./routes/api/user");
const routeWebUser = require("./routes/web/user");
const adminwebRoute = require("./routes/web/admin");
const adminapiRoute = require("./routes/api/admin");
// const routeAPIAdmin = require("./routes/api/admin");
// const routeWebAdmin = require("./routes/web/admin");

app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);
app.use(flash());

configViewEngine(app);

app.use(express.static(__dirname + "/public"));

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

connection();

app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  let carts = req.session.cart;
  let total = 0;
  let sum = 0;
  for (let i = 0; i < carts.length; i++) {
    sum = carts[i].price * carts[i].quantity;
    total += sum;
  }
  res.locals.cart = req.session.cart;
  res.locals.total = total;
  next();
});
app.use((req, res, next) => {
  if (!req.cookies.UserId) {
    res.locals.UserId = "";
  }
  if (
    !req.cookies.adminUserId ||
    !req.cookies.adminname ||
    !req.cookies.adminusername ||
    !req.cookies.adminemail ||
    !req.cookies.adminphone ||
    !req.cookies.adminaddress
  ) {
    res.locals.adminUserId = "";
    res.locals.adminname = "";
    res.locals.adminusername = "";
    res.locals.adminemail = "";
    res.locals.adminphone = "";
    res.locals.adminaddress = "";
  }
  res.locals.UserId = req.cookies.UserId;

  //admin
  res.locals.adminUserId = req.cookies.adminUserId;
  res.locals.adminname = req.cookies.adminname;
  res.locals.adminusername = req.cookies.adminusername;
  res.locals.adminemail = req.cookies.adminemail;
  res.locals.adminphone = req.cookies.adminphone;
  res.locals.adminaddress = req.cookies.adminaddress;
  next();
});

// app.use("/", webRoute);
// app.use("/api/v1/", apiRoute);
app.use("/api/v1", routeAPIUser);
app.use("/", routeWebUser);
app.use("/", adminwebRoute);
app.use("/api/v1/", adminapiRoute);

// app.use("/api/v1/admin", routeAPIAdmin);
// app.use("/admin", routeWebAdmin);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});