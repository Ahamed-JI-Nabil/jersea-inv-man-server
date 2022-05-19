const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const res = require('express/lib/response');
require('dotenv').config()
const port = process.env.PORT || 5000

const app = express()

app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.inzk5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {

    try {
        await client.connect()
        const jerseyCollection = client.db("jersea").collection("inventory-man")


        app.get('/items', async (req, res) => {
            const query = {}
            const cursor = jerseyCollection.find(query)
            const jerseys = await cursor.toArray()
            res.send(jerseys)
        })


        app.get('/items/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await jerseyCollection.findOne(query)
            res.send(result)
        })

        app.delete('/items/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await jerseyCollection.deleteOne(query)
            res.send(result)
        })


        app.put('/items/:id', async (req, res) => {
            const id = req.params.id
            const updatedItem = req.body
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updatedDoc = {
                $ser: {
                    quantity: updatedItem.quantity
                }
            }
            const result = await jerseyCollection.updateOne(query, updatedDoc, options)
            res.send(result)

        })

        app.post('/items', async (req, res) => {
            const newItem = req.body
            console.log(newItem);
            const result = await jerseyCollection.insertOne(newItem)
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Running my jersea server')
})

app.listen(port, () => {
    console.log('CRUD server is running!')
})
