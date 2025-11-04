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
      const mainNav = document.querySelector('.main-nav');
      
      if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
          this.classList.toggle('active');
          mainNav.classList.toggle('active');
          document.body.classList.toggle('menu-open');
        });
      }
    })
    .catch(error => console.error('Error cargando la barra de navegación:', error));
});
