document.getElementById('generate-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var titulo = document.getElementById('titulo').value;
    var articulo = document.getElementById('articulo').value;
    var img1 = document.getElementById('img1').value;
    var img2 = document.getElementById('img2').value;
    var codigo = document.getElementById('codigo').value;
    var fecha = "Publicado el " + document.getElementById('fecha').value;
    var requestData = {
        titulo: titulo,
        articulo:articulo,
        img1:img1,
        img2:img2,
        code: codigo,
        fecha: fecha
    };

    console.log(requestData);

    fetch('/cn', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
});


document.getElementById('cargarProducto-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var nombre = document.getElementById('nombre').value;
    var tipo = document.getElementById('tipo').value;
    nombre = nombre.trim()
    nombre = nombre.toLowerCase();
    var mla = "MLA" + document.getElementById('mla').value;

    fetch(`https://api.mercadolibre.com/items/${mla}`)
    .then(response => response.json())
    .then(product =>{
        id = thumbnail_id
        var requestData = {
            nom: nombre,
            MLA: mla,
            precio: product.price,
            tipo: tipo,
            img: product.thumbnail,
            link: product.permalink
        };
    
        fetch('/cpt', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        })
    });
});

document.getElementById('buscarProductos').addEventListener("click", searchProducts);
function searchProducts() {
    const searchQuery = document.getElementById('searchQuery').value;
    const resultsList = document.getElementById('resultsList');
    
    // Definir la URL de búsqueda para el país MLA (Argentina)
    const searchUrl = 'https://api.mercadolibre.com/sites/MLA/search?q=' + encodeURIComponent(searchQuery);
    
    // Realizar la solicitud GET a la API
    fetch(searchUrl)
        .then(response => response.json())
        .then(data => {
            // Limpiar la lista de resultados
            resultsList.innerHTML = '';
            
            // Mostrar los resultados en la lista
            data.results.forEach(product => {
                const listItem = document.createElement('li');
                var mla= product.permalink.substring(37, 51);
                listItem.innerHTML = `
                    <strong>Título:</strong> ${product.title}<br>
                    <strong>Precio:</strong> ${product.price}<br>
                    <strong>URL:</strong> <a href="${product.permalink}" target="_blank">${mla}</a>
                `;
                resultsList.appendChild(listItem);
            });
        })
        .catch(error => {
            console.error('Error en la solicitud:', error);
        });
}