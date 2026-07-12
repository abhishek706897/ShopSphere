const express=require("express")
const cros=require("cors")
const userRoutes = require("./routes/user.routes");
const app=express();

app.use(express.json())
app.use(cros())
app.use("/api/users", userRoutes);


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"wlecome to the shopsphere."
    })
})

module.exports=app;