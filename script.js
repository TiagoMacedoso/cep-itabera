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
                    const resultado = document.getElementById('resultado');
                    const cep_resultado = document.getElementById('cep_resultado');

                    const bairros = [...new Set(data.map(endereco => endereco.Bairro).filter(Boolean))];

                    bairros.forEach(bairro => {
                        const option = document.createElement('option');
                        option.value = bairro;
                        option.textContent = bairro;
                        bairroSelect.appendChild(option);
                    });

                    bairroSelect.addEventListener('change', function() {
                        const bairroSelecionado = bairroSelect.value;
                        
                        resultado.textContent = ``;
                        cep_resultado.textContent = ``;

                        if (bairroSelecionado == '') {
                            logradouroSelect.innerHTML = '<option value="">Selecione primeiramente um bairro</option>';
                        } else {
                            logradouroSelect.innerHTML = '<option value="">Selecione um logradouro</option>';
                        }
                        
                        const logradourosFiltrados = data.filter(endereco => endereco.Bairro === bairroSelecionado);

                        logradourosFiltrados.forEach(endereco => {
                            if (endereco.Logradouro) {
                                const option = document.createElement('option');
                                option.value = endereco.Logradouro;
                                option.textContent = endereco.Logradouro;
                                logradouroSelect.appendChild(option);
                            }
                        });
                    });

                    logradouroSelect.addEventListener('change', function() {
                        resultado.textContent = ``;
                        cep_resultado.textContent = ``;

                        if (bairroSelect.value && logradouroSelect.value) {
                            procurar_cep()
                        }
                    });

                    document.getElementById('buscar').addEventListener('click', function() {
                        procurar_cep()
                    });

                    function procurar_cep() {
                        const logradouroPesquisado = logradouroSelect.value;
                        const enderecoEncontrado = data.find(endereco => endereco.Logradouro === logradouroPesquisado);

                        if (enderecoEncontrado) {
                            resultado.textContent = `O CEP para o logradouro "${logradouroPesquisado}" é:`;
                            cep_resultado.textContent = ` ${enderecoEncontrado.CEP}`;
                        } else {
                            resultado.textContent = 'Logradouro não encontrado';
                            cep_resultado.textContent = '';
                        }
                    }
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