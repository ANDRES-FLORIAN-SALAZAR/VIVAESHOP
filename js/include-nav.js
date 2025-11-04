// Incluir la barra de navegación en todas las páginas
document.addEventListener('DOMContentLoaded', function() {
  // Cargar la barra de navegación
  fetch('includes/nav.html')
    .then(response => response.text())
    .then(data => {
      // Insertar antes del primer elemento del body
      document.body.insertAdjacentHTML('afterbegin', data);
      
      // Inicializar el menú móvil
      const menuToggle = document.querySelector('.menu-toggle');
      const navContainer = document.querySelector('.nav-container');
      const body = document.body;
      
      // Función para alternar el menú
      function toggleMenu() {
        menuToggle.classList.toggle('active');
        navContainer.classList.toggle('active');
        body.classList.toggle('menu-open');
      }
      
      // Evento de clic en el botón de menú
      if (menuToggle) {
        menuToggle.addEventListener('click', toggleMenu);
      }
      
      // Cerrar menú al hacer clic en un enlace
      const navLinks = document.querySelectorAll('.nav-links a');
      navLinks.forEach(link => {
        link.addEventListener('click', () => {
          if (body.classList.contains('menu-open')) {
            toggleMenu();
          }
        });
      });
      
      // Cerrar menú al redimensionar la ventana (en caso de que se cambie a escritorio)
      window.addEventListener('resize', () => {
        if (window.innerWidth > 992 && body.classList.contains('menu-open')) {
          toggleMenu();
        }
      });
    })
    .catch(error => console.error('Error cargando la barra de navegación:', error));
});
