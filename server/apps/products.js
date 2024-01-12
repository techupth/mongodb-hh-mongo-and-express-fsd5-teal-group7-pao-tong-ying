import { Router } from "express";
import {db} from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/",async (req, res) => {
    const collection = db.collection("products")
    const getData = await collection.find().limit(10).toArray()
    return res.json({
        data: getData
    })
});
productRouter.get("/:id",async (req, res) => {
    const collection = db.collection("products")  
    let id = new ObjectId(req.params.id);
    const getData = await collection.find({_id:id}).limit(10).toArray()
   
    return res.json({
        data: getData[0]
    })
});



productRouter.post("/",async (req, res) => {
    const collection = db.collection("products")
    const productInsert = {...req.body}
    const product = await collection.insertOne(productInsert)
    return res.json({
        "message": "Product has been created successfully"
     } );
});

productRouter.put("/:id",async (req, res) => {
    const collection = db.collection("products")
    let id = new ObjectId(req.params.id);
    const updateInfo = {...req.body}
    await collection.updateOne({_id:id},{$set:updateInfo})
    console.log(id)
return res.json({
    "message": "Product has been updated successfully"
 } )
});

productRouter.delete("/:id",async (req, res) => {
    const collection = db.collection("products")
    const id = new ObjectId(req.params.id)
    await collection.deleteOne({_id:id})
    return res.json({
        "message": "Product has been deleted successfully"
     })
});

export default productRouter;
