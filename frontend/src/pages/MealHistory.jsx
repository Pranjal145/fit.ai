import { useEffect, useState } from "react"
import { getMealHistory } from "../services/foodService"
import { useNavigate } from "react-router-dom"

function MealHistory() {
  const [meals, setMeals] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await getMealHistory()
        setMeals(res.data)
      } catch {
        alert("Failed to load meal history")
      }
    }

    fetchHistory()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Previous Meals</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="text-blue-600"
        >
          ← Back to Dashboard
        </button>
      </div>

      {meals.length === 0 ? (
        <p>No meals found</p>
      ) : (
        <div className="bg-white rounded shadow overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-2">Food</th>
                <th className="p-2">Calories (kcal)</th>
                <th className="p-2">Protein (g)</th>
                <th className="p-2">Carbs (g)</th>
                <th className="p-2">Fats (g)</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal._id} className="border-t">
                  <td className="p-2">{meal.foodText}</td>
                  <td className="p-2">{meal.calories}</td>
                  <td className="p-2">{meal.protein}</td>
                  <td className="p-2">{meal.carbs}</td>
                  <td className="p-2">{meal.fats}</td>
                  <td className="p-2">
                    {new Date(meal.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default MealHistory
