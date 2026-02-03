// routes/cart.js
const express = require('express');
const { ecommerceDB } = require('../config/dbMySQL');
const router = express.Router();

router.post('/', async (req, res) => {
    console.log("Test API")
    console.log(req.body)
    // res.json("Test OK ?")

    const user_id = req.user?.user_id; // จาก authorize middleware

    // รองรับทั้งแบบส่งมา {items: cartData} และส่ง cartData ตรงๆ
    const payload = req.body?.items ?? req.body;

    const billing_address = payload?.billing_address;
    const cart_checkout = payload?.cart_checkout;

    const listcart = cart_checkout?.listcart;
    const total_price = cart_checkout?.total_price;

    console.log(user_id)    // check
    if (!user_id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!Array.isArray(listcart) || listcart.length === 0) {
        return res.status(400).json({ message: 'Missing listcart (cart items)' });
    }

    if (total_price === undefined || total_price === null || Number.isNaN(Number(total_price))) {
        return res.status(400).json({ message: 'Missing total_price' });
    }

    if (!billing_address) {
        return res.status(400).json({ message: 'Missing billing_address' });
    }

    // แก้ไข
    const first_name = billing_address.first_name;
    const last_name = billing_address.last_name;
    const email = billing_address.email || null;
    const address1 = billing_address.address1;
    const address2 = billing_address.address2 || null;
    const country = billing_address.country;
    const state = billing_address.state;
    const zip = billing_address.zip;

    if (!first_name || !last_name || !address1 || !country || !state || !zip) {
        return res.status(400).json({ message: 'billing_address fields missing' });
    }

    let conn;
    try {
        conn = await ecommerceDB.getConnection();
        await conn.beginTransaction();

        // 1) insert cart (เก็บ listcart เป็น JSON)
        const [cartResult] = await conn.execute(
            'INSERT INTO cart (user_id, listcart, total_price) VALUES (?, ?, ?)',
            [user_id, JSON.stringify(listcart), Number(total_price)]
        );

        const cart_id = cartResult.insertId;

        // 2) insert address ผูก cart_id
        await conn.execute(
            `INSERT INTO customer_address
        (cart_id, first_name, last_name, email, address1, address2, country, state, zip)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [cart_id, first_name, last_name, email, address1, address2, country, state, zip]
        );

        await conn.commit();

        return res.status(201).json({
            message: 'Checkout successful',
            cart_id
        });

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
