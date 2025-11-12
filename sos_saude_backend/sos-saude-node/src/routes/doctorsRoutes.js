const express = require("express");
const router = express.Router();
const DoctorsController = require("../controllers/doctorsController");

router.get("/", DoctorsController.getAll);
router.get("/:id", DoctorsController.getById);
router.post("/", DoctorsController.create);
router.put("/:id", DoctorsController.update);
router.delete("/:id", DoctorsController.remove);
router.get("/stats/:id", DoctorsController.getStats);

module.exports = router;