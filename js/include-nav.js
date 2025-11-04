// Incluir la barra de navegación en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
  // Cargar la barra de navegación
  fetch('includes/nav.html')
    .then(response => response.text())
    .then(data => {
      // Insertar antes del primer elemento del body
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = data;
      const navElement = tempDiv.querySelector('header');
      document.body.insertBefore(navElement, document.body.firstChild);
      
      // Inicializar el menú móvil
      const menuToggle = document.getElementById('menuToggle');
      const mainNav = document.getElementById('mainNav');
      const body = document.body;
      
      // Función para alternar el menú
      function toggleMenu() {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Bloquear el desplazamiento cuando el menú está abierto
        if (body.classList.contains('menu-open')) {
          body.style.overflow = 'hidden';
        } else {
          body.style.overflow = '';
        }
      }
      
      // Evento de clic en el botón de menú
      if (menuToggle) {
        menuToggle.addEventListener('click', function(e) {
          e.stopPropagation();
          toggleMenu();
        });
      }
      
      // Cerrar menú al hacer clic fuera del menú
      document.addEventListener('click', function(e) {
        if (body.classList.contains('menu-open') && 
            !e.target.closest('.main-nav') && 
            !e.target.closest('.menu-toggle')) {
          toggleMenu();
        }
      });
      
      // Cerrar menú al hacer clic en un enlace
      const navLinks = document.querySelectorAll('.nav-link');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (body.classList.contains('menu-open')) {
            toggleMenu();
          }
        });
      });
      
      // Cerrar menú al redimensionar la ventana (en caso de que se cambie a escritorio)
      let resizeTimer;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (window.innerWidth > 992) {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            body.classList.remove('menu-open');
            body.style.overflow = '';
          }
        }, 250);
      });
      
      // Inicializar el estado del menú
      if (window.innerWidth <= 992) {
        mainNav.style.transition = 'transform 0.3s ease-in-out';
      }
    })
    .catch(error => console.error('Error cargando la barra de navegación:', error));
});
