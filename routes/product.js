const express = require('express');
const { ecommerceDB } = require('../config/dbMySQL');
const router = express.Router();
const authorize = require('../middlewares/authorize');

// CREATE
// เพิ่มสินค้า (admin + sales)
router.post(
  '/',
  authorize(['admin', 'sales']),
  async (req, res) => {
    const { name, description, price, stock, img_url } = req.body;

     // ตรวจสอบความครบถ้วนของข้อมูล (Input Validation) ก่อนส่งเข้า database
    if (!name || price === undefined || stock === undefined) {  // field >> name, price, stock จำเป็นต้องมี
      return res.status(400).json({
        message: 'Missing required fields: name, price, stock'
      });
    }

    try {
      const [result] = await ecommerceDB.execute(
        'INSERT INTO products(name, description, price, stock, img_url) VALUES(?, ?, ?, ?, ?)',
        [
          name,
          description || null,  // ถ้า description ไม่มี ให้ใส่เป็น null
          Number(price),        // ตรวจสอบและแปลงเป็นตัวเลขทศนิยม
          Number(stock),        // ตรวจสอบและแปลงเป็นจำนวนเต็ม
          img_url || null       // ถ้าไม่มี ให้ใส่เป็น null
        ]
      );

      res.status(201).json({
        message: 'Product added successfully',
        productId: result.insertId
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// แก้ไขสินค้า (admin + sales)
router.put(
  '/:id',
  authorize(['admin', 'sales']),
  async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, img_url } = req.body;

    // ตรวจสอบว่ามีข้อมูลตอ้งแก้ไข (อย่างน้อย 1 ฟิลด์)
    if (
      name === undefined &&
      description === undefined &&
      price === undefined &&
      stock === undefined &&
      img_url === undefined
    ) {
      return res.status(400).json({ message: 'No update fields provided' });
    }

    try {
      const updates = [];
      const values = [];

      if (name !== undefined) {
        updates.push('name = ?');
        values.push(name);
      }
      if (description !== undefined) {
        updates.push('description = ?');
        values.push(description || null);
      }
      if (price !== undefined) {
        updates.push('price = ?');
        values.push(Number(price));
      }
      if (stock !== undefined) {
        updates.push('stock = ?');
        values.push(Number(stock));
      }
      if (img_url !== undefined) {
        updates.push('img_url = ?');
        values.push(img_url || null);
      }

      const sql = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
      values.push(id);

      const [result] = await ecommerceDB.execute(sql, values);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product updated successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//  DELETE 
// ลบสินค้า (admin เท่านั้น)
router.delete(
  '/:id',
  authorize(['admin','sales']),
  async (req, res) => {
    const { id } = req.params;

    // Query สำหรับลบสินค้า
    try {
      const [result] = await ecommerceDB.execute(
        'DELETE FROM products WHERE id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Product not found' });
      }

      res.json({ message: 'Product deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);


// ดูสินค้าทั้งหมด (ทุก role)
router.get(
  '/',
  authorize(['admin', 'sales', 'customer']),
  async (req, res) => {
    const [rows] = await ecommerceDB.execute('SELECT * FROM products');
    res.json(rows);
  }
);

// ดูสินค้าตาม ID (ทุก role)
router.get(
  '/:id',
  authorize(['admin', 'sales', 'customer']),
  async (req, res) => {
    const [rows] = await ecommerceDB.execute(
      'SELECT * FROM products WHERE id = ?',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(rows[0]);
  }
);

module.exports = router;
