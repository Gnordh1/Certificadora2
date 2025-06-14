document.addEventListener("DOMContentLoaded", function() {

  // --- LÓGICA DE MODO ESCURO (DARK MODE) ---
  const themeToggle = document.getElementById('theme-toggle');
  const currentTheme = localStorage.getItem('theme');
  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      let theme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
    });
  }

  // --- EFEITO AURA NOS CARDS ---
  const cards = document.querySelectorAll('.desafio-card, .opcao-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // --- LÓGICA DE FILTRAGEM DE DESAFIOS ---
  const filterButtons = document.querySelectorAll('.filtro-btn');
  const challengeCards = document.querySelectorAll('.desafio-card');
  if (filterButtons.length > 0 && challengeCards.length > 0) {
      filterButtons.forEach(button => {
        button.addEventListener('click', () => {
          filterButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          const filter = button.getAttribute('data-filter');
          challengeCards.forEach(card => {
            card.style.display = 'none';
            if (filter === 'all' || card.getAttribute('data-difficulty') === filter) {
              card.style.display = 'flex'; 
            }
          });
        });
      });
  }
  
  // --- LÓGICA DO LOADER ---
  const iframe = document.getElementById('falstad-iframe');
  const loader = document.getElementById('loader');
  if (iframe && loader) {
    iframe.addEventListener('load', () => {
      loader.classList.add('loader-hidden');
    });
  }

  // --- LÓGICA DE ANIMAÇÃO DE SCROLL ---
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });
    animatedElements.forEach(el => observer.observe(el));
  }
});