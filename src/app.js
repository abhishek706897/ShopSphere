const express=require("express")
const cros=require("cors")
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const app=express();

app.use(express.json())
app.use(cros())

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes)



app.get("/",(req,res)=>{
    res.status(200).json({
        message:"wlecome to the shopsphere."
    })
})

module.exports=app;