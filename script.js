// Criar o mapa
var map = L.map('map').setView([-5.08921, -42.8016], 13); // Localização inicial

// Adicionar mapa do OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function alert() {
    const alert = document.querySelector(".alert")
    alert.classList.add("showAlert")
    setTimeout(() => {
        alert.classList.remove("showAlert")
    }, 4000)
}

alert()

function drivePrice(km, min, rua) {
    const box = document.querySelector(".box")
    let price = 5 + ((2*km) + (0.5*min))
    box.innerHTML = `<p><span class="text">De</span>: ${rua}</p> <p><span class="text">Para</span>: Av. Jóquei Clube, 710 - Jóquei, Teresina</p> <h1>R$ ${price.toFixed(2)}</h1>`
    box.classList.add("showBox")
}

let routingControl = null

//Traça a rota entre os dois locais selecionados
function setRout(lat, lng) {
    if (routingControl) {
        map.removeControl(routingControl);
        routingControl = null;
    }

    routingControl = L.Routing.control({
        waypoints: [
            L.latLng(lat, lng), // Início da rota
            L.latLng(-5.0753470219714, -42.790111899375916) // Fim da rota
        ],
        routeWhileDragging: true,
    }).addTo(map);

    //Pega informações sobre a rota
     routingControl.on('routesfound', function(e) {
        let route = e.routes[0];
        let distancia = route.summary.totalDistance / 1000; // Pega a distancia
        let tempo = route.summary.totalTime / 60; // Pega os minutos
        let rua = route.instructions[0].road // Pega a rua
        drivePrice(distancia, tempo, rua)
    });
}

let running = false

map.on("click", ({latlng}) => {

    if (running) return

    running = true
    setRout(latlng.lat, latlng.lng)

    setTimeout(() => running = false, 2000);
})