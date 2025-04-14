// Esperar o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Verificar em qual página estamos
    const currentPage = window.location.pathname;
    
    // Funções específicas para cada página
    if (currentPage.includes('teoria.html')) {
        initTeoriaPage();
    } else if (currentPage.includes('exercicios.html')) {
        initExerciciosPage();
    } else if (currentPage.includes('simulador.html')) {
        initSimuladorPage();
    } else if (currentPage.includes('progresso.html')) {
        initProgressoPage();
    }
    
    // Inicializar funcionalidades comuns a todas as páginas
    initCommonFunctions();
});

// Funções comuns a todas as páginas
function initCommonFunctions() {
    // Verificar se há dados de progresso no localStorage
    if (!localStorage.getItem('circuitlearn_progresso')) {
        // Inicializar dados de progresso
        const progressoInicial = {
            exerciciosConcluidos: 0,
            exerciciosCorretos: 0,
            topicosConcluidos: 0,
            topicos: {
                'lei-ohm': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 10
                },
                'leis-kirchhoff': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 8
                },
                'teoremas': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 12
                },
                'componentes': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 15
                },
                'analise-ac-dc': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 10
                },
                'filtros': {
                    concluido: false,
                    exerciciosConcluidos: 0,
                    exerciciosCorretos: 0,
                    totalExercicios: 8
                }
            }
        };
        
        localStorage.setItem('circuitlearn_progresso', JSON.stringify(progressoInicial));
    }
}

// Funções para a página de Teoria
function initTeoriaPage() {
    // Navegação entre tópicos
    const topicosLinks = document.querySelectorAll('#topicos-lista a');
    const topicosConteudo = document.querySelectorAll('.topico-conteudo');
    
    topicosLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remover classe active de todos os links
            topicosLinks.forEach(l => l.classList.remove('active'));
            
            // Adicionar classe active ao link clicado
            this.classList.add('active');
            
            // Obter o ID do tópico
            const topicoId = this.getAttribute('href').substring(1);
            
            // Esconder todos os conteúdos
            topicosConteudo.forEach(conteudo => {
                conteudo.style.display = 'none';
            });
            
            // Mostrar o conteúdo correspondente
            document.getElementById(topicoId).style.display = 'block';
            
            // Registrar visualização no progresso
            registrarVisualizacaoTopico(topicoId);
        });
    });
    
    // Filtros de dificuldade
    const filtrosBtns = document.querySelectorAll('.filtro-btn');
    
    filtrosBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remover classe active de todos os botões
            filtrosBtns.forEach(b => b.classList.remove('active'));
            
            // Adicionar classe active ao botão clicado
            this.classList.add('active');
            
            // Obter o nível de dificuldade
            const nivel = this.getAttribute('data-nivel');
            
            // Filtrar conteúdos
            topicosConteudo.forEach(conteudo => {
                if (nivel === 'todos' || conteudo.getAttribute('data-nivel') === nivel) {
                    conteudo.style.display = 'block';
                } else {
                    conteudo.style.display = 'none';
                }
            });
        });
    });
    
    // Calculadora da Lei de Ohm
    const calcularCorrenteBtn = document.getElementById('calcular-corrente');
    if (calcularCorrenteBtn) {
        calcularCorrenteBtn.addEventListener('click', function() {
            const tensao = parseFloat(document.getElementById('tensao').value);
            const resistencia = parseFloat(document.getElementById('resistencia').value);
            
            if (!isNaN(tensao) && !isNaN(resistencia) && resistencia !== 0) {
                const corrente = tensao / resistencia;
                document.getElementById('resultado-corrente').textContent = corrente.toFixed(3);
            } else {
                alert('Por favor, insira valores válidos para tensão e resistência.');
            }
        });
    }
    
    // Pesquisa de tópicos
    const searchInput = document.getElementById('search-teoria');
    const searchButton = document.getElementById('search-button');
    
    if (searchButton && searchInput) {
        searchButton.addEventListener('click', function() {
            buscarTopicos(searchInput.value);
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                buscarTopicos(searchInput.value);
            }
        });
    }
}

