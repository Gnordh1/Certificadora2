document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('senha');
    const loginErrorDiv = document.getElementById('login-error');
    const loginButton = document.getElementById('login-btn');

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Feedback visual para o usuário
        loginErrorDiv.classList.add('hidden');
        loginButton.disabled = true;
        loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ENTRANDO...'; // Bônus: ícone de carregamento

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // O endpoint de login deve retornar 200 OK e SETAR O COOKIE DE SESSÃO no cabeçalho da resposta
            const response = await fetch('/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                // SUCESSO! O cookie de sessão foi setado pelo servidor.
                // O trabalho do front-end é apenas redirecionar.
                window.location.href = 'exercicios.html';
            } else {
                // Se a resposta não for OK (ex: erro 401, 400)
                const errorText = await response.text();
                loginErrorDiv.textContent = errorText || 'Credenciais inválidas. Tente novamente.';
                loginErrorDiv.classList.remove('hidden');

                // Restaura o botão em caso de erro
                loginButton.disabled = false;
                loginButton.textContent = 'LOGIN';
            }
        } catch (error) {
            console.error('Falha na requisição de login:', error);
            loginErrorDiv.textContent = 'Erro de conexão. Verifique sua rede e tente novamente.';
            loginErrorDiv.classList.remove('hidden');

            // Restaura o botão em caso de erro de conexão
            loginButton.disabled = false;
            loginButton.textContent = 'LOGIN';
        }
    });
});