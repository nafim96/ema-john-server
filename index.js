const express = require("express");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ifi4b.mongodb.net/${process.env.DB_DATA_BASE}?retryWrites=true&w=majority`;
const app = express();
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

const port = 5000;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("hello ema watson");
});

client.connect((err) => {
  const productCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`${process.env.DB_PRODUCT}`);

  const orderCollection = client
    .db(`${process.env.DB_DATA_BASE}`)
    .collection(`oderList`);

  app.post("/addProduct", (req, res) => {
    const products = req.body;
    productCollection.insertOne(products).then((result) => {
      res.send(result.insertedCount);
    });
  });

  app.get("/product", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  app.get("/singleProduct/:key", (req, res) => {
    productCollection
      .find({ key: req.params.key })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });

  app.post("productByKeys", (req, res) => {
    const productKeys = req.body;
    productCollection.find({
      key: {
        $in: productKeys.toArray((req, res) => {
          res.send(documents);
        }),
      },
    });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount >0);
    });
  });
});

app.listen(port);
