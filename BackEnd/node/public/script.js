// JavaScript para enviar solicitudes a tu servidor y obtener respuestas de GPT-3
var arrayComp = [];

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
    .then(response => response.json())
    .then(data => {
        var total = 0;
        document.getElementById("esp").style.display = "block"
        arrayComp = data;
        if (data.length > 1){
            data.forEach(comp => {
                compDiv = document.getElementById(comp.tipo);
                compDiv.style.display = "flex"
                compDiv.querySelector('[name="imagenComp"]').src = comp.img;
                compDiv.querySelector('[name="linkComp"]').href = comp.link;
                compDiv.querySelector('[name="nombreComp"]').innerText = comp.nom;
                total += comp.precio;
                compDiv.querySelector('[name="precioComp"]').innerText = "$" + comp.precio;
            });
        }
        document.getElementById("textoTotal").innerText ="Total: $" + total;
    })
    .catch(error => {
        console.error(error);
    });
});

document.getElementById('guardarBuild').addEventListener('click', async function() {
    let nombres = [];
    arrayComp.forEach(comp => {
        nombres.push(comp.nom);
    });
    
    c = Math.floor(Math.random() * 9999999);
    c = c.toString();
    var requestData = {
        arrComps: nombres,
        code: c,
        text:""
    };

    fetch('/cb', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })

    try {
        await navigator.clipboard.writeText("pcmage.onrender.com/builds/"+c);
        console.log('Content copied to clipboard');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
});