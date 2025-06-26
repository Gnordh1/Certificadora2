document.addEventListener("DOMContentLoaded", () => {
  // --- Elementos do Navbar ---
  const loginNavLink = document.getElementById("login-nav-link");
  const userInfoNav = document.getElementById("user-info-nav");
  const userDisplayNameSpan = document.getElementById("user-display-name");
  const userAvatarImg = document.getElementById("user-avatar-img");
  const logoutBtn = document.getElementById("logout-btn");
  const userDropdown = document.querySelector(".user-dropdown");
  const userDropdownToggle = document.querySelector(".user-dropdown-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const mainContent = document.querySelector("main");

  /**
   * Verifica se o usuário está logado. Se sim, carrega os dados de progresso.
   * Se não, redireciona para a página de login.
   */
  async function checkLoginStatusAndLoadProgress() {
    if (mainContent) mainContent.style.display = "none";

    try {
      const response = await fetch("/api/auth/user");

      if (response.ok) {
        const usuario = await response.json();

        // Atualiza UI da Navbar para usuário logado
        if (userDisplayNameSpan)
          userDisplayNameSpan.textContent = `Olá, ${
            usuario.nome || usuario.email
          }`;
        if (userAvatarImg)
          userAvatarImg.src = usuario.avatarUrl || "assets/icon-3d.jpg";
        if (userInfoNav) userInfoNav.style.display = "block";
        if (loginNavLink) loginNavLink.style.display = "none";

        // Mostra a página e carrega os dados de progresso
        if (mainContent) mainContent.style.display = "block";
        carregarDadosDeProgresso();
      } else if (response.status === 401) {
        // Usuário NÃO está logado, redireciona
        window.location.href = "login.html";
      } else {
        throw new Error(`Erro ao verificar autenticação: ${response.status}`);
      }
    } catch (error) {
      console.error("Falha na verificação de login:", error);
      document.body.innerHTML = `<div class="error-message" style="margin: 2rem auto; max-width: 600px;"><h2>Falha na Conexão</h2><p>Não foi possível verificar seu status de login. Por favor, verifique sua conexão com a internet e <a href="progresso.html">tente recarregar a página</a>.</p></div>`;
    }
  }

  // --- Lógica de Navegação (Menu Mobile e Dropdown) ---
  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active");
      menuToggle.setAttribute(
        "aria-expanded",
        navMenu.classList.contains("active")
      );
    });
  }

  if (userDropdownToggle && userDropdown) {
    userDropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      userDropdown.classList.toggle("active");
      userDropdownToggle.setAttribute(
        "aria-expanded",
        userDropdown.classList.contains("active")
      );
    });
  }

  window.addEventListener("click", (event) => {
    if (userDropdown && userDropdown.classList.contains("active")) {
      if (!userDropdown.contains(event.target)) {
        userDropdown.classList.remove("active");
        userDropdownToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  if (logoutBtn) {
    logoutBtn.addEventListener("click", async (e) => {
      e.preventDefault();
      try {
        const response = await fetch("/api/auth/logout", { method: "POST" });
        if (response.ok) {
          window.location.href = "login.html";
        } else {
          alert("Falha ao fazer logout.");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Erro de conexão durante o logout.");
      }
    });
  }

  /**
   * Função principal que orquestra a renderização do dashboard de progresso.
   */
  function renderDashboard(data) {
    if (!data || !data.resumo || !data.progressoPorTopico) {
      console.error("Dados de progresso inválidos.");
      document.getElementById("topicos-progresso-container").innerHTML =
        '<p class="error-message">Não foi possível processar os dados.</p>';
      return;
    }
    renderResumo(data.resumo);
    renderTopicos(data.progressoPorTopico);
    renderRecomendacoes(data.progressoPorTopico);
  }

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
    if (barraGeral) barraGeral.style.width = `${percentualGeral}%`;
    const percentualLabel = document.getElementById("geral-percentual");
    if (percentualLabel)
      percentualLabel.textContent = `${percentualGeral.toFixed(
        0
      )}% de todos os exercícios concluídos`;
  }

  function getAcertoBadgeClass(porcentagem, concluidos) {
    if (concluidos === 0) return "neutro";
    if (porcentagem >= 80) return "bom";
    if (porcentagem >= 50) return "medio";
    return "ruim";
  }

  function renderTopicos(topicos) {
    const container = document.getElementById("topicos-progresso-container");
    container.innerHTML = "";
    if (topicos.length === 0) {
      container.innerHTML =
        "<p>Ainda não há dados de progresso. Comece a fazer os exercícios!</p>";
      return;
    }
    topicos.forEach((topico) => {
      const progressoPercent = topico.acertos;
      const badgeClass = getAcertoBadgeClass(
        progressoPercent,
        topico.concluidos
      );
      const badgeText = `${progressoPercent}%`;
      container.innerHTML += `<div class="topico-progresso-card"><div class="progresso-card-header"><h4>${topico.nome}</h4><span class="acerto-badge ${badgeClass}">${badgeText}</span></div><div class="progresso-card-body"><div class="topico-estatisticas"><div class="estatistica-item"><span>Progresso:</span><span class="estatistica-valor">${topico.concluidos} / ${topico.total}</span></div></div><div class="progresso-barra-container"><div class="progresso-preenchimento" style="width: ${progressoPercent}%;"></div></div><a href="${topico.link}" class="btn secondary">Revisar Teoria</a></div></div>`;
    });
  }

  function renderRecomendacoes(topicos) {
    const container = document.getElementById("recomendacoes-container");
    container.innerHTML = "";
    let recommendationsHTML = "";
    const pontosFracos = topicos.filter(
      (t) => t.acertos < 50 && t.concluidos > 0
    );
    pontosFracos.forEach((topico) => {
      recommendationsHTML += `<div class="recomendacao-card negativa"><h4><i class="fas fa-arrow-up"></i> Ponto de Melhoria: ${topico.nome}</h4><p>Seu progresso está em ${topico.acertos}%. Que tal revisar a teoria e tentar alguns exercícios?</p></div>`;
    });
    const pontosFortes = topicos.filter(
      (t) => t.acertos >= 80 && t.concluidos > 0
    );
    pontosFortes.forEach((topico) => {
      recommendationsHTML += `<div class="recomendacao-card positiva"><h4><i class="fas fa-check-circle"></i> Excelente em ${topico.nome}!</h4><p>Você dominou este tópico com ${topico.acertos}% de progresso. Continue assim!</p></div>`;
    });
    if (recommendationsHTML === "") {
      recommendationsHTML = `<div class="recomendacao-card"><p>Continue praticando para receber recomendações!</p></div>`;
    }
    container.innerHTML = recommendationsHTML;
  }

  async function carregarDadosDeProgresso() {
    const container = document.getElementById("topicos-progresso-container");
    try {
      const response = await fetch("/api/progresso");
      if (!response.ok)
        throw new Error(
          `Erro na API: ${response.status} ${response.statusText}`
        );
      const progressoReal = await response.json();
      renderDashboard(progressoReal);
    } catch (error) {
      console.error("Erro ao carregar dados de progresso:", error);
      if (container)
        container.innerHTML = `<div class="loading-placeholder error-message">${error.message}</div>`;
    }
  }

  // Inicia o processo
  checkLoginStatusAndLoadProgress();
});
