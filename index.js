const express = require("express");

const cors = require("cors");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const { ObjectID } = require("bson");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Welcome to Bazar-Sodai Server");
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6qte7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("bazar-sodai").collection("products");

  app.post("/addProduct", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/products", (req, res) => {
    productCollection.find().toArray((err, items) => {
      res.send(items);
    });
  });
  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectID(req.params.id) })
      .toArray((err, items) => {
        res.send(items);
      });
  });

  app.delete("/deleteProduct/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  const orderCollection = client.db("bazar-sodai").collection("orders");

  app.post("/addOrder", (req, res) => {
    const newOrder = req.body;
    orderCollection.insertOne(newOrder).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });

  app.get("/orders", (req, res) => {
    orderCollection.find({ email: req.query.email }).toArray((err, items) => {
      res.send(items);
    });
  });

  app.delete("/deleteOrder/:id", (req, res) => {
    orderCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });

  // perform actions on the collection object
  //   client.close();
});

app.listen(process.env.PORT || 5055, (err) => {
  console.log("Listening");
});
