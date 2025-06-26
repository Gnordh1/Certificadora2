document.addEventListener('DOMContentLoaded', () => {
    const exerciciosContainer = document.getElementById('exercicios-container');
    const topicoSelect = document.getElementById('topico-select');
    const nivelSelect = document.getElementById('nivel-select');
    const filtrarBtn = document.getElementById('filtrar-exercicios');
    const paginaAtualSpan = document.getElementById('pagina-atual');
    const anteriorBtn = document.getElementById('anterior-pagina');
    const proximaBtn = document.getElementById('proxima-pagina');

    let currentUsuarioId = 1; // Exemplo: usuário com ID 1
    let currentPage = 0;
    let pageSize = 5;
    let totalPages = 1;
    let currentFilters = {
        topico: 'todos',
        nivel: 'todos'
    };
    let isLoading = false;

    const API_BASE_URL = '/api/exercicios';

    // Cria o indicador de carregamento
    function createLoadingIndicator() {
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        loadingContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-circle"></div>
                <span>Carregando exercícios...</span>
            </div>
        `;
        return loadingContainer;
    }

    async function fetchExercicios() {
        const topico = currentFilters.topico;
        const nivel = currentFilters.nivel;

        let url = `${API_BASE_URL}?page=${currentPage}&size=${pageSize}&sort=id,asc`;
        if (topico !== 'todos' && topico) {
            url += `&topico=${topico}`;
        }
        if (nivel !== 'todos' && nivel) {
            url += `&nivel=${nivel}`;
        }
        if (currentUsuarioId !== null && currentUsuarioId !== undefined) {
            url += `&usuarioId=${currentUsuarioId}`;
        }

        console.log("Fetching exercises with URL:", url);

        try {
            isLoading = true;
            // Mostrar indicador de carregamento
            exerciciosContainer.innerHTML = '';
            exerciciosContainer.appendChild(createLoadingIndicator());

            // Desativar botões durante o carregamento
            filtrarBtn.disabled = true;
            anteriorBtn.disabled = true;
            proximaBtn.disabled = true;

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();

            // Pequeno delay para mostrar o loading por pelo menos 400ms
            // Isto melhora a percepção do usuário sobre o carregamento
            await new Promise(resolve => setTimeout(resolve, 400));

            if (data && data.content) {
                renderExercicios(data.content);
                totalPages = data.totalPages;
                updatePaginacao(data);
            } else {
                console.error("Estrutura de dados inesperada do backend:", data);
                exerciciosContainer.innerHTML = '<p class="error-message">Erro ao processar dados dos exercícios.</p>';
                updatePaginacao(null);
            }
        } catch (error) {
            console.error('Erro ao buscar exercícios:', error);
            exerciciosContainer.innerHTML = '<p class="error-message">Não foi possível carregar os exercícios. Tente novamente mais tarde.</p>';
            updatePaginacao(null);
        } finally {
            isLoading = false;
            filtrarBtn.disabled = false;
        }
    }

    function renderExercicios(exercicios) {
        exerciciosContainer.innerHTML = '';
        if (!exercicios || exercicios.length === 0) {
            exerciciosContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 2rem; color: #ccc; margin-bottom: 15px;"></i>
                    <p>Nenhum exercício novo encontrado ou todos já foram respondidos corretamente.</p>
                </div>
            `;
            return;
        }

        exercicios.forEach((ex, index) => {
            if (!ex || ex.id === null || ex.id === undefined || ex.titulo === null || ex.titulo === undefined) {
                console.warn('Ignorando exercício inválido ou com ID/título nulo/indefinido:', ex);
                return;
            }

            const card = document.createElement('div');
            card.className = `exercicio-card`;
            card.dataset.topico = ex.categoria || 'desconhecido';
            card.dataset.nivel = ex.dificuldade || 'desconhecido';
            card.dataset.id = ex.id;

            let alternativasHTML = '<div class="opcoes">';
            if (ex.alternativas && Array.isArray(ex.alternativas) && ex.alternativas.length > 0) {
                ex.alternativas.forEach((alt, i) => {
                    const radioId = `ex${ex.id}-alt${i}`;
                    alternativasHTML += `
                        <div class="opcao" data-value="${i}">
                            <input type="radio" id="${radioId}" name="ex${ex.id}" value="${i}">
                            <label for="${radioId}">${alt || `Alternativa ${i+1} inválida`}</label>
                        </div>
                    `;
                });
            } else {
                alternativasHTML += '<p>Este exercício não possui alternativas definidas.</p>';
            }
            alternativasHTML += '</div>';

            const dificuldadeDisplay = ex.dificuldade ? ex.dificuldade.charAt(0).toUpperCase() + ex.dificuldade.slice(1) : 'N/D';

            card.innerHTML = `
                <div class="exercicio-header">
                    <h3>${ex.titulo || 'Título não disponível'}</h3>
                    <span class="nivel-badge ${ex.dificuldade || 'desconhecido'}">${dificuldadeDisplay}</span>
                </div>
                <div class="exercicio-body">
                    <p>${ex.enunciado || 'Enunciado não disponível.'}</p>
                    <form class="exercicio-form">
                        ${alternativasHTML}
                        <button type="button" class="btn primary verificar-btn" data-exercicio-id="${ex.id}">
                            <i class="fas fa-check-circle"></i> Verificar
                        </button>
                    </form>
                    <div class="feedback-container hidden">
                        <div class="feedback correto hidden">
                            <p></p>
                        </div>
                        <div class="feedback incorreto hidden">
                            <p></p>
                        </div>
                    </div>
                </div>
            `;
            exerciciosContainer.appendChild(card);
        });

        // Adicionar event listeners para as opções clicáveis
        document.querySelectorAll('.opcao').forEach(opcao => {
            opcao.addEventListener('click', function() {
                const form = this.closest('.exercicio-form');
                // Se as opções estiverem desativadas, não faz nada
                if (form.querySelector('input[type="radio"]:disabled')) return;

                // Encontra o radio dentro desta opção e seleciona
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;

                // Remove a classe selecionada de todas as opções deste formulário
                form.querySelectorAll('.opcao').forEach(op => op.classList.remove('selecionada'));

                // Adiciona a classe selecionada a esta opção
                this.classList.add('selecionada');

                // Limpa o feedback se houver
                const card = this.closest('.exercicio-card');
                const feedbackContainer = card.querySelector('.feedback-container');
                if (feedbackContainer && !feedbackContainer.classList.contains('hidden')) {
                    feedbackContainer.classList.add('hidden');
                    feedbackContainer.querySelector('.feedback.correto').classList.add('hidden');
                    feedbackContainer.querySelector('.feedback.incorreto').classList.add('hidden');
                }
            });
        });
    }

    function updatePaginacao(pageData) {
        if (pageData && typeof pageData.number === 'number' && typeof pageData.totalPages === 'number') {
            paginaAtualSpan.textContent = `Página ${pageData.number + 1} de ${pageData.totalPages}`;
            anteriorBtn.disabled = pageData.first;
            proximaBtn.disabled = pageData.last;

            if (pageData.totalElements === 0) {
                anteriorBtn.disabled = true;
                proximaBtn.disabled = true;
            }
        } else {
            paginaAtualSpan.textContent = 'Página 1 de 1';
            anteriorBtn.disabled = true;
            proximaBtn.disabled = true;
        }
    }

    filtrarBtn.addEventListener('click', () => {
        if (isLoading) return;

        // Adiciona efeito visual ao botão
        filtrarBtn.classList.add('filtering');
        setTimeout(() => filtrarBtn.classList.remove('filtering'), 300);

        currentFilters.topico = topicoSelect.value;
        currentFilters.nivel = nivelSelect.value;
        currentPage = 0;
        fetchExercicios();
    });

    anteriorBtn.addEventListener('click', () => {
        if (currentPage > 0 && !isLoading) {
            currentPage--;
            fetchExercicios();
        }
    });

    proximaBtn.addEventListener('click', () => {
        if (totalPages > 0 && currentPage < totalPages - 1 && !isLoading) {
            currentPage++;
            fetchExercicios();
        }
    });

    // Listener de clique para o botão "Verificar"
    exerciciosContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('verificar-btn') || event.target.closest('.verificar-btn')) {
            const button = event.target.classList.contains('verificar-btn') ?
                          event.target :
                          event.target.closest('.verificar-btn');

            const exercicioId = button.dataset.exercicioId;
            const form = button.closest('.exercicio-form');
            const card = button.closest('.exercicio-card');
            const feedbackContainer = card.querySelector('.feedback-container');
            const feedbackCorretoDiv = feedbackContainer.querySelector('.feedback.correto');
            const feedbackIncorretoDiv = feedbackContainer.querySelector('.feedback.incorreto');

            const selectedOption = form.querySelector(`input[name="ex${exercicioId}"]:checked`);

            if (!selectedOption) {
                // Feedback visual melhorado para quando nenhuma opção é selecionada
                const alertMessage = document.createElement('div');
                alertMessage.className = 'select-alert';
                alertMessage.innerHTML = `<i class="fas fa-exclamation-circle"></i> Por favor, selecione uma alternativa.`;
                alertMessage.style.color = '#e65100';
                alertMessage.style.padding = '10px';
                alertMessage.style.marginTop = '10px';
                alertMessage.style.borderRadius = '4px';
                alertMessage.style.backgroundColor = '#fff3e0';
                alertMessage.style.textAlign = 'center';
                alertMessage.style.animation = 'fadeIn 0.3s ease-out';

                // Remove qualquer alerta anterior
                const oldAlert = form.querySelector('.select-alert');
                if (oldAlert) oldAlert.remove();

                form.appendChild(alertMessage);

                // Remove automaticamente após 3 segundos
                setTimeout(() => {
                    alertMessage.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => alertMessage.remove(), 300);
                }, 3000);

                return;
            }

            const respostaUsuario = parseInt(selectedOption.value);

            // Mostra feedback de carregamento no botão
            const originalBtnText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verificando...`;
            button.disabled = true;

            feedbackCorretoDiv.classList.add('hidden');
            feedbackIncorretoDiv.classList.add('hidden');
            feedbackContainer.classList.add('hidden'); // Esconde o container de feedback antes de nova verificação

            try {
                const response = await fetch(`${API_BASE_URL}/${exercicioId}/verificar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ resposta: respostaUsuario, usuarioId: currentUsuarioId }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ feedback: `Erro HTTP: ${response.status}. Resposta não é JSON.` }));
                    throw new Error(errorData.feedback || `Erro HTTP: ${response.status}`);
                }

                const result = await response.json();

                // Pequeno delay para melhorar percepção do usuário
                await new Promise(resolve => setTimeout(resolve, 500));

                feedbackContainer.classList.remove('hidden'); // Mostra o container de feedback
                if (result.correta) {
                    feedbackCorretoDiv.innerHTML = `
                        <div class="feedback-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="feedback-content">
                            <p>${result.feedback || 'Correto!'}</p>
                        </div>
                    `;
                    feedbackCorretoDiv.classList.remove('hidden');

                    // Adiciona classe de sucesso ao card
                    card.classList.add('success-answer');
                } else {
                    feedbackIncorretoDiv.innerHTML = `
                        <div class="feedback-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="feedback-content">
                            <p>${result.feedback || 'Incorreto.'}</p>
                        </div>
                    `;
                    feedbackIncorretoDiv.classList.remove('hidden');
                }

                // APÓS QUALQUER RESPOSTA (CORRETA OU INCORRETA), DESABILITAR INTERAÇÕES
                button.disabled = true;
                button.innerHTML = originalBtnText; // Restaura o texto original do botão

                const radioInputs = form.querySelectorAll('input[type="radio"]');
                radioInputs.forEach(input => input.disabled = true);

                // Adiciona visual de desabilitado nas opções
                form.querySelectorAll('.opcao').forEach(opcao => {
                    opcao.style.opacity = '0.7';
                    opcao.style.pointerEvents = 'none';
                });

            } catch (error) {
                console.error('Erro ao verificar resposta:', error);
                button.innerHTML = originalBtnText; // Restaura texto do botão
                button.disabled = false; // Reabilita o botão

                feedbackContainer.classList.remove('hidden'); // Mostra o container mesmo em erro de API
                feedbackIncorretoDiv.querySelector('p').textContent = `Erro ao verificar: ${error.message}`;
                feedbackIncorretoDiv.classList.remove('hidden');
            }
        }
    });


    // Se houver pills de filtro rápido
    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');

            // Implementação futura dos filtros rápidos...
            // Por enquanto apenas mostra o efeito visual
        });
    });

    // Menu móvel toggle
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    fetchExercicios(); // Carregar exercícios iniciais
});