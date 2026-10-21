const API_IMOVEIS = "https://tcc-3-nnmd.onrender.com/api/imoveis";
const URL_CATALOGO = "https://tcc-3-frontend.vercel.app/";

function toggleMenu() {
    const nav = document.getElementById("nav-container");
    if (nav) nav.classList.toggle("active");
}

function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, caractere => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[caractere]));
}

function formatarPreco(valor) {
    return Number(valor || 0).toLocaleString("pt-BR", {style:"currency",currency:"BRL"});
}

document.addEventListener("DOMContentLoaded", async () => {
    const track = document.getElementById("slider-imoveis");
    const anterior = document.getElementById("slider-anterior");
    const proximo = document.getElementById("slider-proximo");
    let indice = 0;
    let total = 0;
    let inicioToque = null;

    function visiveis() { return window.innerWidth <= 600 ? 1 : window.innerWidth <= 900 ? 2 : 3; }
    function atualizar() {
        if (!track || !track.querySelector(".slider-card")) return;
        const maximo = Math.max(0, total - visiveis());
        indice = Math.min(Math.max(0, indice), maximo);
        const primeiro = track.querySelector(".slider-card");
        const distancia = primeiro.getBoundingClientRect().width + 22;
        track.style.transform = `translateX(-${indice * distancia}px)`;
        anterior.disabled = indice === 0;
        proximo.disabled = indice >= maximo;
    }
    anterior?.addEventListener("click", () => { indice--; atualizar(); });
    proximo?.addEventListener("click", () => { indice++; atualizar(); });
    window.addEventListener("resize", atualizar);
    track?.addEventListener("touchstart", e => { inicioToque = e.touches[0].clientX; }, {passive:true});
    track?.addEventListener("touchend", e => {
        if (inicioToque === null) return;
        const delta = e.changedTouches[0].clientX - inicioToque;
        if (Math.abs(delta) > 50) { indice += delta < 0 ? 1 : -1; atualizar(); }
        inicioToque = null;
    }, {passive:true});

    try {
        const resposta = await fetch(API_IMOVEIS);
        if (!resposta.ok) throw new Error("Falha ao consultar imóveis");
        const dados = await resposta.json();
        const imoveis = Array.isArray(dados) ? dados : (Array.isArray(dados.imoveis) ? dados.imoveis : []);
        const selecionados = [...imoveis].sort((a,b) => Number(Boolean(b.destaque)) - Number(Boolean(a.destaque))).slice(0,12);
        total = selecionados.length;
        if (!total) {
            track.innerHTML = '<p class="slider-estado">Nenhum imóvel cadastrado no momento.</p>';
        } else {
            track.innerHTML = selecionados.map(imovel => {
                const imagem = Array.isArray(imovel.imagens) ? imovel.imagens.find(url => typeof url === "string" && /^https?:\/\//i.test(url)) : null;
                const id = encodeURIComponent(String(imovel._id || ""));
                const url = `${URL_CATALOGO}imovel/index.html?id=${id}`;
                return `<a class="slider-card" href="${url}">
                    <div class="slider-card-imagem">${imagem ? `<img src="${escaparHTML(imagem)}" alt="${escaparHTML(imovel.titulo)}" loading="lazy">` : '<div style="height:100%;display:grid;place-items:center;color:#776"><i class="fa-regular fa-building fa-3x"></i></div>'}<span class="slider-etiqueta">${escaparHTML(imovel.finalidade || "Imóvel")}</span></div>
                    <div class="slider-card-conteudo"><h3>${escaparHTML(imovel.titulo || "Imóvel")}</h3>
                    <p class="slider-local"><i class="fa-solid fa-location-dot"></i> ${escaparHTML([imovel.bairro,imovel.cidade].filter(Boolean).join(" - "))}</p>
                    <div class="slider-info"><span><i class="fa-solid fa-ruler-combined"></i> ${escaparHTML(imovel.area || 0)} m²</span><span><i class="fa-solid fa-bed"></i> ${escaparHTML(imovel.quartos || 0)} quartos</span><span><i class="fa-solid fa-car"></i> ${escaparHTML(imovel.vagas || 0)} vagas</span></div>
                    <p class="slider-preco">${formatarPreco(imovel.preco)}</p></div></a>`;
            }).join("");
            atualizar();
        }
    } catch (erro) {
        console.error("Erro ao carregar imóveis:", erro);
        if (track) track.innerHTML = '<p class="slider-estado">Não foi possível carregar os imóveis agora. <a href="https://tcc-3-frontend.vercel.app/" style="color:white">Acessar catálogo</a></p>';
    }

    const mapElement = document.getElementById("map");
    if (mapElement && typeof L !== "undefined") {
        const map = L.map("map").setView([-23.55, -46.63], 11);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {attribution:"© OpenStreetMap"}).addTo(map);
        // Preserva os marcadores já existentes do mapa original.
        const pontos = [
            {nome:"Arte Vila Matilde",lat:-23.5315,lng:-46.5200},
            {nome:"Aviva Residencial Vila Matilde",lat:-23.5280,lng:-46.5150},
            {nome:"Inspire Esperança",lat:-23.5265,lng:-46.5175}
        ];
        pontos.forEach(ponto => L.marker([ponto.lat,ponto.lng]).addTo(map).bindPopup(escaparHTML(ponto.nome)));
    }
});
