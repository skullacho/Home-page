var map = L.map('map').setView([-23.55, -46.63], 11); // São Paulo

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap'
}).addTo(map);

var markers = L.markerClusterGroup();

// seus imóveis
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