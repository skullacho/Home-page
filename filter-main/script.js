document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // CONTADOR AUTOMÁTICO
    // ==========================

    const contador = document.getElementById("contador");

    function atualizarContador() {

        const cardsVisiveis = document.querySelectorAll(
            '.card:not([style*="display: none"])'
        ).length;

        contador.textContent =
            `${cardsVisiveis} imóveis encontrados`;

    }

    atualizarContador();

    // ==========================
    // ABRIR / FECHAR CARD
    // ==========================

    document.querySelectorAll(".toggle-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const card = btn.closest(".card");
            card.classList.toggle("active");

        });

    });

    // ==========================
    // TIPO DE IMÓVEL
    // AGORA ACEITA VÁRIOS
    // ==========================

    document.querySelectorAll(".opcoes button").forEach(btn => {

        btn.addEventListener("click", () => {

            btn.classList.toggle("active");

        });

    });

    // ==========================
    // FILTRAR
    // ==========================

    document
        .querySelector(".btn-filtrar")
        .addEventListener("click", filtrarImoveis);

    function filtrarImoveis() {

        const cidade =
            document.getElementById("cidade")?.value || "todos";

        const bairro =
            document.getElementById("bairro")?.value || "todos";

        const precoMin =
            Number(document.getElementById("precoMin")?.value) || 0;

        const precoMax =
            Number(document.getElementById("precoMax")?.value) || Infinity;

        const tiposSelecionados = Array.from(
            document.querySelectorAll(".opcoes button.active")
        ).map(btn =>
            btn.textContent.trim().toLowerCase()
        );

        const cards =
            document.querySelectorAll(".card");

        cards.forEach(card => {

            const tipo =
                card.dataset.tipo?.toLowerCase();

            const cardCidade =
                card.dataset.cidade?.toLowerCase();

            const cardBairro =
                card.dataset.bairro?.toLowerCase();

            const preco =
                Number(card.dataset.preco);

            let mostrar = true;

            // Cidade

            if (
                cidade !== "todos" &&
                cardCidade !== cidade
            ) {
                mostrar = false;
            }

            // Bairro

            if (
                bairro !== "todos" &&
                cardBairro !== bairro
            ) {
                mostrar = false;
            }

            // Tipo

            if (
                tiposSelecionados.length > 0 &&
                !tiposSelecionados.includes(tipo)
            ) {
                mostrar = false;
            }

            // Preço

            if (
                preco < precoMin ||
                preco > precoMax
            ) {
                mostrar = false;
            }

            card.style.display =
                mostrar ? "block" : "none";

        });

        atualizarContador();

    }

    // ==========================
    // ORDENAR
    // ==========================

    document
        .getElementById("ordenar")
        .addEventListener("change", () => {

            const container =
                document.querySelector(".cards-container");

            const cards =
                Array.from(document.querySelectorAll(".card"));

            const ordem =
                document.getElementById("ordenar").value;

            cards.sort((a, b) => {

                const precoA =
                    Number(a.dataset.preco);

                const precoB =
                    Number(b.dataset.preco);

                if (ordem === "Menor preço") {
                    return precoA - precoB;
                }

                if (ordem === "Maior preço") {
                    return precoB - precoA;
                }

                return 0;

            });

            cards.forEach(card => {

                container.appendChild(card);

            });

        });

});