function buscarTopicos(termo) {
    termo = termo.toLowerCase();
    const topicosConteudo = document.querySelectorAll('.topico-conteudo');
    
    let encontrado = false;
    
    topicosConteudo.forEach(conteudo => {
        const texto = conteudo.textContent.toLowerCase();
        const titulo = conteudo.querySelector('h2').textContent.toLowerCase();
        
        if (texto.includes(termo) || titulo.includes(termo)) {
            // Mostrar este tópico
            conteudo.style.display = 'block';
            encontrado = true;
            
            // Destacar o link correspondente
            const id = conteudo.id;
            document.querySelector(`#topicos-lista a[href="#${id}"]`).classList.add('active');
        } else {
            conteudo.style.display = 'none';
            document.querySelector(`#topicos-lista a[href="#${conteudo.id}"]`).classList.remove('active');
        }
    });
    
    if (!encontrado) {
        alert('Nenhum tópico encontrado com o termo: ' + termo);
    }
}

function registrarVisualizacaoTopico(topicoId) {
    // Registrar que o usuário visualizou este tópico
    // Isso pode ser usado para recomendações futuras
    const progresso = JSON.parse(localStorage.getItem('circuitlearn_progresso'));
    
    if (progresso.topicos[topicoId]) {
        // Marcar como visualizado
        progresso.topicos[topicoId].visualizado = true;
        localStorage.setItem('circuitlearn_progresso', JSON.stringify(progresso));
    }
}

// Funções para a página de Exercícios
function initExerciciosPage() {
    // Filtrar exercícios
    const filtrarBtn = document.getElementById('filtrar-exercicios');
    const topicoSelect = document.getElementById('topico-select');
    const nivelSelect = document.getElementById('nivel-select');
    
    if (filtrarBtn) {
        filtrarBtn.addEventListener('click', function() {
            filtrarExercicios(topicoSelect.value, nivelSelect.value);
        });
    }
    
    // Verificar respostas
    const verificarBtns = document.querySelectorAll('.verificar-btn');
    
    verificarBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const exercicioCard = this.closest('.exercicio-card');
            const respostaCorreta = this.getAttribute('data-resposta');
            const respostaSelecionada = exercicioCard.querySelector('input[name^="ex"]:checked');
            
            if (!respostaSelecionada) {
                alert('Por favor, selecione uma resposta.');
                return;
            }
            
            const feedbackContainer = exercicioCard.querySelector('.feedback-container');
            const feedbackCorreto = exercicioCard.querySelector('.feedback.correto');
            const feedbackIncorreto = exercicioCard.querySelector('.feedback.incorreto');
            
            feedbackContainer.classList.remove('hidden');
            
            if (respostaSelecionada.value === respostaCorreta) {
                feedbackCorreto.classList.remove('hidden');
                feedbackIncorreto.classList.add('hidden');
                
                // Registrar exercício correto
                registrarExercicioRespondido(
                    exercicioCard.getAttribute('data-topico'),
                    true
                );
            } else {
                feedbackCorreto.classList.add('hidden');
                feedbackIncorreto.classList.remove('hidden');
                
                // Registrar exercício incorreto
                registrarExercicioRespondido(
                    exercicioCard.getAttribute('data-topico'),
                    false
                );
            }
        });
    });
    
    // Paginação
    const anteriorBtn = document.getElementById('anterior-pagina');
    const proximoBtn = document.getElementById('proxima-pagina');
    
    if (anteriorBtn && proximoBtn) {
        anteriorBtn.addEventListener('click', function() {
            mudarPagina(-1);
        });
        
        proximoBtn.addEventListener('click', function() {
            mudarPagina(1);
        });
    }
}

