document.addEventListener('DOMContentLoaded', function() {
    const filePath = 'public/Publicações 15 07 2024.csv';

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
                    const bairroSelect = document.getElementById('bairro');
                    const logradouroSelect = document.getElementById('logradouro');

                    // Obtenha a lista única de bairros
                    const bairros = [...new Set(data.map(endereco => endereco.Bairro).filter(Boolean))];

                    // Preencha o select de bairros
                    bairros.forEach(bairro => {
                        const option = document.createElement('option');
                        option.value = bairro;
                        option.textContent = bairro;
                        bairroSelect.appendChild(option);
                    });

                    // Evento para filtrar logradouros com base no bairro selecionado
                    bairroSelect.addEventListener('change', function() {
                        const bairroSelecionado = bairroSelect.value;
                        // Limpe o select de logradouros

                        if (bairroSelecionado == '') {
                            logradouroSelect.innerHTML = '<option value="">Selecione primeiramente um bairro</option>';
                        } else {
                            logradouroSelect.innerHTML = '<option value="">Selecione um logradouro</option>';
                        }
                        

                        // Filtre logradouros com base no bairro selecionado
                        const logradourosFiltrados = data.filter(endereco => endereco.Bairro === bairroSelecionado);

                        // Preencha o select de logradouros
                        logradourosFiltrados.forEach(endereco => {
                            if (endereco.Logradouro) {
                                const option = document.createElement('option');
                                option.value = endereco.Logradouro;
                                option.textContent = endereco.Logradouro;
                                logradouroSelect.appendChild(option);
                            }
                        });
                    });

                    document.getElementById('buscar').addEventListener('click', function() {
                        const logradouroPesquisado = logradouroSelect.value;
                        const enderecoEncontrado = data.find(endereco => endereco.Logradouro === logradouroPesquisado);

                        const resultado = document.getElementById('resultado');
                        const cep_resultado = document.getElementById('cep_resultado');
                        if (enderecoEncontrado) {
                            resultado.textContent = `O CEP para o logradouro "${logradouroPesquisado}" é:`;
                            cep_resultado.textContent = ` ${enderecoEncontrado.CEP}`;
                        } else {
                            resultado.textContent = 'Logradouro não encontrado';
                            cep_resultado.textContent = '';
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