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

const client = new MongoClient(mongodbURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
});
const db = client.db(dbName);

const chatGPTAPIKey = process.env.OPENAI_KEY;
const openaiClient = new openai({ apiKey: chatGPTAPIKey });

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

app.use(bodyParser.json());
app.use(express.static(__dirname +'/public'));

async function getListaComponentes(filtro) {
    const collectionName = 'Componentes';
    try {
        const collection = db.collection(collectionName);
        const documents = await collection.find(filtro).toArray();
        return documents;
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    }
}
async function getNoticia(codigo){

    try {
        const collection = db.collection('Noticias');
        const documents = await  collection.findOne({ code: codigo });
        return documents;
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    }

}

async function buscarNoticia(query){
    const search = { $text: { $search: query } };

    const projection = {
        _id: 0,
        titulo: 1,
        img1:1,
        code: 1,
    };

    try {
        const collection = db.collection('Noticias');
        await collection.createIndex({ titulo: 'text' });
        const documents = await  collection.find(search).project(projection).toArray();
        return documents;
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    }

}

async function getLN(page){

    try {
        const collection = db.collection('Noticias');
        let numDocs = await collection.countDocuments();
        if(numDocs % 3 > 0){
            page = (Math.trunc(numDocs/3)+1) - page;
        }
        else{
            page = numDocs/3 - page;
        }
        
        if (page > numDocs/3){
            return [];
           
        }
        const pipeline = [
            {
                $skip: page * 3, // Skip items for previous pages
            },
            {
                $limit: 3, // Limit the number of items on the current page
            },
        ];

        const itemsOnPage = await collection.aggregate(pipeline).toArray();

        return itemsOnPage; 
    
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    }
}

async function getRTip(){
    try {
        const collection = db.collection('Tips');

        resp = await collection.aggregate([{ $sample: { size: 1 } }]).toArray();
        return resp[0]; 
    
    } catch (error) {
        console.error('Error al obtener los documentos:', error);
        throw error;
    }
}


let listaCompConPrecios = "";
let tipoComponentes = ["cpu","gpu"];
tipoComponentes.forEach(tipo => {
    listaCompConPrecios += `.  ${tipo} list (with their prices in argentinian pesos): `;
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
    res.render("index");
});

app.get("/sobrenos", (req, res) => {
    res.render("sobrenos");
});

app.get('/configurador', (req, res) => {
    res.render('config');
});

app.get("/cargarnoticia", (req, res)=> {
    res.render('cargarNoticia');
});

app.get('/noticias/:cod', (req, res) => {
    const codNoticia = req.params.cod.toString();
    getNoticia(codNoticia)
    .then(news =>{
        console.log(news)
        res.render('noticias', { news: news });
    })
    .catch(error => {
        console.error('Error en la función principal:', error);
    });
    
});

app.get('/buscar/:query', (req, res) => {
    const busqueda = req.params.query.toString();
    buscarNoticia(busqueda)
    .then(news =>{
        res.render('buscar', { noticias: news });
    })
    .catch(error => {
        console.error('Error en la función principal:', error);
    });
    
});

app.post('/generate', (req, res) => {
    const { typePc, prompt } = req.body;
    var variable = `Give me a ${typePc} PC specification list with a budget of ${prompt} argentinian pesos. Choose one from every of this lists of components ${listaCompConPrecios}. Reduce your awnser to just one component from each list separated by a comma`;

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

app.post('/getTip', (req, res) => {
    getRTip()
    .then(response => {
        res.send(response["text"]);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error generando la respuesta.');
    });
});

app.post('/gln', (req, res) => {
    let cantSL = req.body.cant;
    cantSL = parseInt(cantSL);
    getLN(cantSL)
    .then(response => {
        res.send(response);
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error generando la respuesta.');
    });
});

app.put('/cn', (req, res) => {
    const noticia = req.body;
    const client = new MongoClient(mongodbURI, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });
    
    const db = client.db(dbName);
    const collection = db.collection('Noticias');

    collection.insertOne(noticia)
    .then(response => {
        console.log("se cargo la noticia :)");
    })
    .catch(error => {
        console.error(error);
        res.status(500).send('Error cargando la noticia.');
    });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
