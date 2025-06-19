document.addEventListener('DOMContentLoaded', async () => {
    const exerciciosContainer = document.getElementById('exercicios-container');
    const topicoSelect = document.getElementById('topico-select');
    const nivelSelect = document.getElementById('nivel-select');
    const filtrarBtn = document.getElementById('filtrar-exercicios');
    const paginaAtualSpan = document.getElementById('pagina-atual');
    const anteriorBtn = document.getElementById('anterior-pagina');
    const proximaBtn = document.getElementById('proxima-pagina');

    // For Login/Logout UI
    const userInfoNav = document.getElementById('user-info-nav');
    const userDisplayNameSpan = document.getElementById('user-display-name');
    const logoutBtn = document.getElementById('logout-btn');
    const loginNavLink = document.getElementById('login-nav-link');

    let currentUsuarioId = null;
    let currentUsuarioNome = null;
    let currentPage = 0;
    let pageSize = 5;
    let totalPages = 1;
    let currentFilters = {
        topico: 'todos',
        nivel: 'todos'
    };
    let isLoading = false;

    const API_BASE_URL = '/api/exercicios'; // Your existing API base

    // --- Authentication and Initialization ---
    async function checkLoginStatusAndInitialize() {
        try {
            const response = await fetch('/api/auth/user'); // Endpoint to get current user
            if (response.ok) {
                const usuario = await response.json();
                currentUsuarioId = usuario.id;
                currentUsuarioNome = usuario.nome || usuario.email; // Prefer 'nome', fallback to 'email'

                // Update UI for logged-in user
                if (userDisplayNameSpan) userDisplayNameSpan.textContent = `Olá, ${currentUsuarioNome}!`;
                if (userInfoNav) userInfoNav.style.display = 'flex'; // Or 'block' or as per your CSS
                if (logoutBtn) logoutBtn.style.display = 'inline-block';
                if (loginNavLink) loginNavLink.style.display = 'none';

                // Now that user is confirmed, fetch exercises
                fetchExercicios();
            } else if (response.status === 401) {
                // Not logged in, redirect to login page
                if (loginNavLink) loginNavLink.style.display = 'list-item'; // Show login link
                if (userInfoNav) userInfoNav.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'none';
                // Redirect to login if this page strictly requires login
                window.location.href = 'login.html';
            } else {
                // Other server error
                console.error('Error fetching user status:', response.status);
                if (loginNavLink) loginNavLink.style.display = 'list-item';
                exerciciosContainer.innerHTML = '<p class="error-message">Erro ao verificar autenticação. Tente recarregar.</p>';
            }
        } catch (error) {
            console.error('Network error checking login status:', error);
            if (loginNavLink) loginNavLink.style.display = 'list-item';
             window.location.href = 'login.html';
        }
    }

    // Logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                const response = await fetch('/logout', { method: 'POST' });
                if (response.ok) {
                    window.location.href = 'login.html'; // Redirect to login after logout
                } else {
                    alert('Falha ao fazer logout. Tente novamente.');
                }
            } catch (error) {
                console.error('Logout failed:', error);
                alert('Erro de conexão durante o logout.');
            }
        });
    }

    // --- Core Exercise Functionality ---

    // Creates the loading indicator
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
        if (currentUsuarioId === null && window.location.pathname.includes("exercicios.html")) {
            console.warn("Attempted to fetch exercises without a user ID. Login might have failed or is pending.");
            return;
        }

        const topico = currentFilters.topico;
        const nivel = currentFilters.nivel;

        let url = `${API_BASE_URL}?page=${currentPage}&size=${pageSize}&sort=id,asc`;
        if (topico !== 'todos' && topico) {
            url += `&topico=${topico}`;
        }
        if (nivel !== 'todos' && nivel) {
            url += `&nivel=${nivel}`;
        }
        if (currentUsuarioId !== null) {
            url += `&usuarioId=${currentUsuarioId}`;
        }

        console.log("Fetching exercises with URL:", url);

        try {
            isLoading = true;
            exerciciosContainer.innerHTML = '';
            exerciciosContainer.appendChild(createLoadingIndicator());
            filtrarBtn.disabled = true;

            // Lógica de desativar os botões de paginação foi REMOVIDA daqui para evitar o bug.

            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            const data = await response.json();

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
            anteriorBtn.disabled = (currentPage === 0);
            proximaBtn.disabled = (currentPage >= totalPages - 1);

            // Se não houver exercícios, desabilita tudo
            if (totalPages === 0 || totalPages === 1) {
                anteriorBtn.disabled = true;
                proximaBtn.disabled = true;
            }
        }
    }

    function renderExercicios(exercicios) {
        exerciciosContainer.innerHTML = '';
        if (!exercicios || exercicios.length === 0) {
            exerciciosContainer.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search" style="font-size: 2rem; color: #ccc; margin-bottom: 15px;"></i>
                    <p>Nenhum exercício novo encontrado com os filtros atuais ou todos já foram respondidos corretamente.</p>
                </div>
            `;
            return;
        }

        exercicios.forEach((ex) => {
            if (!ex || ex.id === null || ex.id === undefined || ex.titulo === null || ex.titulo === undefined) {
                console.warn('Ignorando exercício inválido:', ex);
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

        document.querySelectorAll('.opcao').forEach(opcao => {
            opcao.addEventListener('click', function() {
                const form = this.closest('.exercicio-form');
                if (form.querySelector('input[type="radio"]:disabled')) return;
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
                form.querySelectorAll('.opcao').forEach(op => op.classList.remove('selecionada'));
                this.classList.add('selecionada');
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
            anteriorBtn.disabled = pageData.first || isLoading;
            proximaBtn.disabled = pageData.last || isLoading;

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
            console.log("clicado")
            currentPage++;
            fetchExercicios();
        }
    });

    exerciciosContainer.addEventListener('click', async (event) => {
        if (event.target.classList.contains('verificar-btn') || event.target.closest('.verificar-btn')) {
            const button = event.target.classList.contains('verificar-btn') ?
                          event.target :
                          event.target.closest('.verificar-btn');

            if (button.disabled) return;

            const exercicioId = button.dataset.exercicioId;
            const form = button.closest('.exercicio-form');
            const card = button.closest('.exercicio-card');
            const feedbackContainer = card.querySelector('.feedback-container');
            const feedbackCorretoDiv = feedbackContainer.querySelector('.feedback.correto');
            const feedbackIncorretoDiv = feedbackContainer.querySelector('.feedback.incorreto');

            const selectedOption = form.querySelector(`input[name="ex${exercicioId}"]:checked`);

            if (!selectedOption) {
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
                const oldAlert = form.querySelector('.select-alert');
                if (oldAlert) oldAlert.remove();
                form.appendChild(alertMessage);
                setTimeout(() => {
                    alertMessage.style.animation = 'fadeOut 0.3s ease-out';
                    setTimeout(() => alertMessage.remove(), 300);
                }, 3000);
                return;
            }

            const respostaUsuario = parseInt(selectedOption.value);
            const originalBtnText = button.innerHTML;
            button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verificando...`;
            button.disabled = true;

            feedbackCorretoDiv.classList.add('hidden');
            feedbackIncorretoDiv.classList.add('hidden');
            feedbackContainer.classList.add('hidden');

            try {
                const response = await fetch(`${API_BASE_URL}/${exercicioId}/verificar`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ resposta: respostaUsuario, usuarioId: currentUsuarioId }),
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ feedback: `Erro HTTP: ${response.status}. Resposta não é JSON.` }));
                    throw new Error(errorData.feedback || `Erro HTTP: ${response.status}`);
                }
                const result = await response.json();
                await new Promise(resolve => setTimeout(resolve, 500));

                feedbackContainer.classList.remove('hidden');
                if (result.correta) {
                    feedbackCorretoDiv.innerHTML = `
                        <div class="feedback-icon"><i class="fas fa-check-circle"></i></div>
                        <div class="feedback-content"><p>${result.feedback || 'Correto!'}</p></div>
                    `;
                    feedbackCorretoDiv.classList.remove('hidden');
                    card.classList.add('success-answer');
                } else {
                    feedbackIncorretoDiv.innerHTML = `
                        <div class="feedback-icon"><i class="fas fa-times-circle"></i></div>
                        <div class="feedback-content">
                            <p>${result.feedback || 'Incorreto.'}</p>
                            ${result.respostaCorreta !== undefined && result.respostaCorreta !== null ?
                                `<p class="info-correta">A resposta correta era a alternativa ${result.respostaCorreta + 1}.</p>` : ''}
                        </div>
                    `;
                    feedbackIncorretoDiv.classList.remove('hidden');
                    card.classList.add('error-answer');
                }

                button.innerHTML = originalBtnText;
                form.querySelectorAll('input[type="radio"]').forEach(input => input.disabled = true);
                form.querySelectorAll('.opcao').forEach(opcaoEl => {
                     opcaoEl.style.cursor = 'default';
                     opcaoEl.classList.add('disabled');
                });

            } catch (error) {
                console.error('Erro ao verificar resposta:', error);
                button.innerHTML = originalBtnText;
                button.disabled = false;

                feedbackContainer.classList.remove('hidden');
                feedbackIncorretoDiv.innerHTML = `<div class="feedback-icon"><i class="fas fa-exclamation-triangle"></i></div>
                                                 <div class="feedback-content"><p>Erro ao verificar: ${error.message}</p></div>`;
                feedbackIncorretoDiv.classList.remove('hidden');
            }
        }
    });

    document.querySelectorAll('.pill').forEach(pill => {
        pill.addEventListener('click', function() {
            document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
            this.classList.add('active');
        });
    });

    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.classList.toggle('active');
            this.setAttribute('aria-expanded', navMenu.classList.contains('active'));
        });
    }

    await checkLoginStatusAndInitialize();
});