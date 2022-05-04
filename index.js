const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
// const objectId=require('mongodb').ObjectId;
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000;

//use middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.g697s.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   console.log('Laptop Wear house connected on mongodb');
  // perform actions on the collection object
//   client.close();
// });

async function run() {
    try {
      await client.connect();
      console.log('connected on mongodb Database');
    //   const database = client.db("insertDB");
    //   const haiku = database.collection("haiku");
    //   // create a document to insert
    //   const doc = {
    //     title: "Record of a Shriveled Datum",
    //     content: "No bytes, no problem. Just insert a document, in MongoDB",
    //   }
    //   const result = await haiku.insertOne(doc);
    //   console.log(`A document was inserted with the _id: ${result.insertedId}`);
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Assignment laptop wear house crud server');
})

app.listen(port, () => {
    console.log('Assignment crud server Running ');
})