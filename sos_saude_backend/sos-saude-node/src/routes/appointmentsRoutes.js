const express = require("express");
const router = express.Router();
const AppointmentsController = require("../controllers/appointmentsController");

router.get("/", AppointmentsController.getAll);
router.get("/:id", AppointmentsController.getById);
router.post("/", AppointmentsController.create);
router.put("/:id", AppointmentsController.update);
router.delete("/:id", AppointmentsController.remove);

module.exports = router;