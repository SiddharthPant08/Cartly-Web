import express from "express"
import cors from "cors"
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from "./routes/authRoutes.js"
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from "./routes/orderRoutes.js"
import categoryRoutes from './routes/categoryRoutes.js'

dotenv.config();

const app = express();

connectDB();
app.use(cors());
app.use(express.json());

app.use("/api/auth",authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes)
app.use("/api/orders", orderRoutes)
app.use('/api/categories', categoryRoutes)


app.get('/',(req,res)=>{
    res.json({
        success:true,
        message:"API Working"
    })
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Cartly server running on port ${PORT}`);
});