function filtrarExercicios(topico, nivel) {
    const exercicios = document.querySelectorAll('.exercicio-card');
    
    exercicios.forEach(exercicio => {
        const exercicioTopico = exercicio.getAttribute('data-topico');
        const exercicioNivel = exercicio.getAttribute('data-nivel');
        
        if ((topico === 'todos' || exercicioTopico === topico) && 
            (nivel === 'todos' || exercicioNivel === nivel)) {
            exercicio.style.display = 'block';
        } else {
            exercicio.style.display = 'none';
        }
    });
    
    // Resetar paginação
    document.getElementById('pagina-atual').textContent = 'Página 1 de 5';
    document.getElementById('anterior-pagina').disabled = true;
    document.getElementById('proxima-pagina').disabled = false;
}

function mudarPagina(direcao) {
    const paginaAtualElement = document.getElementById('pagina-atual');
    const paginaTexto = paginaAtualElement.textContent;
    const match = paginaTexto.match(/Página (\d+) de (\d+)/);
    
    if (match) {
        let paginaAtual = parseInt(match[1]);
        const totalPaginas = parseInt(match[2]);
        
        paginaAtual += direcao;
        
        if (paginaAtual < 1) paginaAtual = 1;
        if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
        
        paginaAtualElement.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
        
        document.getElementById('anterior-pagina').disabled = (paginaAtual === 1);
        document.getElementById('proxima-pagina').disabled = (paginaAtual === totalPaginas);
        
        // Aqui você implementaria a lógica para mostrar os exercícios da página atual
        // e esconder os das outras páginas
    }
}

function registrarExercicioRespondido(topico, correto) {
    const progresso = JSON.parse(localStorage.getItem('circuitlearn_progresso'));
    
    // Incrementar contadores gerais
    progresso.exerciciosConcluidos++;
    if (correto) {
        progresso.exerciciosCorretos++;
    }
    
    // Incrementar contadores do tópico
    if (progresso.topicos[topico]) {
        progresso.topicos[topico].exerciciosConcluidos++;
        if (correto) {
            progresso.topicos[topico].exerciciosCorretos++;
        }
        
        // Verificar se o tópico foi concluído
        if (progresso.topicos[topico].exerciciosConcluidos >= progresso.topicos[topico].totalExercicios) {
            progresso.topicos[topico].concluido = true;
            progresso.topicosConcluidos++;
        }
    }
    
    localStorage.setItem('circuitlearn_progresso', JSON.stringify(progresso));
}

