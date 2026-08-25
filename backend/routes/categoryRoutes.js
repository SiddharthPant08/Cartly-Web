import express from 'express'

const router = express.Router()

const categories = [
  {
    id: 'electronics',
    name: 'Electronics',
  },
  {
    id: 'fashion',
    name: 'Fashion',
  },
  {
    id: 'beauty',
    name: 'Beauty',
  },
  {
    id: 'home',
    name: 'Home & Living',
  },
  {
    id: 'sports',
    name: 'Sports',
  },
  {
    id: 'books',
    name: 'Books',
  },
  {
    id: 'toys',
    name: 'Toys & Kids',
  },
  {
    id: 'grocery',
    name: 'Grocery',
  },
]

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    categories,
  })
})

export default router