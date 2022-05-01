const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
require('dotenv').config();
const app = express();

//middleWare

app.use(cors());
app.use(express.json());

//from database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rqsj7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run(){
    try{
        await client.connect();
        const itemCollection = client.db('appleGadget').collection('item')

        //read item
        app.get('/item', async (req,res)=>{
            const query ={};
            const cursor = itemCollection.find(query);
            const items = await cursor.toArray();
            res.send(items)
        })
        //get item by using dynamic route
        app.get('/item/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const item = await itemCollection.findOne(query);
            res.send(item); 
        })

        //create an item
        app.post('/item',async(req,res)=>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result)
        })

    }
    finally{

    }
}
run().catch(console.dir);




app.get('/',(req,res)=>{
    res.send('Running pr-retailer on server')
})


app.listen(port,()=>{
    console.log('Listening to port',port);
})

