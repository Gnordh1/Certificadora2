document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção dos Elementos da Navbar ---
  const menuToggle = document.querySelector(".menu-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const loginNavLink = document.getElementById("login-nav-link");
  const userInfoNav = document.getElementById("user-info-nav");
  const userDisplayName = document.getElementById("user-display-name");
  const userAvatarImg = document.getElementById("user-avatar-img");
  const logoutBtn = document.getElementById("logout-btn");
  const userDropdown = document.querySelector(".user-dropdown");
  const userDropdownToggle = document.querySelector(".user-dropdown-toggle");

  if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      navMenu.classList.toggle("active");
    });
  }

  // --- Lógica do Dropdown de Usuário ---
  if (userDropdownToggle && userDropdown) {
    userDropdownToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const isExpanded =
        userDropdownToggle.getAttribute("aria-expanded") === "true";
      userDropdownToggle.setAttribute("aria-expanded", !isExpanded);
      userDropdown.classList.toggle("active");
    });
  }

  // Fecha o dropdown se clicar fora dele
  window.addEventListener("click", (event) => {
    if (userDropdown && userDropdown.classList.contains("active")) {
      if (!userDropdown.contains(event.target)) {
        userDropdown.classList.remove("active");
        userDropdownToggle.setAttribute("aria-expanded", "false");
      }
    }
  });

  // --- Lógica de Logout ---
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

  // --- Verificação de Autenticação e Atualização da UI ---
  async function checkLoginStatus() {
    try {
      const response = await fetch("/api/auth/user");

      if (response.ok) {
        const usuario = await response.json();

        if (loginNavLink) loginNavLink.style.display = "none";
        if (userInfoNav) userInfoNav.style.display = "block";
        if (userDisplayName)
          userDisplayName.textContent = `Olá, ${usuario.nome || usuario.email}`;
        if (userAvatarImg)
          userAvatarImg.src = usuario.avatarUrl || "assets/icon-3d.jpg";
      } else {
        if (loginNavLink) loginNavLink.style.display = "list-item";
        if (userInfoNav) userInfoNav.style.display = "none";
      }
    } catch (error) {
      console.error("Erro ao verificar status de autenticação:", error);
      if (loginNavLink) loginNavLink.style.display = "list-item";
      if (userInfoNav) userInfoNav.style.display = "none";
    }
  }

  // Executa a verificação de login assim que a página carregar
  checkLoginStatus();

  // Seleciona os elementos específicos da página de teoria
  const topicosLinks = document.querySelectorAll("#topicos-lista a");
  const topicosConteudo = document.querySelectorAll(".topico-conteudo");
  const filtrosBtns = document.querySelectorAll(".filtro-btn");
  const calcularCorrenteBtn = document.getElementById("calcular-corrente");
  const searchInput = document.getElementById("search-teoria");
  const searchButton = document.getElementById("search-button");

  // Função para mostrar apenas o tópico ativo
  function mostrarTopicoAtivo() {
    topicosConteudo.forEach((conteudo) => {
      conteudo.style.display = "none";
    });

    // Encontra o link ativo e mostra o tópico correspondente
    const linkAtivo = document.querySelector("#topicos-lista a.active");
    if (linkAtivo) {
      const topicoId = linkAtivo.getAttribute("href").substring(1);
      const topicoParaMostrar = document.getElementById(topicoId);
      if (topicoParaMostrar) {
        topicoParaMostrar.style.display = "block";
      }
    } else if (topicosConteudo.length > 0) {
      // Se nenhum estiver ativo, mostra o primeiro por padrão
      topicosConteudo[0].style.display = "block";
    }
  }

  // --- Lógica de Navegação de Tópicos ---
  if (topicosLinks.length > 0 && topicosConteudo.length > 0) {
    topicosLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();

        topicosLinks.forEach((l) => l.classList.remove("active"));

        this.classList.add("active");

        mostrarTopicoAtivo();
      });
    });

    mostrarTopicoAtivo();
  }

  // --- Lógica de Filtros de Dificuldade ---
  if (filtrosBtns.length > 0 && topicosConteudo.length > 0) {
    filtrosBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        // Atualiza o botão ativo
        filtrosBtns.forEach((b) => b.classList.remove("active"));
        this.classList.add("active");

        const nivel = this.getAttribute("data-nivel");

        // Filtra os conteúdos visíveis
        topicosConteudo.forEach((conteudo) => {
          const nivelConteudo = conteudo.getAttribute("data-nivel");
          const isVisivel = nivel === "todos" || nivelConteudo === nivel;
          conteudo.style.display = isVisivel ? "block" : "none";
        });

        // Após filtrar, reativa o primeiro link e tópico visível se nenhum for
        const primeiroTopicoVisivel = document.querySelector(
          '.topico-conteudo[style*="display: block"]'
        );
        if (primeiroTopicoVisivel) {
          topicosLinks.forEach((l) => l.classList.remove("active"));
          const linkCorrespondente = document.querySelector(
            `#topicos-lista a[href="#${primeiroTopicoVisivel.id}"]`
          );
          if (linkCorrespondente) linkCorrespondente.classList.add("active");
        }
      });
    });
  }

  // --- Lógica da Calculadora da Lei de Ohm ---
  if (calcularCorrenteBtn) {
    calcularCorrenteBtn.addEventListener("click", function () {
      const tensao = parseFloat(document.getElementById("tensao").value);
      const resistencia = parseFloat(
        document.getElementById("resistencia").value
      );

      if (!isNaN(tensao) && !isNaN(resistencia) && resistencia > 0) {
        const corrente = tensao / resistencia;
        document.getElementById("resultado-corrente").textContent =
          corrente.toFixed(3);
      } else {
        document.getElementById("resultado-corrente").textContent = "Erro";
        alert(
          "Por favor, insira valores numéricos válidos. A resistência não pode ser zero."
        );
      }
    });
  }

  // --- Lógica da Pesquisa de Tópicos ---
  function buscarTopicos(termo) {
    termo = termo.toLowerCase().trim();
    if (!termo) return;

    let encontrado = false;
    topicosConteudo.forEach((conteudo) => {
      const texto = conteudo.textContent.toLowerCase();

      if (texto.includes(termo)) {
        conteudo.style.display = "block";
        encontrado = true;
      } else {
        conteudo.style.display = "none";
      }
    });

    if (!encontrado) {
      alert("Nenhum tópico encontrado com o termo: " + termo);
    }
  }

  if (searchButton && searchInput) {
    searchButton.addEventListener("click", () =>
      buscarTopicos(searchInput.value)
    );
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        buscarTopicos(searchInput.value);
      }
    });
  }
});
