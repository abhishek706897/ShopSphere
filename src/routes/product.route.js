const express=require("express")

const route=express.Router()

const {createProduct,getAllProducts,getProductById,updateProduct,deleteProduct}=require("../controllers/product.controller")

route.post("/" ,createProduct)
route.get("/", getAllProducts);
route.get("/:id", getProductById);
route.put("/:id", updateProduct);
route.delete("/:id", deleteProduct);

module.exports=route