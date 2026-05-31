const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const getDb = (req) => req.app.locals.db;

router.get('/', (req, res) => {
  const db = getDb(req);
  const orders = db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all();
  res.json({ data: orders });
});

router.post('/', (req, res) => {
  const db = getDb(req);
  const { customer_name, customer_email, items, total_amount, order_type = 'dine-in', delivery_address, booking_id } = req.body;

  const id = uuidv4();
  db.prepare(`
    INSERT INTO orders (id, booking_id, customer_name, customer_email, items, total_amount, order_type, delivery_address)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(id, booking_id || null, customer_name, customer_email, JSON.stringify(items), total_amount, order_type, delivery_address);

  res.status(201).json({ success: true, id });
});

router.patch('/:id', (req, res) => {
  const db = getDb(req);
  const { status } = req.body;
  db.prepare('UPDATE orders SET status = ?, updated_at = datetime("now") WHERE id = ?')
    .run(status, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  const db = getDb(req);
  db.prepare('UPDATE orders SET status = "cancelled" WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;
