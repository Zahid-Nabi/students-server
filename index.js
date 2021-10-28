const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

//Middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8451q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db("studentDB");
        const studentsCollection = database.collection("students");

        app.post('/students/add', async (req, res) => {
            const result = await studentsCollection.insertOne(req.body);
            res.send(result);
        });

        app.get('/students', async (req, res) => {
            const cursor = await studentsCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        app.get('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.findOne(query);
            res.send(result);
        });

        app.delete('/students/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await studentsCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/students/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedStudent = req.body;
            const docs = {
                $set: {
                    fullname: updatedStudent.fullname,
                    email: updatedStudent.email,
                    gender: updatedStudent.gender
                }
            };
            const result = await studentsCollection.updateOne(query, docs, options);
            res.send(result);
        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Student Server is running');
});



app.listen(port, () => {
    console.log('Student server is running on port: ', port);
});
