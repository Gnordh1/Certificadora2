// --- START OF FILE progresso.js ---

document.addEventListener("DOMContentLoaded", () => {
  /**
   * Função principal que orquestra a renderização do dashboard de progresso.
   * @param {object} data - O objeto de dados contendo `resumo` e `progressoPorTopico`.
   */
  function renderDashboard(data) {
    if (!data || !data.resumo || !data.progressoPorTopico) {
      console.error("Dados de progresso inválidos ou incompletos recebidos.");
      document.getElementById("topicos-progresso-container").innerHTML =
        '<p class="error-message">Não foi possível processar os dados de progresso.</p>';
      return;
    }
    renderResumo(data.resumo);
    renderTopicos(data.progressoPorTopico);
    renderRecomendacoes(data.progressoPorTopico);
  }

  /**
   * Renderiza a seção de resumo geral no topo da página.
   * @param {object} resumo - O objeto com as estatísticas globais.
   */
  function renderResumo(resumo) {
    document.getElementById(
      "geral-exercicios"
    ).textContent = `${resumo.exerciciosConcluidos}/${resumo.totalExercicios}`;
    document.getElementById(
      "geral-acerto"
    ).textContent = `${resumo.taxaAcertoGlobal}%`;
    document.getElementById(
      "geral-topicos"
    ).textContent = `${resumo.topicosIniciados}/${resumo.totalTopicos}`;

    const percentualGeral =
      resumo.totalExercicios > 0
        ? (resumo.exerciciosConcluidos / resumo.totalExercicios) * 100
        : 0;

    const barraGeral = document.getElementById("barra-preenchimento-geral");
    if (barraGeral) {
        barraGeral.style.width = `${percentualGeral}%`;
    }

    const percentualLabel = document.getElementById("geral-percentual");
    if (percentualLabel) {
        percentualLabel.textContent = `${percentualGeral.toFixed(0)}% de todos os exercícios concluídos`;
    }
  }

  /**
   * *** LÓGICA ATUALIZADA AQUI ***
   * Função auxiliar para determinar a classe CSS do badge de progresso
   * com base na porcentagem de conclusão do tópico.
   * @param {number} porcentagem - Porcentagem de conclusão (0-100).
   * @param {number} concluidos - Número de exercícios concluídos corretamente.
   * @returns {string} - A classe CSS a ser aplicada ('bom', 'medio', 'ruim', 'neutro').
   */
  function getAcertoBadgeClass(porcentagem, concluidos) {
    if (concluidos === 0) return "neutro"; // Se não começou, cor neutra
    if (porcentagem >= 80) return "bom";    // Verde para 80% ou mais
    if (porcentagem >= 50) return "medio";  // Amarelo para 50% a 79%
    return "ruim";                          // Vermelho para menos de 50%
  }

  /**
   * Renderiza os cards de progresso para cada tópico.
   * @param {Array<object>} topicos - Uma lista de objetos, cada um representando o progresso em um tópico.
   */
  function renderTopicos(topicos) {
    const container = document.getElementById("topicos-progresso-container");
    container.innerHTML = "";

    if (topicos.length === 0) {
        container.innerHTML = "<p>Ainda não há dados de progresso para exibir. Comece a fazer os exercícios!</p>";
        return;
    }

    topicos.forEach((topico) => {
      const progressoPercent = topico.acertos; // O campo 'acertos' do DTO agora é a % de conclusão
      const badgeClass = getAcertoBadgeClass(progressoPercent, topico.concluidos);
      const badgeText = `${progressoPercent}%`;

      const cardHTML = `
        <div class="topico-progresso-card">
            <div class="progresso-card-header">
                <h4>${topico.nome}</h4>
                <span class="acerto-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="progresso-card-body">
                <div class="topico-estatisticas">
                    <div class="estatistica-item">
                        <span>Progresso:</span>
                        <span class="estatistica-valor">${topico.concluidos} / ${topico.total}</span>
                    </div>
                </div>
                <div class="progresso-barra-container">
                    <div class="progresso-preenchimento" style="width: ${progressoPercent}%;"></div>
                </div>
                <a href="${topico.link}" class="btn secondary">Revisar Teoria</a>
            </div>
        </div>
      `;
      container.innerHTML += cardHTML;
    });
  }

  /**
   * Renderiza a seção de recomendações.
   * @param {Array<object>} topicos - A lista de progresso por tópico.
   */
  function renderRecomendacoes(topicos) {
    const container = document.getElementById("recomendacoes-container");
    container.innerHTML = "";
    let recommendationsHTML = "";

    const pontosFracos = topicos.filter(
      (t) => t.acertos < 50 && t.concluidos > 0
    );
    pontosFracos.forEach((topico) => {
      recommendationsHTML += `
        <div class="recomendacao-card negativa">
            <h4><i class="fas fa-arrow-up"></i> Ponto de Melhoria: ${topico.nome}</h4>
            <p>Seu progresso neste tópico está em ${topico.acertos}%. Que tal revisar a teoria e tentar alguns exercícios novamente para fortalecer sua base?</p>
        </div>`;
    });

    const pontosFortes = topicos.filter((t) => t.acertos >= 80 && t.concluidos > 0);
    pontosFortes.forEach((topico) => {
      recommendationsHTML += `
        <div class="recomendacao-card positiva">
            <h4><i class="fas fa-check-circle"></i> Excelente Desempenho em ${topico.nome}!</h4>
            <p>Você dominou este tópico com ${topico.acertos}% de progresso. Continue assim!</p>
        </div>`;
    });

    if (recommendationsHTML === "") {
      recommendationsHTML = `<div class="recomendacao-card"><p>Continue praticando para receber recomendações personalizadas!</p></div>`;
    }

    container.innerHTML = recommendationsHTML;
  }

  /**
   * Função assíncrona para buscar os dados de progresso reais do backend.
   * Esta função agora assume que o usuário JÁ ESTÁ AUTENTICADO.
   */
  async function carregarDadosDeProgresso() {
    const container = document.getElementById("topicos-progresso-container");
    const introContainer = document.querySelector(".progresso-intro .container");
    const recomendacoesContainer = document.getElementById("recomendacoes-container");

    try {
        // A lógica de erro 401 foi movida para a função de verificação de login.
        const response = await fetch('/api/progresso');

        if (!response.ok) {
            // Lida com outros erros da API que não sejam 401.
            throw new Error(`Erro na API: ${response.status} ${response.statusText}`);
        }

        const progressoReal = await response.json();
        renderDashboard(progressoReal);

    } catch (error) {
        console.error("Erro ao carregar dados de progresso:", error);
        if(introContainer) introContainer.style.display = 'none';
        if(recomendacoesContainer) recomendacoesContainer.innerHTML = '';
        if(container) container.innerHTML = `<div class="loading-placeholder" style="color: var(--error-color);">${error.message}</div>`;
    }
  }

  /**
   * Verifica se o usuário está logado. Se sim, carrega os dados de progresso.
   * Se não, redireciona para a página de login.
   */
  async function checkLoginStatusAndLoadProgress() {
    // Esconder o conteúdo principal para evitar "flash" de conteúdo
    const mainContent = document.querySelector('main');
    if (mainContent) mainContent.style.display = 'none';

    try {
      // 1. Verifica o status do usuário
      const response = await fetch('/api/auth/user');

      if (response.ok) {
        // 2. Usuário está logado. Mostra o conteúdo e carrega os dados.
        if (mainContent) mainContent.style.display = 'block'; // Mostra a página
        carregarDadosDeProgresso(); // Chama a função original
      } else if (response.status === 401) {
        // 3. Usuário NÃO está logado. Redireciona para o login.
        window.location.href = 'login.html';
      } else {
        // 4. Outro erro do servidor ao verificar o usuário.
        throw new Error(`Erro ao verificar autenticação: ${response.status}`);
      }
    } catch (error) {
      // 5. Erro de rede ou outro problema.
      console.error('Falha na verificação de login:', error);
      // Mostra uma mensagem de erro crítica em vez de redirecionar
      document.body.innerHTML = `<div style="padding: 2rem; text-align: center;">
                                    <h2 style="color: var(--error-color);">Falha na Conexão</h2>
                                    <p>Não foi possível verificar seu status de login. Por favor, verifique sua conexão com a internet e tente recarregar a página.</p>
                                    <a href="exercicios.html" class="btn primary">Tentar Novamente</a>
                                  </div>`;
    }
  }

  checkLoginStatusAndLoadProgress();
});