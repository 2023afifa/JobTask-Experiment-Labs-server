const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const uri = "mongodb+srv://HomeDecor:igZNNYpytUVfVTGE@cluster0.etbjr0z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});


async function run() {

    try {

        const HomeDecorCollection = client.db("homeDecor").collection("decoritems");
        const userCollection = client.db("homeDecor").collection("users");
        const cartCollection = client.db("homeDecor").collection("carts");

        app.get("/decoritems", async (req, res) => {
            const cursor = HomeDecorCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get("/carts", async (req, res) => {
            const cursor = cartCollection.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.post("/carts", async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await cartCollection.insertOne(newProduct);
            res.send(result);
        })

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        app.get("/users", async (req, res) => {
            const cursor = userCollection.find();
            const users = await cursor.toArray();
            res.send(users);
        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            console.log(user);
            const query = { email: user.email };
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "User already exists", insertedId: null });
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })


        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    }

    finally { }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("Home decor");
})

app.listen(port, () => {
    console.log(`Home decor on port ${port}`);
})
