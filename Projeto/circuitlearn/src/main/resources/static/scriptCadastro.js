document.addEventListener("DOMContentLoaded", () => {
  // --- Seleção de Elementos do DOM ---
  const form = document.getElementById("cadastroForm");
  const nomeInput = document.getElementById("nome");
  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");
  const confirmarSenhaInput = document.getElementById("confirmarSenha");
  const cadastroBtn = document.getElementById("cadastro-btn");
  const cadastroErrorDiv = document.getElementById("cadastro-error");

  const toggleSenha = document.getElementById("toggleSenha");
  const toggleConfirmarSenha = document.getElementById("toggleConfirmarSenha");

  document.querySelectorAll(".input-container input").forEach((input) => {
    const container = input.closest(".input-container");

    if (input.value) {
      container.classList.add("focused");
    }

    input.addEventListener("focus", () => {
      container.classList.add("focused");
    });

    input.addEventListener("blur", () => {
      if (!input.value) {
        container.classList.remove("focused");
      }
    });
  });

  const showError = (input, message) => {
    const container = input.closest(".input-container");
    const errorSpan = container.querySelector(".field-error-message");
    errorSpan.textContent = message;
    errorSpan.classList.remove("hidden");
    input.style.borderColor = "var(--error-color)";
  };

  const hideError = (input) => {
    const container = input.closest(".input-container");
    const errorSpan = container.querySelector(".field-error-message");
    errorSpan.classList.add("hidden");
    input.style.borderColor = "var(--border-color)";
  };

  const validateNome = () => {
    if (nomeInput.value.trim() === "") {
      showError(nomeInput, "Por favor, insira seu nome.");
      return false;
    }
    hideError(nomeInput);
    return true;
  };

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value)) {
      showError(emailInput, "Formato de e-mail inválido.");
      return false;
    }
    hideError(emailInput);
    return true;
  };

  const validateSenha = () => {
    if (senhaInput.value.length < 8) {
      showError(senhaInput, "A senha deve ter no mínimo 8 caracteres.");
      return false;
    }
    hideError(senhaInput);
    return true;
  };

  const validateConfirmarSenha = () => {
    if (senhaInput.value !== confirmarSenhaInput.value) {
      showError(confirmarSenhaInput, "As senhas não coincidem.");
      return false;
    }
    if (confirmarSenhaInput.value === "") {
      hideError(confirmarSenhaInput);
      return false;
    }
    hideError(confirmarSenhaInput);
    return true;
  };

  // --- Funcionalidade de Senha (Mostrar/Ocultar) ---
  const togglePasswordVisibility = (input, toggleIcon) => {
    if (input.type === "password") {
      input.type = "text";
      toggleIcon.classList.remove("fa-eye");
      toggleIcon.classList.add("fa-eye-slash");
    } else {
      input.type = "password";
      toggleIcon.classList.remove("fa-eye-slash");
      toggleIcon.classList.add("fa-eye");
    }
  };

  toggleSenha.addEventListener("click", () =>
    togglePasswordVisibility(senhaInput, toggleSenha)
  );
  toggleConfirmarSenha.addEventListener("click", () =>
    togglePasswordVisibility(confirmarSenhaInput, toggleConfirmarSenha)
  );

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const isNomeValid = validateNome();
    const isEmailValid = validateEmail();
    const isSenhaValid = validateSenha();
    const isConfirmarSenhaValid = validateConfirmarSenha();

    if (
      !isNomeValid ||
      !isEmailValid ||
      !isSenhaValid ||
      !isConfirmarSenhaValid
    ) {
      return;
    }

    cadastroBtn.disabled = true;
    cadastroBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CRIANDO...';
    cadastroErrorDiv.classList.add("hidden");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: nomeInput.value,
          email: emailInput.value,
          password: senhaInput.value,
        }),
      });

      if (response.ok) {
        cadastroBtn.innerHTML = '<i class="fas fa-check"></i> SUCESSO!';
        cadastroBtn.style.backgroundColor = "var(--success-color)";

        setTimeout(() => {
          window.location.href = "login.html";
        }, 2000);
      } else {
        const errorData = await response.json();
        cadastroErrorDiv.textContent =
          errorData.message || "Ocorreu um erro. Tente novamente.";
        cadastroErrorDiv.classList.remove("hidden");

        cadastroBtn.disabled = false;
        cadastroBtn.textContent = "CRIAR CONTA";
      }
    } catch (error) {
      console.error("Falha na requisição de cadastro:", error);
      cadastroErrorDiv.textContent =
        "Erro de conexão. Verifique sua rede e tente novamente.";
      cadastroErrorDiv.classList.remove("hidden");

      cadastroBtn.disabled = false;
      cadastroBtn.textContent = "CRIAR CONTA";
    }
  });

  // Adiciona listeners para validação em tempo real ao sair do campo
  nomeInput.addEventListener("blur", validateNome);
  emailInput.addEventListener("blur", validateEmail);
  senhaInput.addEventListener("blur", validateSenha);
  confirmarSenhaInput.addEventListener("blur", validateConfirmarSenha);
});
