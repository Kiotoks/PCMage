const express = require('express');
const openai = require('openai');
const bodyParser = require('body-parser');
const port =  process.env.PORT || 3030;
const ejs = require('ejs');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const app = express();

const mongodbURI = process.env.MONGODB_URI;
const dbName = 'pcmdb';

const chatGPTAPIKey = process.env.OPENAI_KEY;
const openaiClient = new openai({ apiKey: chatGPTAPIKey });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(express.static('public'));

async function getListaComponentes(filtro) {
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
        const documents = await collection.find(filtro).toArray();
        return documents;
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    } finally {
        client.close();
    }
}

let listaCompConPrecios = "";
let tipoComponentes = ["cpu","gpu"];
tipoComponentes.forEach(tipo => {
    listaCompConPrecios += tipo + " list (with their prices in argentinian pesos): ";
    getListaComponentes({"tipo": tipo})
    .then(documents => {
        documents.forEach(x => {
            listaCompConPrecios += x['nom'] +" $";
            listaCompConPrecios += x['precio'] + ", ";
        });
    })
    .catch(error => {
        console.error('Error en la función principal:', error);
    });
});


app.get("/", (req, res) => {
    res.render("index", { titulo: "inicio EJS" });
});

app.get("/buscar", (req, res) => {
    res.render("buscar", { titulo: "inicio EJS" });
});

app.get("/sobrenos", (req, res) => {
    res.render("sobrenos", { titulo: "inicio EJS" });
});

app.get('/configurador', (req, res) => {
    res.render('config', { titulo: "inicio EJS" });
});

app.post('/generate', (req, res) => {
    const { typePc, prompt } = req.body;
    console.log(typePc);
    console.log(prompt);

    var variable = `Give me a ${typePc} PC specification list with a budget of ${prompt} argentinian pesos. Choose one from every of this lists of components ${listaCompConPrecios}. Reduce your awnser to just one component from each list separated by a comma`;
    console.log(variable);

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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
