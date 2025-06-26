document.addEventListener("DOMContentLoaded", async () => {
  const exerciciosContainer = document.getElementById("exercicios-container");
  const topicoSelect = document.getElementById("topico-select");
  const nivelSelect = document.getElementById("nivel-select");
  const filtrarBtn = document.getElementById("filtrar-exercicios");
  const paginaAtualSpan = document.getElementById("pagina-atual");
  const anteriorBtn = document.getElementById("anterior-pagina");
  const proximaBtn = document.getElementById("proxima-pagina");

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

  let currentUsuarioId = null;
  let currentUsuarioNome = null;
  let currentPage = 0;
  let pageSize = 5;
  let totalPages = 1;
  let currentFilters = {
    topico: "todos",
    nivel: "todos",
  };
  let isLoading = false;

  const API_BASE_URL = "/api/exercicios";

  // --- Autenticação e Inicialização da UI ---
  async function checkLoginStatusAndInitialize() {
    try {
      const response = await fetch("/api/auth/user");
      if (response.ok) {
        const usuario = await response.json();
        currentUsuarioId = usuario.id;
        currentUsuarioNome = usuario.nome || usuario.email;

        if (userDisplayNameSpan)
          userDisplayNameSpan.textContent = `Olá, ${currentUsuarioNome}`;
        if (userAvatarImg)
          userAvatarImg.src = usuario.avatarUrl || "assets/icon-3d.jpg";
        if (userInfoNav) userInfoNav.style.display = "block";
        if (loginNavLink) loginNavLink.style.display = "none";

        fetchExercicios();
      } else if (response.status === 401) {
        if (loginNavLink) loginNavLink.style.display = "list-item";
        if (userInfoNav) userInfoNav.style.display = "none";
        window.location.href = "login.html";
      } else {
        console.error("Error fetching user status:", response.status);
        if (loginNavLink) loginNavLink.style.display = "list-item";
        exerciciosContainer.innerHTML =
          '<p class="error-message">Erro ao verificar autenticação. Tente recarregar.</p>';
      }
    } catch (error) {
      console.error("Network error checking login status:", error);
      if (loginNavLink) loginNavLink.style.display = "list-item";
      window.location.href = "login.html";
    }
  }

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
      const isExpanded =
        userDropdownToggle.getAttribute("aria-expanded") === "true";
      userDropdownToggle.setAttribute("aria-expanded", !isExpanded);
      userDropdown.classList.toggle("active");
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
          alert("Falha ao fazer logout. Tente novamente.");
        }
      } catch (error) {
        console.error("Logout failed:", error);
        alert("Erro de conexão durante o logout.");
      }
    });
  }


  function createLoadingIndicator() {
    const loadingContainer = document.createElement("div");
    loadingContainer.className = "loading-container";
    loadingContainer.innerHTML = `
            <div class="loading-spinner">
                <div class="spinner-circle"></div>
                <span>Carregando exercícios...</span>
            </div>
        `;
    return loadingContainer;
  }

  async function fetchExercicios() {
    if (
      currentUsuarioId === null &&
      window.location.pathname.includes("exercicios.html")
    ) {
      console.warn(
        "Attempted to fetch exercises without a user ID. Login might have failed or is pending."
      );
      return;
    }
    const topico = currentFilters.topico;
    const nivel = currentFilters.nivel;
    let url = `${API_BASE_URL}?page=${currentPage}&size=${pageSize}&sort=id,asc`;
    if (topico !== "todos" && topico) url += `&topico=${topico}`;
    if (nivel !== "todos" && nivel) url += `&nivel=${nivel}`;
    if (currentUsuarioId !== null) url += `&usuarioId=${currentUsuarioId}`;
    try {
      isLoading = true;
      exerciciosContainer.innerHTML = "";
      exerciciosContainer.appendChild(createLoadingIndicator());
      filtrarBtn.disabled = true;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);
      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 400));
      if (data && data.content) {
        renderExercicios(data.content);
        totalPages = data.totalPages;
        updatePaginacao(data);
      } else {
        console.error("Estrutura de dados inesperada:", data);
        exerciciosContainer.innerHTML =
          '<p class="error-message">Erro ao processar dados.</p>';
        updatePaginacao(null);
      }
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      exerciciosContainer.innerHTML =
        '<p class="error-message">Não foi possível carregar. Tente novamente.</p>';
      updatePaginacao(null);
    } finally {
      isLoading = false;
      filtrarBtn.disabled = false;
      anteriorBtn.disabled = currentPage === 0;
      proximaBtn.disabled = currentPage >= totalPages - 1;
      if (totalPages === 0 || totalPages === 1) {
        anteriorBtn.disabled = true;
        proximaBtn.disabled = true;
      }
    }
  }

  function renderExercicios(exercicios) {
    exerciciosContainer.innerHTML = "";
    if (!exercicios || exercicios.length === 0) {
      exerciciosContainer.innerHTML = `<div class="no-results"><p>Nenhum exercício novo encontrado com os filtros atuais.</p></div>`;
      return;
    }
    exercicios.forEach((ex) => {
      if (
        !ex ||
        ex.id === null ||
        ex.id === undefined ||
        ex.titulo === null ||
        ex.titulo === undefined
      ) {
        console.warn("Ignorando exercício inválido:", ex);
        return;
      }
      const card = document.createElement("div");
      card.className = `exercicio-card`;
      card.dataset.id = ex.id;
      let alternativasHTML = '<div class="opcoes">';
      if (
        ex.alternativas &&
        Array.isArray(ex.alternativas) &&
        ex.alternativas.length > 0
      ) {
        ex.alternativas.forEach((alt, i) => {
          const radioId = `ex${ex.id}-alt${i}`;
          alternativasHTML += `<div class="opcao" data-value="${i}"><input type="radio" id="${radioId}" name="ex${
            ex.id
          }" value="${i}"><label for="${radioId}">${
            alt || `Alternativa ${i + 1}`
          }</label></div>`;
        });
      } else {
        alternativasHTML += "<p>Exercício sem alternativas.</p>";
      }
      alternativasHTML += "</div>";
      const dificuldadeDisplay = ex.dificuldade
        ? ex.dificuldade.charAt(0).toUpperCase() + ex.dificuldade.slice(1)
        : "N/D";
      card.innerHTML = `<div class="exercicio-header"><h3>${
        ex.titulo || "Sem Título"
      }</h3><span class="nivel-badge ${
        ex.dificuldade || "desconhecido"
      }">${dificuldadeDisplay}</span></div><div class="exercicio-body"><p>${
        ex.enunciado || "Sem enunciado."
      }</p><form class="exercicio-form">${alternativasHTML}<button type="button" class="btn primary verificar-btn" data-exercicio-id="${
        ex.id
      }"><i class="fas fa-check-circle"></i> Verificar</button></form><div class="feedback-container hidden"><div class="feedback correto hidden"></div><div class="feedback incorreto hidden"></div></div></div>`;
      exerciciosContainer.appendChild(card);
    });
    document.querySelectorAll(".opcao").forEach((opcao) => {
      opcao.addEventListener("click", function () {
        const form = this.closest(".exercicio-form");
        if (form.querySelector('input[type="radio"]:disabled')) return;
        const radio = this.querySelector('input[type="radio"]');
        radio.checked = true;
        form
          .querySelectorAll(".opcao")
          .forEach((op) => op.classList.remove("selecionada"));
        this.classList.add("selecionada");
        const card = this.closest(".exercicio-card");
        const feedbackContainer = card.querySelector(".feedback-container");
        if (
          feedbackContainer &&
          !feedbackContainer.classList.contains("hidden")
        ) {
          feedbackContainer.classList.add("hidden");
          feedbackContainer
            .querySelector(".feedback.correto")
            .classList.add("hidden");
          feedbackContainer
            .querySelector(".feedback.incorreto")
            .classList.add("hidden");
        }
      });
    });
  }

  function updatePaginacao(pageData) {
    if (
      pageData &&
      typeof pageData.number === "number" &&
      typeof pageData.totalPages === "number"
    ) {
      paginaAtualSpan.textContent = `Página ${pageData.number + 1} de ${
        pageData.totalPages
      }`;
      anteriorBtn.disabled = pageData.first || isLoading;
      proximaBtn.disabled = pageData.last || isLoading;
      if (pageData.totalElements === 0) {
        anteriorBtn.disabled = true;
        proximaBtn.disabled = true;
      }
    } else {
      paginaAtualSpan.textContent = "Página 1 de 1";
      anteriorBtn.disabled = true;
      proximaBtn.disabled = true;
    }
  }

  filtrarBtn.addEventListener("click", () => {
    if (isLoading) return;
    currentFilters.topico = topicoSelect.value;
    currentFilters.nivel = nivelSelect.value;
    currentPage = 0;
    fetchExercicios();
  });

  anteriorBtn.addEventListener("click", () => {
    if (currentPage > 0 && !isLoading) {
      currentPage--;
      fetchExercicios();
    }
  });

  proximaBtn.addEventListener("click", () => {
    if (totalPages > 0 && currentPage < totalPages - 1 && !isLoading) {
      currentPage++;
      fetchExercicios();
    }
  });

  exerciciosContainer.addEventListener("click", async (event) => {
    if (
      event.target.classList.contains("verificar-btn") ||
      event.target.closest(".verificar-btn")
    ) {
      const button = event.target.closest(".verificar-btn");
      if (button.disabled) return;
      const exercicioId = button.dataset.exercicioId;
      const form = button.closest(".exercicio-form");
      const card = button.closest(".exercicio-card");
      const feedbackContainer = card.querySelector(".feedback-container");
      const feedbackCorretoDiv =
        feedbackContainer.querySelector(".feedback.correto");
      const feedbackIncorretoDiv = feedbackContainer.querySelector(
        ".feedback.incorreto"
      );
      const selectedOption = form.querySelector(
        `input[name="ex${exercicioId}"]:checked`
      );
      if (!selectedOption) {
        alert("Por favor, selecione uma alternativa.");
        return;
      }
      const respostaUsuario = parseInt(selectedOption.value);
      button.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Verificando...`;
      button.disabled = true;
      try {
        const response = await fetch(
          `${API_BASE_URL}/${exercicioId}/verificar`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              resposta: respostaUsuario,
              usuarioId: currentUsuarioId,
            }),
          }
        );
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.feedback || `Erro HTTP: ${response.status}`
          );
        }
        const result = await response.json();
        feedbackContainer.classList.remove("hidden");
        if (result.correta) {
          feedbackCorretoDiv.innerHTML = `<div class="feedback-icon"><i class="fas fa-check-circle"></i></div><p>${
            result.feedback || "Correto!"
          }</p>`;
          feedbackCorretoDiv.classList.remove("hidden");
        } else {
          feedbackIncorretoDiv.innerHTML = `<div class="feedback-icon"><i class="fas fa-times-circle"></i></div><p>${
            result.feedback || "Incorreto."
          }</p>`;
          feedbackIncorretoDiv.classList.remove("hidden");
        }
        form
          .querySelectorAll('input[type="radio"]')
          .forEach((input) => (input.disabled = true));
        button.innerHTML = '<i class="fas fa-check-circle"></i> Verificar';
      } catch (error) {
        console.error("Erro ao verificar resposta:", error);
        button.innerHTML = '<i class="fas fa-check-circle"></i> Verificar';
        button.disabled = false;
        alert(`Erro ao verificar: ${error.message}`);
      }
    }
  });

  document.querySelectorAll(".pill").forEach((pill) => {
    pill.addEventListener("click", function () {
      document
        .querySelectorAll(".pill")
        .forEach((p) => p.classList.remove("active"));
      this.classList.add("active");
    });
  });

  await checkLoginStatusAndInitialize();
});
