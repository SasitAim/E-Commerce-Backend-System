// ต่อ database และ api สำหรับ create, update และ delete สินค้า

const mysql = require("mysql2");
const pool = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root092025",
  database: "ecommerce",
});

const db = pool.promise();

module.exports = db;