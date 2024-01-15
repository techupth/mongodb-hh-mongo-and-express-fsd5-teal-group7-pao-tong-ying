import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const limit = Number(req.query.limit) ?? 5;
  const page = Number(req.query.page) ?? 0
  const category = req.query.category
  const keyword = req.query.keyword
  const sort = Number(req.query.sort)
  console.log(limit)
  
  const query = {};

  if(category){
    query.category = category //ต้องเป็นตัวเล็กหมด // ถ้าตัวแรกใหญ่ต้อง.uppercase เฉพาะตัวหน้า
    //query.category = new RegExp(category) 
  }

  if(keyword){
    query.name = new RegExp(keyword, "i")
  }

  const collection = db.collection("products");
  //const result = await collection.aggregate([{$match:query},{$skip:(Number(limit)*Number(page))},{$limit:Number(limit)}]).toArray();
  //const result = await collection.find(query).skip(Number(limit)*Number(page)).limit(Number(limit)).toArray();

  //let totalDocs = (await collection.find({}).toArray()).length;
  let totalDocs = await collection.countDocuments({})
  let result;

  if(limit>0){
    if(limit>0&&sort){
      result = await collection.find(query).skip(limit*page).sort({ create_at: sort }).limit(limit).toArray()
    }else{
      result = await collection.find(query).skip(limit*page).limit(limit).toArray()
    }
  }

  if(limit<=0){
    if(limit<=0&&sort){
      result = await collection.find(query).sort({ create_at: sort }).toArray()
    }else{
      result = await collection.find(query).toArray()
    }
  }

  console.log(result)
  return res.json({
    data: result,
    totalDocs
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
  let create_at = new Date();// ใช้กับเพิ่มเวลาหลังบ้าน
  const collection = db.collection("products");
  //const result = await collection.insertOne(req.body); // ใช้กับเพิ่มเวลาหน้าบ้าน
  const result = await collection.insertOne({...req.body,create_at}); // ใช้กับเพิ่มเวลาหลังบ้าน
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
