const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
app.get('/', (req, res) => {
    res.send("hello world");
});

const uri =
    'mongodb+srv://mdhasibulhasan360:RJWiLCvrOXEMxRLh@cluster0.bugptt7.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});
async function run() {
    try {
        await client.connect();
        await client.db('admin').command({ ping: 1 });
        const database = client.db("usersDB");
        const newUserCollection = database.collection("newUserCollection");

        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await newUserCollection.insertOne(user);
            res.send(result)
        });
        app.get('/users', async (req, res) => {
            const cursor = newUserCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        });
        app.delete("/users/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await newUserCollection.deleteOne(query);
            res.send(result);
        })
        // app.get("/users/:id", async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) };
        //     const user = await newUserCollection.findOne(query);
        //     res.send(user)
        // })
        app.get("/users/:id", async (req, res) => {
    try {
        const id = req.params.id;
        console.log('Received id:', id); // Add this line for debugging
        const query = { _id: new ObjectId(id) };
        const user = await newUserCollection.findOne(query);
        res.send(user);
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).send('Internal Server Error');
    }
});
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
}

run().catch(console.dir);

app.listen(port, () => {
    console.log(`Express server is running on port ${port}`);
});
