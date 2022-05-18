const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cal7r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });



async function run() {
    try {
        await client.connect();
        const productCollection = client.db('warehouse').collection('product');
        const memberCollection = client.db('warehouse').collection('ourMembers');

        app.get('/product', async (req, res) => {
            const query = {};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

        app.get('/inventory/:id', async(req, res) =>{
            const id = req.params.id;
            const query={_id: ObjectId(id)};
            const inventory = await productCollection.findOne(query);
            res.send(inventory);
        });

        app.get('/myitems', async (req, res) => {
            const email = req.query.email;
            const query = {email: email};
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        });

      

       

        app.get('/members', async (req, res) => {
            const query = {};
            const cursor = memberCollection.find(query);
            const members = await cursor.toArray();
            res.send(members);
        });

      
        app.post('/product', async(req, res) =>{
            const newService = req.body;
            const result = await productCollection.insertOne(newService);
            res.send(result);
        });

        app.delete('/product/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await productCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/product/:id', async(req, res) =>{
            // res.send("Working")
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const options = {upsert: true}
            const doc = {
                $set: req.body
            }
            const result = await productCollection.updateOne(query, doc, options);
            res.send(result);
        });

        app.post('/login',(req,res)=>{
            const email = req.body;
            const jwt = require('jsonwebtoken');
            const token = jwt.sign(email, process.env.ACCESS_TOKEN_SECRET);
            
        });


    }
    finally {

    }
}



run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Running Server');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})

