import { useState } from "react"
import { analyzeFood } from "../services/foodService"

function Dashboard() {
  const [food, setFood] = useState("")
  const [nutrition, setNutrition] = useState(null)
  const [exercisePlan, setExercisePlan] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeFoodHandler = async () => {
    if (!food.trim()) {
      alert("Enter food details")
      return
    }

    setLoading(true)
    try {
      const res = await analyzeFood(food)

      setNutrition(res.data.nutrition)
      setExercisePlan(res.data.exercisePlan)

      setFood("")
    } catch (error) {
      alert(error.response?.data?.message || "Analysis failed")
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }}
          className="text-red-600 font-semibold"
        >
          Logout
        </button>
      </div>

      <div className="bg-white p-4 rounded shadow mb-6">
        <textarea
          className="w-full border p-2 rounded mb-3"
          rows="3"
          placeholder="Example: 2 chapatis, paneer curry, banana"
          value={food}
          onChange={(e) => setFood(e.target.value)}
        />

        <button
          onClick={analyzeFoodHandler}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Analyzing..." : "Analyze Food"}
        </button>
      </div>


      {nutrition && (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-semibold mb-2">
            Nutrition Breakdown
          </h2>

          <p><strong>Calories:</strong> {nutrition.calories} kcal</p>
          <p><strong>Protein:</strong> {nutrition.protein} g</p>
          <p><strong>Carbs:</strong> {nutrition.carbs} g</p>
          <p><strong>Fats:</strong> {nutrition.fats} g</p>
        </div>
      )}


      {exercisePlan && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-3">
            Exercise Suggestions ({exercisePlan.timeContext})
          </h2>

          <div className="mb-3">
            <h3 className="font-semibold text-green-600 mb-1">
              Light
            </h3>
            <ul className="list-disc ml-5 text-sm">
              {exercisePlan.light.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>

          <div className="mb-3">
            <h3 className="font-semibold text-yellow-600 mb-1">
              Moderate
            </h3>
            <ul className="list-disc ml-5 text-sm">
              {exercisePlan.moderate.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-1">
              Intense
            </h3>
            <ul className="list-disc ml-5 text-sm">
              {exercisePlan.intense.map((ex, i) => (
                <li key={i}>{ex}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
