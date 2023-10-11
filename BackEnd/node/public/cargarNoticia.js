        // JavaScript para enviar solicitudes a tu servidor y obtener respuestas de GPT-3
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