const express = require("express");
const router = express.Router();
const MedicalRecordsController = require("../controllers/medicalRecordsController");
const { authenticateToken, authorize } = require("../middleware/authMiddleware");

router.get("/", authenticateToken, authorize(["Doctor", "Admin"]), MedicalRecordsController.getAll);
router.get("/:id", authenticateToken, authorize(["Doctor", "Admin"]), MedicalRecordsController.getById);
router.get("/patient/:id", authenticateToken, authorize(["Doctor", "Admin", "Patient"]), MedicalRecordsController.getByPatient);
router.post("/", authenticateToken, authorize(["Doctor"]), MedicalRecordsController.create);
router.put("/:id", authenticateToken, authorize(["Doctor"]), MedicalRecordsController.update);
router.delete("/:id", authenticateToken, authorize(["Admin"]), MedicalRecordsController.remove);

module.exports = router;