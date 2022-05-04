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
        const productCollection = client.db("Laptop-Wear-House").collection("products");

      

        app.post("/uploadPd", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
            res.send({ success: 'Upload  Access sucessfully' })
        })

    } finally {
        //   await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Assignment laptop wear house server');
})

app.listen(port, () => {
    console.log('Assignment crud server Running ');
})