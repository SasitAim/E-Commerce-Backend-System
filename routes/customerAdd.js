// routes/customerAdd.js
const express = require('express');
const { ecommerceDB } = require('../config/dbMySQL');
const router = express.Router();

// Create address
router.post('/', async (req, res) => {
  const {
    cart_id,
    first_name,
    last_name,
    email,
    address1,
    address2,
    country,
    state,
    zip
  } = req.body;

  if (!cart_id || !first_name || !last_name || !address1 || !country || !state || !zip) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const [result] = await ecommerceDB.execute(
      `INSERT INTO customer_address
        (cart_id, first_name, last_name, email, address1, address2, country, state, zip)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        Number(cart_id),
        first_name,
        last_name,
        email || null,
        address1,
        address2 || null,
        country,
        state,
        zip
      ]
    );

    res.status(201).json({
      message: 'Address added successfully',
      id: result.insertId
    });
  } catch (error) {
    console.error("Error creating address:", error);
    res.status(500).json({ error: error.message });
  }
});

// Update address
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  const allowFields = ['first_name', 'last_name', 'email', 'address1', 'address2', 'country', 'state', 'zip'];
  const updates = [];
  const values = [];

  for (const key of allowFields) {
    if (req.body[key] !== undefined) {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    }
  }

  if (updates.length === 0) {
    return res.status(400).json({ message: 'No update fields provided' });
  }

  try {
    const sql = `UPDATE customer_address SET ${updates.join(', ')} WHERE id = ?`;
    values.push(Number(id));

    const [result] = await ecommerceDB.execute(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Address not found' });
    }

    res.status(200).json({ message: 'Address updated successfully' });
  } catch (error) {
    console.error("Error updating address:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
