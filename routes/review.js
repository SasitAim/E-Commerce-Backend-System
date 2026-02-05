// ส่วน Import และสร้าง Router
const express = require("express");
const router = express.Router();
const Review = require("../models/review");
const authorize = require("../middlewares/authorize");

// CREATE REVIEW (customer เท่านั้น)
router.post("/", authorize(['customer']), async (req, res) => {

  try { // รับข้อมูลจาก frontend
    const { rating, comment } = req.body;
    console.log(req.body)

    // ถ้า frontend ส่งข้อมูลไม่ครบ แสดง error (ต้องมีทั้ง review และ rating ส่งมา)
    if ( !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    } 

    console.log(req.user.user_id,req.user.username)

    // สร้าง document ใหม่ใน MongoDB
    const newReview = new Review({
      user_id: req.user.user_id,
      username: req.user.username,
      rating: Number(rating),
      comment: comment
    });
    await newReview.save(); // บันทึก document ลง collection


    res.status(201).json({
      message: "Review created successfully",
      review: newReview
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// GET REVIEWS
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE REVIEW (admin เท่านั้น)
router.delete("/:id", authorize(['admin']), async (req, res) => {
  try {
    await Review.findByIdAndDelete(req.params.id);
    res.json({ message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
