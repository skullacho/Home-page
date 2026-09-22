document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // MENU MOBILE TOGGLE
    // ==========================
    window.toggleMenu = function() {
        const nav = document.getElementById('nav-container');
        if (nav) {
            nav.classList.toggle('active');
        }
    };

    // ==========================
    // CONTADOR AUTOMÁTICO
    // ==========================
    const contador = document.getElementById("contador");

    function atualizarContador() {
        const cardsVisiveis = document.querySelectorAll(
            '.card:not([style*="display: none"])'
        ).length;

        if (contador) {
            contador.textContent = `${cardsVisiveis} imóveis encontrados`;
        }
    }

    atualizarContador();

    // ==========================
    // ABRIR / FECHAR DETALHES DO CARD
    // ==========================
    document.querySelectorAll(".toggle-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const card = btn.closest(".card");
            card.classList.toggle("active");
        });
    });

    // ==========================
    // BOTÕES DE TIPO DE IMÓVEL
    // ==========================
    document.querySelectorAll(".opcoes button").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.classList.toggle("active");
        });
    });

    // ==========================
    // FILTRAGEM DE IMÓVEIS
    // ==========================
    const btnFiltrar = document.querySelector(".btn-filtrar");
    if (btnFiltrar) {
        btnFiltrar.addEventListener("click", filtrarImoveis);
    }

    function filtrarImoveis() {
        const cidade = document.getElementById("cidade")?.value || "todos";
        const bairro = document.getElementById("bairro")?.value || "todos";
        const precoMin = Number(document.getElementById("precoMin")?.value) || 0;
        const precoMax = Number(document.getElementById("precoMax")?.value) || Infinity;

        const tiposSelecionados = Array.from(
            document.querySelectorAll(".opcoes button.active")
        ).map(btn => btn.textContent.trim().toLowerCase());

        const cards = document.querySelectorAll(".card");

        cards.forEach(card => {
            const tipo = card.dataset.tipo?.toLowerCase();
            const cardCidade = card.dataset.cidade?.toLowerCase();
            const cardBairro = card.dataset.bairro?.toLowerCase();
            const preco = Number(card.dataset.preco);

            let mostrar = true;

            // Cidade
            if (cidade !== "todos" && cardCidade !== cidade) {
                mostrar = false;
            }

            // Bairro
            if (bairro !== "todos" && cardBairro !== bairro) {
                mostrar = false;
            }

            // Tipo de Imóvel
            if (tiposSelecionados.length > 0 && !tiposSelecionados.includes(tipo)) {
                mostrar = false;
            }

            // Preço
            if (preco < precoMin || preco > precoMax) {
                mostrar = false;
            }

            card.style.display = mostrar ? "flex" : "none";
        });

        atualizarContador();
    }

    // ==========================
    // ORDENAÇÃO DE IMÓVEIS
    // ==========================
    const selectOrdenar = document.getElementById("ordenar");
    if (selectOrdenar) {
        selectOrdenar.addEventListener("change", () => {
            const container = document.querySelector(".cards-container");
            const cards = Array.from(document.querySelectorAll(".card"));
            const ordem = selectOrdenar.value;

            cards.sort((a, b) => {
                const precoA = Number(a.dataset.preco);
                const precoB = Number(b.dataset.preco);

                if (ordem === "Menor preço") {
                    return precoA - precoB;
                }
                if (ordem === "Maior preço") {
                    return precoB - precoA;
                }
                return 0;
            });

            cards.forEach(card => container.appendChild(card));
        });
    }

});