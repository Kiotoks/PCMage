const express = require('express');
const openai = require('openai');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

const mongodbURI = process.env.MONGODB_URI;
const dbName = 'PcMage';

const chatGPTAPIKey = process.env.OPENAI_KEY;
const openaiClient = new openai({ apiKey: chatGPTAPIKey });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(express.static('public'));

async function getListaComponentes() {
    const client = new MongoClient(mongodbURI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });
    const collectionName = 'Componentes';
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({}).toArray();
        return documents;
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    } finally {
        client.close();
    }
}

getListaComponentes()
.then(documents => {
    console.log('Documentos encontrados:', documents);
    documents.forEach(x => {
        console.log(x['_id']);
    });
})
.catch(error => {
    console.error('Error en la función principal:', error);
});

app.get("/", (req, res) => {
    res.render("index", { titulo: "inicio EJS" });
    //res.sendFile(__dirname + "/public/index.html"); funcional
});

app.get("/buscar", (req, res) => {
    res.render("buscar", { titulo: "inicio EJS" });
    //res.sendFile(__dirname + "/public/index.html"); funcional
});

app.get("/sobrenos", (req, res) => {
    res.render("sobrenos", { titulo: "inicio EJS" });
    //res.sendFile(__dirname + "/public/index.html"); funcional
});

app.get('/configurador', (req, res) => {
    res.render('config', { titulo: "inicio EJS" });
});

app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:${3000}`);
});

app.post('/generate', (req, res) => {
    const { typePc, prompt } = req.body;
    console.log(typePc);
    console.log(prompt);

    var variable = "Give me a " + typePc + " PC specification list with a budget of" + prompt + " USD. Reduce your awnser to just the pc components separated by a comma" 

    openaiClient.completions.create({
        model: 'gpt-3.5-turbo-instruct', // Modelo de GPT-3
        prompt: variable,
        max_tokens: 150 // Límite de tokens en la respuesta
    })
    .then(response => {
        res.send(response.choices[0].text);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error generando la respuesta.');
    });
});