// Funções para a página do Simulador
function initSimuladorPage() {
    // Implementação do simulador básico
    const circuitoCanvas = document.getElementById('circuito-canvas');
    const componentes = document.querySelectorAll('.componente');
    const limparBtn = document.getElementById('limpar-simulacao');
    const executarBtn = document.getElementById('executar-simulacao');
    const predefinidosBtns = document.querySelectorAll('.predefinido-btn');
    
    if (componentes.length > 0 && circuitoCanvas) {
        // Tornar os componentes arrastáveis
        componentes.forEach(componente => {
            componente.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.getAttribute('data-tipo'));
            });
        });
        
        // Permitir soltar componentes no canvas
        circuitoCanvas.addEventListener('dragover', function(e) {
            e.preventDefault();
        });
        
        circuitoCanvas.addEventListener('drop', function(e) {
            e.preventDefault();
            const tipo = e.dataTransfer.getData('text/plain');
            
            // Remover mensagem de placeholder
            const placeholder = this.querySelector('.placeholder-msg');
            if (placeholder) {
                placeholder.remove();
            }
            
            // Criar elemento do componente
            const componenteElement = document.createElement('div');
            componenteElement.className = 'componente-canvas';
            componenteElement.setAttribute('data-tipo', tipo);
            
            // Posicionar no local do drop
            componenteElement.style.position = 'absolute';
            componenteElement.style.left = (e.clientX - this.getBoundingClientRect().left) + 'px';
            componenteElement.style.top = (e.clientY - this.getBoundingClientRect().top) + 'px';
            
            // Adicionar ícone ou texto do componente
            switch (tipo) {
                case 'fonte':
                    componenteElement.innerHTML = '⚡ Fonte';
                    componenteElement.style.backgroundColor = '#ffeb3b';
                    break;
                case 'resistor':
                    componenteElement.innerHTML = '⊥⊥⊥ Resistor';
                    componenteElement.style.backgroundColor = '#ff9800';
                    break;
                case 'led':
                    componenteElement.innerHTML = '💡 LED';
                    componenteElement.style.backgroundColor = '#4caf50';
                    break;
                case 'interruptor':
                    componenteElement.innerHTML = '⚙️ Interruptor';
                    componenteElement.style.backgroundColor = '#2196f3';
                    break;
                case 'amperimetro':
                    componenteElement.innerHTML = '🔌 Amperímetro';
                    componenteElement.style.backgroundColor = '#9c27b0';
                    break;
                case 'voltimetro':
                    componenteElement.innerHTML = '⚡ Voltímetro';
                    componenteElement.style.backgroundColor = '#e91e63';
                    break;
            }
            
            // Tornar o componente movível
            componenteElement.draggable = true;
            componenteElement.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', 'mover');
                e.dataTransfer.setData('application/node', this.outerHTML);
                setTimeout(() => {
                    this.style.display = 'none';
                }, 0);
            });
            
            this.appendChild(componenteElement);
        });
        
        // Limpar simulação
        if (limparBtn) {
            limparBtn.addEventListener('click', function() {
                while (circuitoCanvas.firstChild) {
                    circuitoCanvas.removeChild(circuitoCanvas.firstChild);
                }
                
                // Adicionar mensagem de placeholder novamente
                const placeholder = document.createElement('div');
                placeholder.className = 'placeholder-msg';
                placeholder.innerHTML = '<p>Arraste componentes para esta área para construir seu circuito</p>';
                circuitoCanvas.appendChild(placeholder);
                
                // Limpar resultados
                document.getElementById('resultados-container').innerHTML = '<p>Nenhuma simulação executada ainda.</p>';
            });
        }
        
        // Executar simulação
        if (executarBtn) {
            executarBtn.addEventListener('click', function() {
                simularCircuito();
            });
        }
        
        // Carregar circuitos predefinidos
        if (predefinidosBtns.length > 0) {
            predefinidosBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const circuito = this.getAttribute('data-circuito');
                    carregarCircuitoPredefinido(circuito);
                });
            });
        }
    }
}

