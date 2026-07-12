require("dotenv").config()
const app=require("./src/app")
const connectdb= require("./src/config/db")

const PORT=process.env.PORT || 9999

connectdb()

app.listen(PORT ,()=>{
    console.log(`🚀 Server running on http://localhost:${PORT}`)
})