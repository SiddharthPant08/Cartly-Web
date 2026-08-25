import express from 'express'

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  getOrderStats
} from '../controllers/orderController.js'

import {
  protect,
  adminOnly,
} from '../middleware/authMiddleware.js'

const router = express.Router()

// Logged-in user routes
router.post('/', protect, createOrder)
router.get('/', protect, getMyOrders)
router.get('/admin/stats', protect, adminOnly, getOrderStats)
router.get('/:id', protect, getOrderById)

// Admin routes
router.get('/admin/all', protect, adminOnly, getAllOrders)
router.put('/admin/:id/status', protect, adminOnly, updateOrderStatus)

export default router