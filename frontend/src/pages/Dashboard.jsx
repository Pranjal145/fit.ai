import { useState } from "react"
import { analyzeFood } from "../services/foodService"

function Dashboard() {
  const [food, setFood] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const analyzeFoodHandler = async () => {
  if (!food.trim()) {
    alert("Enter food details")
    return
  }

  setLoading(true)
  try {
    const res = await analyzeFood(food)
    setResult(res.data)
    setFood("")
  } catch (error) {
    alert(error.response?.data?.message || "Analysis failed")
  }
  setLoading(false)
}


  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={() => {
            localStorage.removeItem("token")
            window.location.href = "/login"
          }}
          className="text-red-600"
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

      {result && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">
            Nutrition Breakdown
          </h2>
           <p><strong>Calories:</strong> {result.calories} kcal</p>
  <p><strong>Protein:</strong> {result.protein} g</p>
  <p><strong>Carbs:</strong> {result.carbs} g</p>
  <p><strong>Fats:</strong> {result.fats} g</p>
        </div>
      )}
    </div>
  )
}

export default Dashboard