function simularCircuito() {
    const circuitoCanvas = document.getElementById('circuito-canvas');
    const resultadosContainer = document.getElementById('resultados-container');
    
    // Verificar se há componentes no circuito
    const componentes = circuitoCanvas.querySelectorAll('.componente-canvas');
    
    if (componentes.length === 0) {
        resultadosContainer.innerHTML = '<p>Não há componentes no circuito para simular.</p>';
        return;
    }
    
    // Implementação simplificada de simulação
    // Em um projeto real, você implementaria um algoritmo mais complexo
    // para analisar o circuito e calcular tensões e correntes
    
    // Verificar se há uma fonte no circuito
    const temFonte = Array.from(componentes).some(comp => comp.getAttribute('data-tipo') === 'fonte');
    
    if (!temFonte) {
        resultadosContainer.innerHTML = '<p>O circuito precisa de uma fonte de tensão para funcionar.</p>';
        return;
    }
    
    // Contar componentes por tipo
    const contagem = {
        fonte: 0,
        resistor: 0,
        led: 0,
        interruptor: 0,
        amperimetro: 0,
        voltimetro: 0
    };
    
    componentes.forEach(comp => {
        const tipo = comp.getAttribute('data-tipo');
        if (contagem[tipo] !== undefined) {
            contagem[tipo]++;
        }
    });
    
    // Simulação simplificada
    let html = '<h4>Resultados da Simulação</h4>';
    
    // Fonte
    const tensao = 12; // Valor fixo para simplificar
    html += `<p>Fonte de Tensão: ${tensao}V</p>`;
    
    // Resistores
    if (contagem.resistor > 0) {
        const resistenciaTotal = 1000 * contagem.resistor; // 1000 ohms por resistor
        html += `<p>Resistência Total: ${resistenciaTotal}Ω</p>`;
        
        // Calcular corrente
        const corrente = tensao / resistenciaTotal;
        html += `<p>Corrente no Circuito: ${corrente.toFixed(3)}A</p>`;
        
        // LEDs
        if (contagem.led > 0) {
            const tensaoLed = 2; // Valor típico
            const tensaoResistores = tensao - (tensaoLed * contagem.led);
            
            if (tensaoResistores < 0) {
                html += `<p>Aviso: Tensão insuficiente para todos os LEDs.</p>`;
            } else {
                html += `<p>Tensão nos LEDs: ${tensaoLed}V cada</p>`;
                html += `<p>Estado dos LEDs: Acesos</p>`;
            }
        }
    } else if (contagem.led > 0) {
        html += `<p>Aviso: LEDs sem resistor limitador podem queimar!</p>`;
    }
    
    // Interruptores
    if (contagem.interruptor > 0) {
        html += `<p>Interruptores: ${contagem.interruptor} (todos fechados)</p>`;
    }
    
    // Medidores
    if (contagem.voltimetro > 0) {
        html += `<p>Leitura do Voltímetro: ${tensao}V</p>`;
    }
    
    if (contagem.amperimetro > 0 && contagem.resistor > 0) {
        const resistenciaTotal = 1000 * contagem.resistor;
        const corrente = tensao / resistenciaTotal;
        html += `<p>Leitura do Amperímetro: ${corrente.toFixed(3)}A</p>`;
    } else if (contagem.amperimetro > 0) {
        html += `<p>Leitura do Amperímetro: Corrente indefinida (sem resistor)</p>`;
    }
    
    resultadosContainer.innerHTML = html;
}

function carregarCircuitoPredefinido(circuito) {
    const circuitoCanvas = document.getElementById('circuito-canvas');
    
    // Limpar canvas
    while (circuitoCanvas.firstChild) {
        circuitoCanvas.removeChild(circuitoCanvas.firstChild);
    }
    
    // Configurações para cada circuito predefinido
    switch (circuito) {
        case 'divisor-tensao':
            // Adicionar fonte
            adicionarComponente(circuitoCanvas, 'fonte', 50, 150);
            
            // Adicionar resistores
            adicionarComponente(circuitoCanvas, 'resistor', 150, 100);
            adicionarComponente(circuitoCanvas, 'resistor', 150, 200);
            
            // Adicionar voltímetro
            adicionarComponente(circuitoCanvas, 'voltimetro', 250, 150);
            break;
            
        case 'led-resistor':
            // Adicionar fonte
            adicionarComponente(circuitoCanvas, 'fonte', 50, 150);
            
            // Adicionar resistor
            adicionarComponente(circuitoCanvas, 'resistor', 150, 150);
            
            // Adicionar LED
            adicionarComponente(circuitoCanvas, 'led', 250, 150);
            break;
            
        case 'ponte-wheatstone':
            // Adicionar fonte
            adicionarComponente(circuitoCanvas, 'fonte', 50, 150);
            
            // Adicionar resistores
            adicionarComponente(circuitoCanvas, 'resistor', 150, 50);
            adicionarComponente(circuitoCanvas, 'resistor', 150, 250);
            adicionarComponente(circuitoCanvas, 'resistor', 250, 100);
            adicionarComponente(circuitoCanvas, 'resistor', 250, 200);
            
            // Adicionar voltímetro
            adicionarComponente(circuitoCanvas, 'voltimetro', 300, 150);
            break;
    }
}

