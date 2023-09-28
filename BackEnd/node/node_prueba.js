const express = require("express");
const { dirname } = require("path");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", __dirname + "/views");

  
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

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});