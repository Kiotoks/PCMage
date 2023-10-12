
var noticias = document.getElementsByClassName("noticias-tips");
document.getElementById("cargarNoticias").addEventListener("click",getLastNews);
document.getElementById("botonTips").addEventListener("click",getTip);
tipText = document.getElementById("tipText");

var cantLast = 1;

function getLastNews(){
    let body = {cant:cantLast}
    fetch('/gln', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
    .then(response => response.json())
    .then(noticia => {
        let i = 2;
        noticia.forEach(n => {
            let imgElement = noticias[i].getElementsByTagName('img')[0];
            let aElement = noticias[i].getElementsByTagName('a')[0];
            imgElement.src = n["img1"];
            aElement.textContent = n["titulo"];
            aElement.href = "/noticias/" + n["code"];
            i-=1;
        });
        cantLast++;
    })
    .catch(error => {
        console.error(error);
    });
}

function getTip(){
    fetch('/getTip', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(response => response.text())
    .then(resp => {
        console.log(resp)
        tipText.innerText = resp;
    })
    .catch(error => {
        console.error(error);
    });
}

getLastNews(cantLast);