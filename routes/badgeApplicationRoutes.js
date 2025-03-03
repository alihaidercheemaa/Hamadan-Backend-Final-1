const express = require('express');
const {
  submitBadgeApplication,
  getBadgeApplications,
  getPendingBadgeApplications,
  getApprovedBadgeApplications,
  getRejectedBadgeApplications,
  getBadgeApplicationDetails,
  updateBadgeApplication,
  deleteBadgeApplication,
  approveBadgeApplication,
  rejectBadgeApplication,
} = require('../controllers/badgeApplicationController');

const upload = require('../config/multerConfig'); // Multer for file uploads
const { protect, admin } = require('../middleware/auth'); // Middleware for protected routes
const router = express.Router();

// Public route for submitting badge applications
router.post('/submit', upload.array('uploadedFiles', 5), submitBadgeApplication);

// Routes for fetching applications (Admin only)
router.get('/', protect, admin, getBadgeApplications); // Get all applications with optional status filter
router.get('/pending', protect, admin, getPendingBadgeApplications); // Get pending applications
router.get('/approved', protect, admin, getApprovedBadgeApplications); // Get approved applications
router.get('/rejected', protect, admin, getRejectedBadgeApplications); // Get rejected applications
router.get('/:applicationId', protect, admin, getBadgeApplicationDetails); // Get application details by ID

// Admin-only routes for managing badge applications
router.put('/:applicationId', protect, admin, updateBadgeApplication); // Update an application
router.delete('/:applicationId', protect, admin, deleteBadgeApplication); // Delete an application

// Badge application approval and rejection routes (Admin only)
router.put('/:applicationId/approve', protect, admin, approveBadgeApplication);
router.put('/:applicationId/reject', protect, admin, rejectBadgeApplication);

module.exports = router;