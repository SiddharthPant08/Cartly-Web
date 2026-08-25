import Cart from '../models/Cart.js'
import Product from '../models/Product.js'


//Get Cart API
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product')

    return res.status(200).json({
      success: true,
      cart: cart || { items: [] },
    })
  } catch (error) {
    console.error('Get cart error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while fetching cart',
    })
  }
}


//Add to cart API
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      })
    }

    let cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product: productId,
            quantity,
          },
        ],
      })
    } else {
      const existingItem = cart.items.find(
        (item) => item.product.toString() === productId
      )

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.items.push({
          product: productId,
          quantity,
        })
      }

      await cart.save()
    }

    await cart.populate('items.product')

    return res.status(200).json({
      success: true,
      message: 'Product added to cart',
      cart,
    })
  } catch (error) {
    console.error('Add to cart error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while adding to cart',
    })
  }
}



//Update cart Items API
export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params
    const { quantity } = req.body

    if (quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      })
    }

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    )

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in cart',
      })
    }

    item.quantity = quantity

    await cart.save()
    await cart.populate('items.product')

    return res.status(200).json({
      success: true,
      message: 'Cart updated',
      cart,
    })
  } catch (error) {
    console.error('Update cart error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while updating cart',
    })
  }
}


//Remove from Cart API
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      })
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    )

    await cart.save()
    await cart.populate('items.product')

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart,
    })
  } catch (error) {
    console.error('Remove from cart error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while removing product',
    })
  }
}



//Clear Cart API
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
      return res.status(200).json({
        success: true,
        message: 'Cart already empty',
      })
    }

    cart.items = []

    await cart.save()

    return res.status(200).json({
      success: true,
      message: 'Cart cleared',
      cart,
    })
  } catch (error) {
    console.error('Clear cart error:', error)

    return res.status(500).json({
      success: false,
      message: 'Server error while clearing cart',
    })
  }
}