function adicionarComponente(canvas, tipo, x, y) {
    const componenteElement = document.createElement('div');
    componenteElement.className = 'componente-canvas';
    componenteElement.setAttribute('data-tipo', tipo);
    
    // Posicionar
    componenteElement.style.position = 'absolute';
    componenteElement.style.left = x + 'px';
    componenteElement.style.top = y + 'px';
    
    // Adicionar ícone ou texto do componente
    switch (tipo) {
        case 'fonte':
            componenteElement.innerHTML = '⚡ Fonte';
            componenteElement.style.backgroundColor = '#ffeb3b';
            break;
        case 'resistor':
            componenteElement.innerHTML = '⊥⊥⊥ Resistor';
            componenteElement.style.backgroundColor = '#ff9800';
            break;
        case 'led':
            componenteElement.innerHTML = '💡 LED';
            componenteElement.style.backgroundColor = '#4caf50';
            break;
        case 'interruptor':
            componenteElement.innerHTML = '⚙️ Interruptor';
            componenteElement.style.backgroundColor = '#2196f3';
            break;
        case 'amperimetro':
            componenteElement.innerHTML = '🔌 Amperímetro';
            componenteElement.style.backgroundColor = '#9c27b0';
            break;
        case 'voltimetro':
            componenteElement.innerHTML = '⚡ Voltímetro';
            componenteElement.style.backgroundColor = '#e91e63';
            break;
    }
    
    // Tornar o componente movível
    componenteElement.draggable = true;
    
    canvas.appendChild(componenteElement);
}

// Funções para a página de Progresso
function initProgressoPage() {
    atualizarProgressoUI();
}

