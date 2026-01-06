const mongoose = require("mongoose")

const mealSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    foodText: {
      type: String,
      required: true
    },
    calories: Number,
    protein: Number,
    carbs: Number,
    fats: Number
  },
  { timestamps: true }
)

module.exports = mongoose.model("Meal", mealSchema)
