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
    let imoveisDoBanco = [];

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
        imoveisDoBanco = imoveis;
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
        const map = L.map("map").setView([-23.55, -46.63], 10);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors"
        }).addTo(map);

        const limites = [];
        imoveisDoBanco.forEach(imovel => {
            // Não inventa posições para imóveis antigos sem coordenadas.
            if (imovel.latitude === null || imovel.latitude === undefined ||
                imovel.longitude === null || imovel.longitude === undefined ||
                imovel.latitude === "" || imovel.longitude === "") return;

            const latitude = Number(imovel.latitude);
            const longitude = Number(imovel.longitude);
            if (!Number.isFinite(latitude) || !Number.isFinite(longitude) ||
                Math.abs(latitude) > 90 || Math.abs(longitude) > 180) return;

            const id = encodeURIComponent(String(imovel._id || ""));
            const url = `${URL_CATALOGO}imovel/index.html?id=${id}`;
            const nome = escaparHTML(imovel.titulo || "Imóvel");
            const local = escaparHTML([imovel.bairro, imovel.cidade].filter(Boolean).join(" - "));
            const popup = `<div class="popup-imovel"><strong>${nome}</strong><br>${local}<br>` +
                `<strong>${formatarPreco(imovel.preco)}</strong><br>` +
                `<a href="${url}">Ver detalhes do imóvel →</a></div>`;

            L.marker([latitude, longitude]).addTo(map).bindPopup(popup);
            limites.push([latitude, longitude]);
        });

        if (limites.length === 1) map.setView(limites[0], 15);
        else if (limites.length > 1) map.fitBounds(limites, {padding: [35, 35], maxZoom: 15});

        if (!limites.length) {
            const aviso = L.control({position: "bottomleft"});
            aviso.onAdd = () => {
                const elemento = L.DomUtil.create("div", "mapa-aviso");
                elemento.textContent = "Nenhum imóvel com localização cadastrada no momento.";
                elemento.style.cssText = "background:white;color:#311414;padding:10px;border-radius:7px;box-shadow:0 2px 8px #0003;font-size:13px;";
                return elemento;
            };
            aviso.addTo(map);
        }
        setTimeout(() => map.invalidateSize(), 100);
    }
});
