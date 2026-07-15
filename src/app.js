const express=require("express")
const cros=require("cors")
const userRoutes = require("./routes/user.routes");
const productRoutes = require("./routes/product.route");
const categoryRoutes = require("./routes/category.route");
const cartRoutes=require("./routes/cart.route")
const wishlistRoute = require("./routes/wishlist.route");
const app=express();

app.use(express.json())
app.use(cros())

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes)
app.use("/api/cart",cartRoutes)
app.use("/api/wishlist", wishlistRoute)


app.get("/",(req,res)=>{
    res.status(200).json({
        message:"wlecome to the shopsphere."
    })
})

module.exports=app;