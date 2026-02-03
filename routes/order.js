const express = require('express');
const { ecommerceDB } = require('../config/dbMySQL');
const router = express.Router();

// ✅ GET carts (order list) จาก table cart
router.get('/carts', async (req, res) => {
  try {
    const role = req.user?.role;
    const userId = req.user?.user_id;

    // admin เห็นทั้งหมด
    if (role === 'admin') {
      const [rows] = await ecommerceDB.execute(
        'SELECT id, user_id, listcart, total_price, created_at FROM cart ORDER BY created_at DESC'
      );
      return res.status(200).json(rows);
    }

    // customer เห็นของตัวเอง
    if (role === 'customer') {
      if (!userId) {
        return res.status(401).json({ message: 'Missing user_id in token' });
      }
      const [rows] = await ecommerceDB.execute(
        'SELECT id, user_id, listcart, total_price, created_at FROM cart WHERE user_id = ? ORDER BY created_at DESC',
        [Number.parseInt(userId)]
      );
      return res.status(200).json(rows);
    }

    return res.status(403).json({ message: 'Access denied' });

  } catch (error) {
    console.error('Error fetching carts:', error);
    res.status(500).json({ message: 'Failed to retrieve carts', error: error.message });
  }
});

// ✅ DELETE cart by id (admin only)
router.delete('/carts/:id', async (req, res) => {
  try {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ message: 'Admin only' });
    }

    const { id } = req.params;

    const [result] = await ecommerceDB.execute(
      'DELETE FROM cart WHERE id = ?',
      [Number.parseInt(id)]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted successfully' });

  } catch (error) {
    console.error('Error deleting cart:', error);
    res.status(500).json({ message: 'Failed to delete order', error: error.message });
  }
});

module.exports = router;
