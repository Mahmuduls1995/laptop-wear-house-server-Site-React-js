const express = require('express')
const cors = require('cors')
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const objectId=require('mongodb').ObjectId;
const app = express()

const port = process.env.PORT || 5000;

//use middleware
app.use(cors())
app.use(express.json())



app.get('/', (req, res) => {
    res.send('Running Assignment laptop wear house crud server');
})

app.listen(port, () => {
    console.log('Assignment crud server Running ');
})