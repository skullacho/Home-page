// Função para alternar entre as abas Comprar e Alugar
    function setAba(tipo) {
        const btnCompreja = document.getElementById('btn-compreja');
        
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