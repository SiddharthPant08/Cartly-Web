import express from 'express';
import { getMe, loginUser, registerUser } from '../controllers/authController.js';
import { loginValidation, registerValidation } from '../middleware/validateAuth.js';
import { protect } from '../middleware/authMiddleware.js';
import { getAddresses,removeAddress,addAddress } from '../controllers/authController.js';
import { updateProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerValidation, registerUser);
router.post("/login",loginValidation,loginUser)
router.get('/me', protect, getMe);
router.get('/addresses', protect, getAddresses)
router.post('/addresses', protect, addAddress)
router.delete('/addresses/:id', protect, removeAddress)
router.put('/profile', protect, updateProfile)

export default router;