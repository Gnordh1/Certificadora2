document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("senha");
  const loginErrorDiv = document.getElementById("login-error");
  const loginButton = document.getElementById("login-btn");

  if (!loginForm) {
    return;
  }

  loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Feedback visual para o usuário
    loginErrorDiv.classList.add("hidden");
    loginButton.disabled = true;
    loginButton.innerHTML =
      '<i class="fas fa-spinner fa-spin"></i> ENTRANDO...';

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        window.location.href = "inicio.html";
      } else {
        const errorText = await response.text();
        loginErrorDiv.textContent =
          errorText || "Credenciais inválidas. Tente novamente.";
        loginErrorDiv.classList.remove("hidden");

        loginButton.disabled = false;
        loginButton.textContent = "LOGIN";
      }
    } catch (error) {
      console.error("Falha na requisição de login:", error);
      loginErrorDiv.textContent =
        "Erro de conexão. Verifique sua rede e tente novamente.";
      loginErrorDiv.classList.remove("hidden");

      loginButton.disabled = false;
      loginButton.textContent = "LOGIN";
    }
  });
});
