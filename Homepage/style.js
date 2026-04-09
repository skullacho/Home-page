
function setAba(tipo) {
  const btnCompreja = document.getElementById('btn-buscar-main');
        
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

document.addEventListener("DOMContentLoaded", () => {
  const tabs = document.querySelectorAll(".tab-btn");

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {

      // remove active de todos
      tabs.forEach(t => t.classList.remove("active"));

      // adiciona no clicado
      tab.classList.add("active");

    });
  });
});
function toggleMenu() {
  document.getElementById("sidebar").classList.toggle("active");
}

var map = L.map('map').setView([-23.55, -46.63], 11); // São Paulo

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

var markers = L.markerClusterGroup();


var imoveis = [
  {
    nome: "Arte Vila Matilde",
    lat: -23.5315,
    lng: -46.5200
  },
  {
    nome: "Aviva Residencial Vila Matilde",
    lat: -23.5280,
    lng: -46.5150
  },
  {
    nome: "Inspire Esperança",
    lat: -23.5265,
    lng: -46.5175
  },
  {
    nome: "Apartamento no Tatuapé",
    lat: -23.5405,
    lng: -46.5760
  }
];

// adiciona no mapa
imoveis.forEach(imovel => {
  var marker = L.marker([imovel.lat, imovel.lng])
    .bindPopup(`<b>${imovel.nome}</b>`);
  
  markers.addLayer(marker);
});

map.addLayer(markers);
