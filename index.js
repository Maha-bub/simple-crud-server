import express, { Router } from 'express'
import cors from 'cors'
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
const app = express();
const port = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const client = new MongoClient(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.uhujvlp.mongodb.net/`);
console.log(process.env.DB_USER)

export async function connectToMongoDB() {
    try {
        await client.connect();
        console.log("Successfully connected to MongoDB");
        return client;
    } catch (error) {
        console.dir(error)
    } finally {

    }
}

const connectedClients = await connectToMongoDB()
const db = connectedClients.db('simpleCrudDB')

const users = db.collection('users')


app.get('/', (req, res) => {
    res.send('Simple CRUD server is runnig')
});
app.get('/users', async (req, res) => {
    const cursor = users.find({})
    const allUsers = await cursor.toArray();
    res.send(allUsers)
});

app.get('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) }

    const result = await users.findOne(query)
    console.log(req)
    res.send(result)
})


app.delete('/users/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };
    const result = await users.deleteOne(query);
    res.send(result)
    // Router.refresh()
})

app.patch('/users/:id', async (req, res) => {
    const id = req.params.id;
    const updatedUser = req.body;


    console.log('Updating user with ID', id, "with data", updatedUser)

    const filter = {
        _id: new ObjectId(id)
    }
    const options = { upsert: true }
    const updateDoc = {
        $set: {
            name: updatedUser.name,
            email: updatedUser.email
        }
    }
    const result = await users.updateOne(filter, updateDoc, options);
    res.send(result);




})
app.post('/users', async (req, res) => {
    const newUser = req.body

    console.log("Adding new user", newUser)

    const result = await users.insertOne(newUser);
    res.send(result)
})

app.listen(port, (req, res) => {
    console.log(`Simple CRUD server is runnig on port: ${port}`)
})
