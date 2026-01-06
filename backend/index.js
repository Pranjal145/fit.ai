const express = require("express")
const cors = require("cors")
require("dotenv").config()
const foodRoutes = require("./routes/foodRoutes")

const connectDB = require("./config/db")

const app = express()

app.use(cors())
app.use(express.json())
app.use("/api/food", foodRoutes)

connectDB()

app.get("/", (req, res) => {
  res.send("API is running")
})

const authRoutes = require("./routes/authRoutes")
app.use("/api/auth", authRoutes)

const testRoutes = require("./routes/testRoutes")
app.use("/api/test", testRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

