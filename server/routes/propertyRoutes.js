import express from 'express';
import {
  getProperties,
  getRecentProperties,
  getPropertyStats,
  getPropertyById,
  getMyProperties,
  createProperty,
  updateProperty,
  deleteProperty
} from '../controllers/propertyController.js';
import { protect, retailerOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getProperties);
router.get('/recent', getRecentProperties);
router.get('/stats', getPropertyStats);

// Retailer protected routes (placed before /:id to prevent routing conflict)
router.get('/my/listings', protect, retailerOnly, getMyProperties);

// Specific property routes
router.get('/:id', getPropertyById);
router.post('/', protect, retailerOnly, createProperty);
router.put('/:id', protect, retailerOnly, updateProperty);
router.delete('/:id', protect, retailerOnly, deleteProperty);

export default router;
