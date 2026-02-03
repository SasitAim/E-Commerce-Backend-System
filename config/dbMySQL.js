// เชื่อมต่อกับ database (MySQL)
const mysql = require("mysql2/promise");
require("dotenv").config();

// Connection สำหรับ Connect database ของโปรเจคชื่อ ecommerce 
const pool = mysql.createPool({
  host: process.env.ECOM_DB_HOST,
  port: process.env.ECOM_DB_PORT,
  user: process.env.ECOM_DB_USER,
  password: process.env.ECOM_DB_PASSWORD,
  database: process.env.ECOM_DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

// Export
module.exports = {
  authDB: pool,
  ecommerceDB: pool,
};
