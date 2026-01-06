const { GoogleGenerativeAI } = require("@google/generative-ai")
const Meal = require("../models/Meal")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * ANALYZE FOOD USING GEMINI (FREE SDK)
 */
exports.analyzeFood = async (req, res) => {
  try {
    const { foodText } = req.body

    if (!foodText || !foodText.trim()) {
      return res.status(400).json({ message: "Food text is required" })
    }

    // ✅ Use FREE supported model
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const prompt = `
You are a nutrition calculation engine.

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- No extra text
- calories should be kcal and other should be in grams

Input:
"${foodText}"

Output format:
{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}
`
    const result = await model.generateContent(prompt)
    const text = result.response.text()

const jsonMatch = text.match(/\{[\s\S]*\}/)

if (!jsonMatch) {
  return res.status(500).json({
    message: "AI did not return JSON",
    raw: text
  })
}

let nutrition
try {
  nutrition = JSON.parse(jsonMatch[0])
} catch {
  return res.status(500).json({
    message: "Failed to parse nutrition JSON",
    raw: jsonMatch[0]
  })
}


    await Meal.create({
      user: req.userId,
      foodText,
      ...nutrition
    })

    res.json(nutrition)
  } catch (error) {
    console.error("Gemini SDK Error:", error.message)
    res.status(500).json({ message: "Food analysis failed" })
  }
}

/**
 * GET MEAL HISTORY
 */
exports.getMealHistory = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.userId }).sort({
      createdAt: -1
    })
    res.json(meals)
  } catch {
    res.status(500).json({ message: "Failed to fetch meals" })
  }
}
