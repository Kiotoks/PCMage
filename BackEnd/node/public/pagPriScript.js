
var noticias = document.getElementsByClassName("noticias-tips");

botonAdelante = document.getElementById("notAd");
botonAdelante.addEventListener("click",adelantarPag);

botonAtras = document.getElementById("notAt");
botonAtras.addEventListener("click",retrocederPag);
botonAtras.style.display = "none";


document.getElementById("botonTips").addEventListener("click",getTip);
tipText = document.getElementById("tipText");

var cantLast = 1;

function retrocederPag(){
    cantLast-=1;
    getLastNews(cantLast)
}
function adelantarPag(){
    cantLast+=1;
    getLastNews(cantLast)
}

function getLastNews(nPag){
    let body = {cant:nPag}
    if (nPag == 1){
        botonAtras.style.display = "none";
    }
    else{
        botonAtras.style.display = "block";
    }
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
    })
    .catch(error => {
        console.error(error);
    });
    console.log(nPag)
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