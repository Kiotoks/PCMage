
var noticias = document.getElementsByClassName("noticias-tips");

for (let i = 0; i < noticias.length; i++) {
    fetch('/grn', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    })
    .then(response => response.json())
    .then(noticia => {
        let imgElement = noticias[i].getElementsByTagName('img')[0];
        imgElement.src = noticia["img1"];
        let aElement = noticias[i].getElementsByTagName('a')[0];
        aElement.textContent = noticia["titulo"];
        aElement.href = "/noticias/" + noticia["code"];
        
    })
    .catch(error => {
        console.error(error);
    });
};
