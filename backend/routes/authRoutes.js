import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  getUsers,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/login', authUser);
router.post('/register', registerUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/users').get(protect, admin, getUsers);

export default router;
