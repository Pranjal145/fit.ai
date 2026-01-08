import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { analyzeFood } from "../services/foodService"

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"))
  const [food, setFood] = useState("")
  const [nutrition, setNutrition] = useState(null)
  const [exercisePlan, setExercisePlan] = useState(null)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleAnalyze = async () => {
    if (!food.trim()) {
      alert("Please enter food details")
      return
    }

    setLoading(true)
    try {
      const res = await analyzeFood(food)
      setNutrition(res.data.nutrition)
      setExercisePlan(res.data.exercisePlan)
      setFood("")
    } catch (err) {
      alert("Analysis failed")
    }
    setLoading(false)
  }

  return (
  <div className="min-h-screen flex">

    <div className="w-[30%] bg-purple-200 flex flex-col items-center p-6 shadow-inner">
      
  
      <div className="w-full flex justify-start mb-8">
        <button
          onClick={() => {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            navigate("/login")
          }}
          className="bg-white text-purple-600 px-4 py-1.5 rounded-xl shadow-sm hover:bg-purple-100 transition"
        >
          Logout
        </button>
      </div>

      <img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
        alt="User"
        className="w-40 h-40 rounded-full mb-5 border-4 border-white shadow-md"
      />

      <h2 className="text-xl font-semibold mb-8">
        {user?.name}
      </h2>

      <button
        onClick={() => navigate("/history")}
        className="bg-purple-600 text-white px-6 py-2 rounded-2xl shadow-md hover:bg-purple-700 transition"
      >
        View Meal History
      </button>
    </div>

    <div className="w-[70%] bg-gray-50 p-8 overflow-y-auto">

      <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
        <h2 className="text-lg font-semibold mb-2">
          Enter Food You Ate
        </h2>

        <textarea
          value={food}
          onChange={(e) => setFood(e.target.value)}
          rows="3"
          placeholder="e.g. 2 chapatis, paneer curry, banana"
          className="w-full border p-3 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-300"
        />

        <button
          onClick={handleAnalyze}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl shadow-sm hover:bg-purple-700 transition"
        >
          {loading ? "Analyzing..." : "Analyze Food"}
        </button>
      </div>

      {nutrition && (
        <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
          <h2 className="text-lg font-semibold mb-3">
            Nutrition Breakdown
          </h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <p><strong>Calories:</strong> {nutrition.calories} kcal</p>
            <p><strong>Protein:</strong> {nutrition.protein} g</p>
            <p><strong>Carbs:</strong> {nutrition.carbs} g</p>
            <p><strong>Fats:</strong> {nutrition.fats} g</p>
          </div>
        </div>
      )}

      {exercisePlan && (
        <div>
          <h2 className="text-lg font-semibold mb-4">
            Exercise Suggestions ({exercisePlan.timeContext})
          </h2>

          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-green-600 font-semibold mb-2">Light</h3>
              <ul className="list-disc ml-5 text-sm">
                {exercisePlan.light.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-yellow-600 font-semibold mb-2">Moderate</h3>
              <ul className="list-disc ml-5 text-sm">
                {exercisePlan.moderate.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-md hover:shadow-lg transition">
              <h3 className="text-red-600 font-semibold mb-2">Intense</h3>
              <ul className="list-disc ml-5 text-sm">
                {exercisePlan.intense.map((ex, i) => (
                  <li key={i}>{ex}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
)


}

export default Dashboard


