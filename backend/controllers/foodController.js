const { GoogleGenerativeAI } = require("@google/generative-ai")
const Meal = require("../models/Meal")


const getTimeOfDay = () => {
  const hour = new Date().getHours()

  if (hour >= 5 && hour < 11) return "Morning"
  if (hour >= 11 && hour < 16) return "Afternoon"
  if (hour >= 16 && hour < 20) return "Evening"
  return "Night"
}


const extractJSON = (text) => {
  const match = text.match(/\{[\s\S]*\}/)
  if (!match) return null
  try {
    return JSON.parse(match[0])
  } catch {
    return null
  }
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)


exports.analyzeFood = async (req, res) => {
  try {
    const { foodText } = req.body

    if (!foodText || !foodText.trim()) {
      return res.status(400).json({ message: "Food text is required" })
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const nutritionPrompt = `
You are a nutrition calculation engine.

STRICT RULES:
- Output ONLY valid JSON
- No explanation
- No markdown
- calories must be in kcal
- protein, carbs, fats must be in grams

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

    const nutritionResult = await model.generateContent(nutritionPrompt)
    const nutritionText = nutritionResult.response.text()

    const nutrition = extractJSON(nutritionText)
    if (!nutrition) {
      return res.status(500).json({
        message: "Invalid nutrition JSON from AI",
        raw: nutritionText
      })
    }

    const timeOfDay = getTimeOfDay()

    const exercisePrompt = `
You are a certified fitness coach.

User consumed approximately ${nutrition.calories} kcal.
Current time of day: ${timeOfDay}.

Rules:
- If time is Night, suggest exercises for the next Morning
- Avoid unsafe exercises late at night
- Provide 3 levels:
  - Light
  - Moderate
  - Intense
- Exercises should help burn similar calories
- Output ONLY valid JSON
- No explanation or markdown

JSON format:
{
  "timeContext": string,
  "light": [string],
  "moderate": [string],
  "intense": [string]
}
`

    const exerciseResult = await model.generateContent(exercisePrompt)
    const exerciseText = exerciseResult.response.text()

    const exercisePlan = extractJSON(exerciseText)
    if (!exercisePlan) {
      return res.status(500).json({
        message: "Invalid exercise JSON from AI",
        raw: exerciseText
      })
    }

    await Meal.create({
      user: req.userId,
      foodText,
      calories: nutrition.calories,
      protein: nutrition.protein,
      carbs: nutrition.carbs,
      fats: nutrition.fats
    })

    res.json({
      nutrition,
      exercisePlan
    })
  } catch (error) {
    console.error("Gemini SDK Error:", error.message)
    res.status(500).json({
      message: "Food analysis failed"
    })
  }
}


exports.getMealHistory = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.userId })
      .sort({ createdAt: -1 })

    res.json(meals)
  } catch {
    res.status(500).json({
      message: "Failed to fetch meal history"
    })
  }
}
