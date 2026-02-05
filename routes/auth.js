// ส่วน Import และสร้าง Router
const express = require('express');
const bcrypt = require('bcrypt');
const { authDB } = require('../config/dbMySQL');
const jwt = require('jsonwebtoken');

const router = express.Router(); // ถ้าแยกเส้น api ไว้ในโฟลเดอร์ routes ใช้ express.Router()

const JWT_SECRET = 'my_super_secret_key';
const COOKIE_NAME = 'token';


/* ================= REGISTER ================= */
// เปลี่ยนจาก app.post("/register",... เป็น router.post("/register",...
router.post('/register', async (req, res) => {                  // ใช้ async เพราะต้องรอข้อมูลไปใส่ (ต้องรอข้อมูล username, password)
    const { username, password, confirmPassword } = req.body;   // เพิ่ม confirmPassword เพราะ front end มีให้ confirm password

    // ตรวจสอบเบื้องต้น
    if (!username || !password || !confirmPassword) {
        return res.status(400).json({
            message: 'Username, password, and confirm password are required'
        });
    }

    // เช็ค password กับ confirmPassword
    if (password !== confirmPassword) {
        return res.status(400).json({
            message: 'Password and confirm password do not match'
        });
    }

    try {
        // เช็คว่า user มีอยุ่ใน database แล้วหรือไม่
        const [existingUser] = await authDB.execute(
            'SELECT id FROM users WHERE username = ?',
            [username]
        );

        if (existingUser.length > 0) {  // เช็คว่า user มีอยู่รึป่าว
            return res.status(400).json({ message: 'Username already exists' });
        }

        // hash password
        const hashedpassword = await bcrypt.hash(password, 10);
        // กำหนด role เริ่มต้น (ทุกคนที่ register จะมี role เป็น customer)
        const role = 'customer';

        // Insert username and hashedpassword to database
        await authDB.execute(
            'INSERT INTO users (username, hashedpassword, role) VALUES (?, ?, ?)',
            [username, hashedpassword, role]
        );

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ================= LOGIN ================= */
router.post('/login', async (req, res) => {
    const { username, password } = req.body;    // ดึงข้อมูล username และ password จาก (Frontend)

    try {   // ค้นหาข้อมูล user ว่ามีใน Database หรือไม่
        const [rows] = await authDB.execute(
            'SELECT * FROM users WHERE username = ?',
            [username]
        );
            // ถ้าไม่มีแสดงข้อความตามนี้
        if (rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = rows[0];
        const isPasswordValid = await bcrypt.compare(password, user.hashedpassword); // เทียบรหัสที่ส่งมา กับที่ hash ไว้

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' }); 
        }

        const token = jwt.sign(  // สร้าง Token โดยฝังข้อมูลผู้ใช้ลงไป (ID, Role)
            {
                user_id: user.id,
                username: user.username,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '1h' } // อายุ token
        );

        // JWT เก็บใน cookie (ต้องใส่หลังจาก Login แล้ว)
        res.cookie(COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000
        });

        // ส่ง user ให้ frontend เอาชื่อ user ไปแสดงเมื่อ login แล้ว
        res.json({
            message: 'Login success',
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            },
            token:token
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

/* ================= LOGOUT ================= */
router.post('/logout', (req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ message: 'Logout success' });
});

module.exports = router;
