const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
const objectId = require('mongodb').ObjectId;
const app = express()
const jwt = require('jsonwebtoken');
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
        const reviewCollection = client.db("Laptop-Wear-House").collection("reviews");
        const orderCollection = client.db("Laptop-Wear-House").collection("orders");
        const messageCollection = client.db("Laptop-Wear-House").collection("message");


        function verifyJWT(req, res, next) {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return res.status(401).send({ message: 'unauthorized access' });
            }
            const token = authHeader.split(' ')[1];
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    return res.status(403).send({ message: 'Forbidden access' });
                }
                console.log('decoded', decoded);
                req.decoded = decoded;
                next();
            })
        }


        app.post("/login", async (req, res) => {
            const email = req.body;

            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);

            res.send({ token })
        })

        app.post("/uploadPd", async (req, res) => {
            const product = req.body;
            const result = await productCollection.insertOne(product);
                res.send(result)
        })

        app.get('/products', async (req, res) => {
            const products = await productCollection.find({}).toArray();
            res.send(products)
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: objectId(id) };
            const result = await productCollection.findOne(query);
            res.send(result);
        });


        // update 
        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            console.log(updatedProduct);
            const filter = { _id: objectId(id) };
            const options = { upsert: true };
            const updatedDoc ={
                    $set: {
                        quantity: updatedProduct.quantity
                    },
                };
            const result = await productCollection.updateOne(filter, updatedDoc, options);
            res.send(result);

        })

          //Order Collection ApI  

          app.get('/order',verifyJWT, async(req, res)=>{

            const decodedEmail = req.decoded.email;
            const email = req.query.email;
            
            if (email === decodedEmail) {
                const query = { email: email };
                const cursor = orderCollection.find(query);
                const orders = await cursor.toArray();
                res.send(orders);
            }
            else{
                res.status(403).send({message: 'forbidden access'})
            }




        })
          app.post('/order', async(req, res)=>{
            const order=req.body;
            console.log(order.data);
            const result=await orderCollection.insertOne(order);
            res.send(result);
        })

        

        //delete a Product
        app.delete('/products/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:objectId(id)}
            const result = await productCollection.deleteOne(query)
            res.send(result)
        })

        app.get('/reviews', async (req, res) => {
            const reviews = await reviewCollection.find({}).toArray();
            res.send(reviews)
        })

           //customer message post
        app.post('/contact', async(req, res) => {
            const newUser = req.body;
            
            console.log('adding new user', newUser);

            const result =await messageCollection.insertOne(newUser);
            res.send(result)
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
    console.log('Assignment crud server Running');
})
