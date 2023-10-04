        // JavaScript para enviar solicitudes a tu servidor y obtener respuestas de GPT-3
        document.getElementById('generate-form').addEventListener('submit', function(event) {
            event.preventDefault();

            var radioButton = document.querySelector('input[name="tipopc"]:checked');
            var typePc = radioButton ? radioButton.id : null;
            var prompt = document.getElementById('prompt').value;

            var requestData = {
                typePc: typePc,
                prompt: prompt
            };

            console.log(requestData);

            fetch('/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            })
            .then(response => response.text())
            .then(data => {
                document.getElementById('response').textContent = data;
            })
            .catch(error => {
                console.error(error);
            });
        });