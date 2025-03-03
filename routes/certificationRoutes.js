const express = require('express');
const router = express.Router();
const certificationController = require('../controllers/cerificationController');
const { protect, admin } = require('../middleware/auth');

// Public Routes (No authentication required)
router.get('/status/:status', certificationController.getCertificationsByStatus);
router.get('/email/:email', certificationController.getCertificationsByEmail);
router.get('/payment-method/:method', certificationController.getCertificationsByPaymentMethod);

// Protected Routes (Require authentication)
router.get('/', protect, certificationController.getAllCertifications);
router.get('/total-amount', protect, admin, certificationController.getTotalAmountPaid);
router.get('/:id', protect, certificationController.getCertificationById);

// Admin-Only Routes (Require authentication + admin privileges)
router.post('/create', protect, admin, certificationController.createCertification);
router.put('/:id', protect, admin, certificationController.updateCertification);
router.patch('/:id/status', protect, admin, certificationController.updateCertificationStatus);
router.delete('/:id', protect, admin, certificationController.deleteCertification);

// New routes for approve and reject
router.patch('/:id/approve', protect, admin, certificationController.approveCertification);
router.patch('/:id/reject', protect, admin, certificationController.rejectCertification);

module.exports = router;