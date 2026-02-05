// ส่วน Import และสร้าง Router
const express = require('express');
const { ecommerceDB } = require('../config/dbMySQL');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Test API")
    console.log(req.body)

    const user_id = req.user?.user_id; // จาก authorize middleware (ดึง user_id จาก token)

    // รับรูปแบบ payload โดยรับทั้งแบบส่งมา {items: cartData} และส่ง cartData ตรงๆ
    const payload = req.body?.items ?? req.body;

    const billing_address = payload?.billing_address;   // จาก billing_address ที่กรอกมา
    const cart_checkout = payload?.cart_checkout;       // จาก cart (สินค้าที่เลือกมา)

    const listcart = cart_checkout?.listcart;
    const total_price = cart_checkout?.total_price;

    console.log(user_id)    // check ไม่มี user_id ไม่ให้ทำต่อ
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check listcart ต้องเป็น array และห้ามเป็นค่าว่าง
    if (!Array.isArray(listcart) || listcart.length === 0) {
        return res.status(400).json({ message: 'Missing listcart (cart items)' });
    }

    // Check total_price ต้องมีข้อมูลและแปลงเป็นตัวเลขได้
    if (total_price === undefined || total_price === null || Number.isNaN(Number(total_price))) {
        return res.status(400).json({ message: 'Missing total_price' });
    }

    // Check billing_address ต้องกรอกข้อมูลส่วนนี้ด้วย
    if (!billing_address) {
        return res.status(400).json({ message: 'Missing billing_address' });
    }

    // เตรียมข้อมูลที่อยู่ และ เช็ค field 
    const first_name = billing_address.first_name;
    const last_name = billing_address.last_name;
    const email = billing_address.email || null;        // เป็น null ได้ (ไม่กรอกก็ได้)
    const address1 = billing_address.address1;
    const address2 = billing_address.address2 || null;  // เป็น null ได้ (ไม่กรอกก็ได้)
    const country = billing_address.country;
    const state = billing_address.state;
    const zip = billing_address.zip;

    if (!first_name || !last_name || !address1 || !country || !state || !zip) {
        return res.status(400).json({ message: 'billing_address fields missing' });
    }

    // Insert ไปที่ ecommerce Database (แยก 2 table) 
    // สินค้าใน cart เก็บใน table cart, ที่อยู่ (billing_address) เก็บใน table customer_address เก็บแยก table แต่มี cart_id เป็น foreign key/ตัวเชื่อม
    let conn;
    try {
        conn = await ecommerceDB.getConnection();
        await conn.beginTransaction();

        // 1) insert cart (เก็บ listcart เป็น JSON string เพราะในตารางเป็น text/json column)
        const [cartResult] = await conn.execute(
            'INSERT INTO cart (user_id, listcart, total_price) VALUES (?, ?, ?)', // ? ป้องกัน SQL injection
            [user_id, JSON.stringify(listcart), Number(total_price)]
        );

        const cart_id = cartResult.insertId;

        // 2) insert address ผูก cart_id
        await conn.execute(
            `INSERT INTO customer_address
        (cart_id, first_name, last_name, email, address1, address2, country, state, zip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,    // ? ป้องกัน SQL injection
            [cart_id, first_name, last_name, email, address1, address2, country, state, zip]
        );

        await conn.commit();

        // กรอกข้อมูลเสร็จ และกดส่งเรียบร้อย ส่งข้อตวามกลับ
        return res.status(201).json({
            message: 'Checkout successful',
            cart_id
        });

        // ถ้าเกิด error ระหว่าง transaction → rollback ส่วน finally ต้อง release connection กลับ pool ป้องกัน connection ค้างจนเต็ม
    } catch (error) {
        if (conn) await conn.rollback();
        console.error('Checkout failed:', error);
        return res.status(500).json({ message: 'Checkout failed', error: error.message });
    } finally {
        if (conn) conn.release();
    }
});

// ดู cart ของ user ที่ login อยู่
router.get('/', async (req, res) => {
    const user_id = req.user?.user_id;

    try {
        const [rows] = await ecommerceDB.execute(
            'SELECT * FROM cart WHERE user_id = ? ORDER BY id DESC',
            [user_id]
        );
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ message: "Failed to retrieve cart", error: error.message });
    }
});

// ดู cart ตาม id (option: เช็ค user_id ด้วยก็ได้)
router.get('/:id', async (req, res) => {
    const user_id = req.user?.user_id;
    const { id } = req.params;

    try {
        const [rows] = await ecommerceDB.execute(
            'SELECT * FROM cart WHERE id = ? AND user_id = ?',
            [Number(id), user_id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching cart by ID:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
