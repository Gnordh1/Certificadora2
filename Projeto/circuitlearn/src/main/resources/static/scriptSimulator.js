document.addEventListener("DOMContentLoaded", function () {
  // --- LÓGICA DE FILTRAGEM DE DESAFIOS ---
  const filterButtons = document.querySelectorAll(".filtro-btn");
  const challengeCards = document.querySelectorAll(".desafio-card");

  if (filterButtons.length > 0 && challengeCards.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Atualiza o botão ativo
        filterButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");

        const filter = button.getAttribute("data-filter");

        // Mostra ou esconde os cards
        challengeCards.forEach((card) => {
          const cardDifficulty = card.getAttribute("data-difficulty");

          if (filter === "all" || cardDifficulty === filter) {
            card.style.display = "flex"; // Usar 'flex' como definido no CSS
          } else {
            card.style.display = "none";
          }
        });
      });
    });
  }

  // --- LÓGICA DO LOADER DO IFRAME ---
  const iframe = document.getElementById("falstad-iframe");
  const loader = document.getElementById("loader");

  if (iframe && loader) {
    iframe.addEventListener("load", () => {
      // Adiciona a classe para esconder o loader com uma transição suave
      loader.classList.add("hidden");
    });
  }

  // --- LÓGICA DE ANIMAÇÃO DE SCROLL ---
  const animatedElements = document.querySelectorAll(".animate-on-scroll");

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
});
