const express = require("express");
const router = express.Router();

// 1. Import Auth Middleware (Only Once)
const { protect, restrictTo } = require("../middlewares/authMiddleware");

// 2. Import Controllers (Only Once)
const {
  createFoodItem,
  getFoodItems,
  analyzeFoodWithAI,
} = require("../controllers/foodController");

// --- DEBUG LOGGING ---
console.log("Checking Imports in foodRoutes.js:");
console.log("1. protect:", protect);
console.log("2. getFoodItems:", getFoodItems);
console.log("3. analyzeFoodWithAI:", analyzeFoodWithAI);
// ---------------------

// --- ROUTES ---

// Search food items (Available to Dietitian & Patient)
router.get("/", protect, getFoodItems);

// Analyze food with AI (Available to Dietitian & Patient)
router.post("/analyze", protect, analyzeFoodWithAI);

// Create new food manually (Restricted to Dietitians only)
router.post("/", protect, restrictTo("dietitian"), createFoodItem);

module.exports = router;
