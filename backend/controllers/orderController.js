import Order from '../models/Order.js'
import Cart from '../models/Cart.js'
import Product from '../models/Product.js'


//API to create order
export const createOrder = async (req, res) => {
  try {
    const {
      shippingAddress,
      paymentMethod,
    } = req.body

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address and payment method are required',
      })
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    }).populate('items.product')

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty',
      })
    }

    for (const item of cart.items) {
      if (!item.product) {
        return res.status(400).json({
          success: false,
          message: 'A product in your cart no longer exists',
        })
      }

      if (item.product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${item.product.title} does not have enough stock`,
        })
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      title: item.product.title,
      image: item.product.images?.[0] || '',
      price: item.product.price,
      quantity: item.quantity,
    }))

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    )

    const shipping = subtotal >= 999 ? 0 : 79
    const total = subtotal + shipping

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shipping,
      total,
    })

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.product._id,
        {
          $inc: {
            stock: -item.quantity,
          },
        }
      )
    }

    cart.items = []
    await cart.save()

    return res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order,
    })
  } catch (error) {
    console.error('Create order error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while creating order',
    })
  }
}


//API to get the orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate('items.product')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error('Get orders error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
    })
  }
}



//API to get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('items.product')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    return res.status(200).json({
      success: true,
      order,
    })
  } catch (error) {
    console.error('Get order error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching order',
    })
  }
}


// ADMIN: Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('items.product')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      orders,
    })
  } catch (error) {
    console.error('Get all orders error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching all orders',
    })
  }
}


// ADMIN: Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body

    const allowedStatuses = [
      'pending',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
    ]

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status',
      })
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('user', 'name email')
      .populate('items.product')

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully',
      order,
    })
  } catch (error) {
    console.error('Update order status error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
    })
  }
}

// ADMIN: Dashboard statistics
export const getOrderStats = async (req, res) => {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      revenueResult,
    ] = await Promise.all([
      Order.countDocuments(),

      Order.countDocuments({
        status: 'pending',
      }),

      Order.countDocuments({
        status: 'delivered',
      }),

      Order.aggregate([
        {
          $match: {
            status: { $ne: 'cancelled' },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: '$total',
            },
          },
        },
      ]),
    ])

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
      },
    })
  } catch (error) {
    console.error('Get order stats error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching order statistics',
    })
  }
}