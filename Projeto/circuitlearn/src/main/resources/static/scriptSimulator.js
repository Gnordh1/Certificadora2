document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE NAVEGAÇÃO E AUTENTICAÇÃO ---
  function setupAuthAndNavUI() {
    const loginNavLink = document.getElementById("login-nav-link");
    const userInfoNav = document.getElementById("user-info-nav");
    const userDisplayNameSpan = document.getElementById("user-display-name");
    const userAvatarImg = document.getElementById("user-avatar-img");
    const logoutBtn = document.getElementById("logout-btn");
    const userDropdown = document.querySelector(".user-dropdown");
    const userDropdownToggle = document.querySelector(".user-dropdown-toggle");
    const menuToggle = document.querySelector(".menu-toggle");
    const navMenu = document.querySelector(".nav-menu");

    // Lógica do Menu Mobile
    if (menuToggle && navMenu) {
      menuToggle.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        menuToggle.setAttribute(
          "aria-expanded",
          navMenu.classList.contains("active")
        );
      });
    }

    // Lógica do Dropdown de Usuário
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
    window.addEventListener("click", () => {
      if (userDropdown && userDropdown.classList.contains("active")) {
        userDropdown.classList.remove("active");
        userDropdownToggle.setAttribute("aria-expanded", "false");
      }
    });

    // Lógica de Logout
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
        }
      });
    }

    // Verifica o Status de Login
    fetch("/api/auth/user")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        return null;
      })
      .then((usuario) => {
        if (usuario) {
          // Logado
          if (userDisplayNameSpan)
            userDisplayNameSpan.textContent = `Olá, ${
              usuario.nome || usuario.email
            }`;
          if (userAvatarImg)
            userAvatarImg.src = usuario.avatarUrl || "assets/icon-3d.jpg";
          if (userInfoNav) userInfoNav.style.display = "block";
          if (loginNavLink) loginNavLink.style.display = "none";
        } else {
          // Não logado
          if (userInfoNav) userInfoNav.style.display = "none";
          if (loginNavLink) loginNavLink.style.display = "list-item";
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar status de autenticação:", error);
        if (userInfoNav) userInfoNav.style.display = "none";
        if (loginNavLink) loginNavLink.style.display = "list-item";
      });
  }

  const filterButtons = document.querySelectorAll(".filtro-btn");
  const challengeCards = document.querySelectorAll(".desafio-card");
  const iframe = document.getElementById("falstad-iframe");
  const loader = document.getElementById("loader");
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

  if (filterButtons.length > 0 && challengeCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        const filter = button.getAttribute("data-filter");
        challengeCards.forEach((card) => {
          const cardDifficulty = card.getAttribute("data-difficulty");
          card.style.display =
            filter === "all" || cardDifficulty === filter ? "flex" : "none";
        });
      });
    });
  }

  if (iframe && loader) {
    iframe.addEventListener("load", () => {
      loader.classList.add("hidden");
    });
  }

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    animatedElements.forEach((el) => observer.observe(el));
  }

  setupAuthAndNavUI();
});
