import API from "./api"

export const analyzeFood = (foodText) => {
  return API.post("/food/analyze", { foodText })
}

export const getMealHistory = () => {
  return API.get("/food/history")
}
