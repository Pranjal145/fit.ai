const express = require("express")
const router = express.Router()
const protect = require("../middleware/authMiddleware")
const {
  analyzeFood,
  getMealHistory
} = require("../controllers/foodController")

router.post("/analyze", protect, analyzeFood)
router.get("/history", protect, getMealHistory)

module.exports = router
