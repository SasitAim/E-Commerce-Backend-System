// จัดการการเชื่อมต่อกับ database (mongoDB)
const mongoose = require('mongoose');   // ประกาศใช้งาน mongoose
const dotenv = require('dotenv');       // ถ้าใช้ dotenv ต้องมี

dotenv.config();

const connectMongo = async () => {     // ใช้ async เพื่อรอ connect DB ก่อน ถึงจะสามารถทำงานได้
    // try ถ้าโค้ดไม่มีปัญา (ต่อ db ได้) console log ออกมาว่าต่อแล้ว ถ้ามีปัญหา >> catch  ส่ง error message
    try { 
        await mongoose.connect(process.env.MONGO_URI); // await ให้ส่วนนี้ทำงานก่อน ฟังก์ชั่นถัดไปถึงจะทำงานได้
        console.log(`Connected to: ${mongoose.connection.name}`); 
    } catch (err) {
        console.error('Connection Error:', err.message);
        process.exit(1);
    }
};

module.exports = connectMongo;