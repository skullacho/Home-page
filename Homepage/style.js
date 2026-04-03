// Função para alternar entre as abas Comprar e Alugar
function setAba(tipo) {
    const btnComprar = document.getElementById('btn-comprar');
    const btnAlugar = document.getElementById('btn-alugar');

    if (tipo === 'comprar') {
        btnComprar.classList.add('active');
        btnAlugar.classList.remove('active');
    } else {
        btnAlugar.classList.add('active');
        btnComprar.classList.remove('active');
    }
    
    console.log("Mudou para: " + tipo);
}

// Função para o botão de busca
function buscar() {
    const local = document.getElementById('select-local').value;
    if (local === "") {
        alert("Por favor, selecione uma localização!");
    } else {
        alert("Buscando imóveis em: " + local);
    }
}

function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
}

// Inicializa mapa (Campinas)
var map = L.map('map').setView([-22.90, -47.06], 10);

// Tiles (mapa base)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

// Cluster
var markers = L.markerClusterGroup();

// Lista fake de imóveis
var imoveis = [
  {lat: -22.90, lng: -47.06, nome: "Apartamento - Campinas"},
  {lat: -22.85, lng: -47.10, nome: "Casa - Hortolândia"},
  {lat: -22.95, lng: -47.00, nome: "Studio - Valinhos"},
  {lat: -22.88, lng: -47.03, nome: "Apartamento - Sumaré"},
];

// Adiciona marcadores
imoveis.forEach(imovel => {
  var marker = L.marker([imovel.lat, imovel.lng])
    .bindPopup(`<b>${imovel.nome}</b>`);
  
  markers.addLayer(marker);
});

// Adiciona no mapa
map.addLayer(markers);