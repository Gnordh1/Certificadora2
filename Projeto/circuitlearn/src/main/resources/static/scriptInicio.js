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
});
