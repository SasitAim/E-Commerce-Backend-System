// app.js
const express = require("express");
const bodyParser = require("body-parser");
const path = require("node:path");
const cookieParser = require('cookie-parser');

// เชื่อมต่อ MongoDB
const connectMongo = require('./config/dbMongo');
const Review = require('./models/review');

// นำเข้า Router ที่แยกไว้
const authRouter = require('./routes/auth');
const productRouter = require('./routes/product');
const cartRouter = require('./routes/cart');
// const OPRouter = require('./routes/purchase_orders');
const addressRouter = require('./routes/customerAdd');
const orderRouter = require('./routes/order');
const reviewRouter = require('./routes/review');

const authorize = require('./middlewares/authorize');

const app = express();
app.use(cookieParser());  // ***
app.use(bodyParser.json()); // ***
app.use('/api/reviews', reviewRouter);  // ***

// Connect Database
connectMongo();

// navbar สำหรับทุกหน้า
// static frontend (HTML / CSS / JS)
app.use(express.static(path.join(__dirname, 'web')));

app.get("/", (req, res) => {
  console.log("Hello there ! ");
  res.send("Hello there ! ");
});


// ====================== MySQL ======================

// --- การใช้งาน Router ใหม่ ---
// API สำหรับ Authentication (Register, Login)
// ไฟล์ app.js รับ request และส่งต่อไปที่ auth.js (URL ที่ frontend เรียก /api/auth/login, /api/auth/register จะไปที่ไฟล์ routes/auth.js)
app.use('/api/auth', authRouter); // เข้าถึงได้ที่ /api/auth/register, /api/auth/login

// API สำหรับ Product Management (CRUD)
app.use('/api/products', productRouter); // เข้าถึงได้ที่ /api/products (POST, GET) หรือ /api/products/:id (PUT, DELETE)


app.use('/api/cart', authorize(['customer', 'admin']), cartRouter);



app.use('/api/address', authorize, addressRouter);


app.use('/api/order', authorize(['customer', 'admin']), orderRouter); // แก้จากอันบน (ให้เข้าได้เฉพาะ 'customer', 'admin' )



// ====================== API Frontend + กำหนดสิทธิ์ การเข้าถึงแต่ละหน้า ======================

app.get('/mystore', authorize(['admin','sales','customer']), (req, res) => {
  res.sendFile(path.join(__dirname, 'web/index.html'));
});


app.get('/productsale', authorize(['sales','admin']), (req, res) => {
  res.sendFile(path.join(__dirname, 'web/ProductSale.html'));
});


app.get('/productcust', authorize(['customer']), (req, res) => {
  res.sendFile(path.join(__dirname, 'web/ProductCustomer.html'));
});


app.get("/contact", authorize(['customer','admin', 'sales']), (req, res) => {
  res.sendFile(__dirname + '/web/Contact.html');
});

// เพิ่มมา
app.get("/order", authorize(['customer', 'admin']), (req, res) => {
  res.sendFile(path.join(__dirname, 'web/Order.html'));
});

app.get("/cart", authorize(['customer', 'admin']), (req, res) => {
  res.sendFile(path.join(__dirname, 'web/Cart.html'));
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + '/web/login.html');
});




// app.listen(3000, () => {
//   console.log("App listening on port 3000! ")
// });

// สำหรับ Docker
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => console.log(`Server running on ${PORT}`));
