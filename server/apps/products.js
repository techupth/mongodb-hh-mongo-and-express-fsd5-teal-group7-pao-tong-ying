import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const result = await collection.find().toArray();//ต้องเป็น arr เพราะ const [products, setProducts] = useState([]); //ตัวรับเป็น arr
  return res.json({
    data: result
 });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const objId = new ObjectId(req.params.id);
  const result = await collection.findOne({_id:objId});//ไม่ต้องเป็น arr เพราะ const [product, setProduct] = useState({}); //ตัวรับเป็น obj
  return res.json({
    data: result
 });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const result = await collection.insertOne(req.body);
  return res.json({
    message: "Product has been created successfully"
  });
});
  

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const objId = new ObjectId(req.params.id);
  const upd = {...req.body}
  await collection.updateOne({_id: objId},{$set:upd});
  return res.json({
    message: "Product has been updated successfully"
 });
});

productRouter.delete("/:productId", async (req, res) => {
  const collection = db.collection("products");
  const objId = new ObjectId(req.params.productId);
  await collection.deleteOne({_id:objId})

  return res.json({
    message: "Product has been deleted successfully"
 });
});

export default productRouter;
