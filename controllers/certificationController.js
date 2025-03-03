const Certification = require('../models/Certification');
const sendEmail = require('../utils/sendEmail');

// 1. Create new certification
exports.createCertification = async (req, res) => {
    try {
        const certification = await Certification.create(req.body);
        res.status(201).json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 2. Get all certifications
exports.getAllCertifications = async (req, res) => {
    try {
        const certifications = await Certification.findAll();
        res.status(200).json(certifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Get single certification by ID
exports.getCertificationById = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }
        res.status(200).json(certification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Update certification
exports.updateCertification = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }
        await certification.update(req.body);
        res.status(200).json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 5. Delete certification
exports.deleteCertification = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }
        await certification.destroy();
        res.status(200).json({ message: "Certification deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. Get certifications by status
exports.getCertificationsByStatus = async (req, res) => {
    try {
        const certifications = await Certification.findAll({
            where: { status: req.params.status }
        });
        res.status(200).json(certifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Get certifications by email
exports.getCertificationsByEmail = async (req, res) => {
    try {
        const certifications = await Certification.findAll({
            where: { email: req.params.email }
        });
        res.status(200).json(certifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 8. Get total amount paid
exports.getTotalAmountPaid = async (req, res) => {
    try {
        const totalAmount = await Certification.sum('amountPaid') || 0;
        res.status(200).json({ totalAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 9. Get certifications by payment method
exports.getCertificationsByPaymentMethod = async (req, res) => {
    try {
        const certifications = await Certification.findAll({
            where: { paymentMethod: req.params.method }
        });
        res.status(200).json(certifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 10. Update certification status
exports.updateCertificationStatus = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }
        certification.status = req.body.status;
        await certification.save();
        res.status(200).json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 11. Approve certification (with email notification)
exports.approveCertification = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }

        certification.status = "approved";
        await certification.save();

        const emailText = Dear ${certification.firstName} ${certification.lastName},\n\n
            + `Your certification (${certification.certName}) has been approved. `
            + Thank you for your payment of $${certification.amountPaid}.\n\n
            + Best regards,\nThe Certification Team;

        await sendEmail(
            certification.email,
            "Certification Approved",
            emailText
        );

        res.status(200).json({ 
            message: "Certification approved successfully", 
            certification 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// 12. Reject certification (with email notification)
exports.rejectCertification = async (req, res) => {
    try {
        const certification = await Certification.findByPk(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: "Certification not found" });
        }

        certification.status = "rejected";
        await certification.save();

        const emailText = Dear ${certification.firstName} ${certification.lastName},\n\n
            + `We regret to inform you that your certification (${certification.certName}) `
            + has been rejected. If you have any questions, please contact us.\n\n
            + Best regards,\nThe Certification Team;

        await sendEmail(
            certification.email,
            "Certification Rejected",
            emailText
        );

        res.status(200).json({ 
            message: "Certification rejected successfully", 
            certification 
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};