function atualizarProgressoUI() {
    const progresso = JSON.parse(localStorage.getItem('circuitlearn_progresso'));
    
    if (!progresso) return;
    
    // Atualizar contadores
    document.getElementById('exercicios-concluidos').textContent = progresso.exerciciosConcluidos;
    
    // Calcular taxa de acerto
    let taxaAcerto = 0;
    if (progresso.exerciciosConcluidos > 0) {
        taxaAcerto = Math.round((progresso.exerciciosCorretos / progresso.exerciciosConcluidos) * 100);
    }
    document.getElementById('taxa-acerto').textContent = taxaAcerto + '%';
    
    // Atualizar progresso circular
    const circulo = document.querySelector('.progresso-circular circle:nth-child(2)');
    if (circulo) {
        const circunferencia = 2 * Math.PI * 35; // 2πr
        const offset = circunferencia - (circunferencia * taxaAcerto / 100);
        circulo.style.strokeDashoffset = offset;
        circulo.style.strokeDasharray = circunferencia;
    }
    
    // Atualizar tópicos estudados
    document.getElementById('topicos-estudados').textContent = progresso.topicosConcluidos + '/6';
    
    // Atualizar barras de progresso
    const barrasProgresso = document.querySelectorAll('.progresso-preenchimento');
    
    // Barra de exercícios concluídos (estimando total de 63 exercícios)
    const totalExercicios = 63;
    const porcentagemExercicios = Math.min(100, Math.round((progresso.exerciciosConcluidos / totalExercicios) * 100));
    barrasProgresso[0].style.width = porcentagemExercicios + '%';
    barrasProgresso[0].nextElementSibling.textContent = porcentagemExercicios + '% do total';
    
    // Barra de tópicos estudados
    const porcentagemTopicos = Math.round((progresso.topicosConcluidos / 6) * 100);
    barrasProgresso[1].style.width = porcentagemTopicos + '%';
    barrasProgresso[1].nextElementSibling.textContent = porcentagemTopicos + '% concluído';
    
    // Atualizar cards de tópicos
    const topicosCards = document.querySelectorAll('.topico-progresso-card');
    
    let i = 0;
    for (const topico in progresso.topicos) {
        if (i < topicosCards.length) {
            const card = topicosCards[i];
            const dadosTopico = progresso.topicos[topico];
            
            // Atualizar barra de progresso
            const porcentagemTopico = Math.round((dadosTopico.exerciciosConcluidos / dadosTopico.totalExercicios) * 100);
            card.querySelector('.progresso-preenchimento').style.width = porcentagemTopico + '%';
            card.querySelector('.progresso-info span').textContent = porcentagemTopico + '% concluído';
            
            // Atualizar estatísticas
            card.querySelector('.estatistica:nth-child(1) .estatistica-valor').textContent = 
                dadosTopico.exerciciosConcluidos + '/' + dadosTopico.totalExercicios;
            
            let taxaAcertoTopico = 0;
            if (dadosTopico.exerciciosConcluidos > 0) {
                taxaAcertoTopico = Math.round((dadosTopico.exerciciosCorretos / dadosTopico.exerciciosConcluidos) * 100);
            }
            card.querySelector('.estatistica:nth-child(2) .estatistica-valor').textContent = taxaAcertoTopico + '%';
            
            i++;
        }
    }
    
    // Atualizar recomendações
    const recomendacoesLista = document.querySelector('.recomendacoes-lista');
    
    if (progresso.exerciciosConcluidos === 0) {
        // Usuário não começou
        recomendacoesLista.innerHTML = `
            <div class="recomendacao-card">
                <h3>Comece pelos Fundamentos</h3>
                <p>Você ainda não completou nenhum exercício. Recomendamos começar pela Lei de Ohm.</p>
                <a href="teoria.html#lei-ohm" class="btn primary">Estudar Lei de Ohm</a>
            </div>
        `;
    } else {
        // Encontrar tópico com menor progresso
        let menorProgresso = 100;
        let topicoRecomendado = '';
        
        for (const topico in progresso.topicos) {
            const dadosTopico = progresso.topicos[topico];
            const porcentagemTopico = Math.round((dadosTopico.exerciciosConcluidos / dadosTopico.totalExercicios) * 100);
            
            if (porcentagemTopico < menorProgresso) {
                menorProgresso = porcentagemTopico;
                topicoRecomendado = topico;
            }
        }
        
        // Gerar recomendação
        let tituloTopico = '';
        switch (topicoRecomendado) {
            case 'lei-ohm': tituloTopico = 'Lei de Ohm'; break;
            case 'leis-kirchhoff': tituloTopico = 'Leis de Kirchhoff'; break;
            case 'teoremas': tituloTopico = 'Teoremas de Thévenin/Norton'; break;
            case 'componentes': tituloTopico = 'Componentes Básicos'; break;
            case 'analise-ac-dc': tituloTopico = 'Análise AC/DC'; break;
            case 'filtros': tituloTopico = 'Filtros'; break;
        }
        
        recomendacoesLista.innerHTML = `
            <div class="recomendacao-card">
                <h3>Continue seus estudos em ${tituloTopico}</h3>
                <p>Você completou apenas ${menorProgresso}% dos exercícios deste tópico. Recomendamos continuar estudando.</p>
                <a href="teoria.html#${topicoRecomendado}" class="btn primary">Estudar ${tituloTopico}</a>
            </div>
        `;
        
        // Adicionar recomendação de revisão se a taxa de acerto for baixa
        if (taxaAcerto < 70) {
            recomendacoesLista.innerHTML += `
                <div class="recomendacao-card">
                    <h3>Revise os conceitos fundamentais</h3>
                    <p>Sua taxa de acerto está em ${taxaAcerto}%. Recomendamos revisar os conceitos básicos.</p>
                    <a href="teoria.html" class="btn secondary">Revisar Teoria</a>
                </div>
            `;
        }
    }
}