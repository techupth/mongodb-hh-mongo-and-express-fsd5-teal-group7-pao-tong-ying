import { Router } from "express";
import { ObjectId } from "mongodb";
import { getCollection } from "../utils/db.js";
const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = getCollection("whatisit");
    const result = await collection
      .find({})
      .sort({ createdTime: -1 })
      .limit(10)
      .toArray();
    return res.json({ data: result });
  } catch (error) {
    return res.json({ message: `Can not find data from Database. ${error}` });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = getCollection("whatisit");
    const getId = new ObjectId(req.params.id);
    const result = await collection.findOne({ _id: getId });
    return res.json({ data: result });
  } catch (error) {
    return res.json({ message: `Can not find data from Database. ${error}` });
  }
});

productRouter.get("/", async (req, res) => {
  const getName = req.query.sname;
  if (getName === undefined) {
    return res.status(400).json({
      message: "Please send name parameter in the URL endpoint",
    });
  }
  try {
    const collection = getCollection("whatisit");

    const result = await collection.findOne({ name: getName });
    const regexName = sname.split("").join("|");
    const regex = new RegExp(regexName, "ig");
    const resultRegex = result.filter((tiem) => {
      return tiem.name.match(regex);
    });
    return res.json({ data: resultRegex });
  } catch (error) {
    return res.json({ message: `Can not find data from Database. ${error}` });
  }
});

productRouter.post("/", async (req, res) => {
  try {
    const collection = getCollection("whatisit");

    const dataProduct = {
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
      category: req.body.category,
      createdTime: new Date(),
    };
    const result = await collection.insertOne(dataProduct);
    return res.json({
      message: `Inserted document with ID: ${result.insertedId}`,
    });
  } catch (error) {
    return res.json({ message: `Can not create data into Database. ${error}` });
  }
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = getCollection("whatisit");
    const filter = { _id: new ObjectId(req.params.id) };
    const updateData = {
      ...req.body,
      updated_at: new Date(),
    };
    const upsertTrue = { $set: updateData };
    await collection.updateOne(filter, upsertTrue);
    return res.json({
      message: `Products ID ${filter._id} has been updated.`,
    });
  } catch (error) {
    return res.json({
      message: `Can not updated data into Database. ${error}`,
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const filter = { _id: new ObjectId(req.params.id) };
  if (!filter) {
    return res.json({
      message: "Please specified id in order to delete",
    });
  }
  try {
    const collection = getCollection("whatisit");
    const result = await collection.deleteOne(filter);
  } catch (error) {
    return res.json({
      message: `Can not delete data into Database. ${error}`,
    });
  }
  return res.json({
    message: `Products ID ${filter._id} has been deleted.`,
  });
});

export default productRouter;
