const express = require('express');
const openai = require('openai');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const app = express();

// Configura tu clave de API de OpenAI
const apiKey = 'tu_clave_de_api_aqui';
const openaiClient = new openai({ key: apiKey });

// Configura el motor de plantillas EJS
app.set('view engine', 'ejs');

// Middleware para analizar datos JSON en las solicitudes POST
app.use(bodyParser.json());

// Ruta para servir archivos estáticos (como index.html)
app.use(express.static('public'));

// Ruta para renderizar la página web
app.get('/', (req, res) => {
    res.render('index');
});

// Ruta para generar texto utilizando GPT-3
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

// Inicia el servidor en el puerto 3000
const port = 3000;
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
