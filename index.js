import express from 'express'
import cors from 'cors'
import { MongoClient } from 'mongodb';
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
})

app.listen(port, (req, res) => {
    console.log(`Simple CRUD server is runnig on port: ${port}`)
})
