document.addEventListener('DOMContentLoaded', function() {
    const filePath = 'public/Publicações 15 07 2024.csv'; // Caminho para o arquivo CSV

    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao carregar o arquivo CSV');
            }
            return response.text();
        })
        .then(csvText => {
            Papa.parse(csvText, {
                header: true,
                dynamicTyping: true,
                complete: function(results) {
                    const data = results.data;
                    console.log('Parsed CSV data:', data);

                    // Populando a lista de sugestões para autocomplete
                    const datalist = document.getElementById('logradouros');
                    data.forEach(endereco => {
                        if (endereco.Logradouro) { // Verificar se o Logradouro não é nulo
                            const option = document.createElement('option');
                            option.value = endereco.Logradouro;
                            datalist.appendChild(option);
                        }
                    });

                    // Adicionando evento de busca
                    document.getElementById('buscar').addEventListener('click', function() {
                        const logradouroPesquisado = document.getElementById('logradouro').value;
                        const enderecoEncontrado = data.find(endereco => endereco.Logradouro && endereco.Logradouro.toLowerCase() === logradouroPesquisado.toLowerCase());

                        const resultado = document.getElementById('resultado');
                        const cep_resultado = document.getElementById('cep_resultado');
                        if (enderecoEncontrado) {
                            resultado.textContent = `O CEP para o logradouro "${logradouroPesquisado}" é:`;
                            cep_resultado.textContent = ` ${enderecoEncontrado.CEP}`;
                        } else {
                            resultado.textContent = 'Logradouro não encontrado';
                        }
                    });
                },
                error: function(error) {
                    console.error('Error parsing CSV:', error);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar o arquivo:', error);
        });
});