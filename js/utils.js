// Función para cargar la navegación
export async function cargarNavegacion() {
  try {
    const response = await fetch('includes/nav.html');
    if (!response.ok) throw new Error('No se pudo cargar la navegación');

    const navHTML = await response.text();
    document.querySelector('header').innerHTML = navHTML;

    // Configurar el menú móvil
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');
    
    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        nav.classList.toggle('active');
      });
    }

    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          nav.classList.remove('active');
        }
      });
    });
  } catch (error) {
    console.error('Error al cargar la navegación:', error);
  }
}

// Función para cargar el pie de página
export async function cargarFooter() {
  try {
    const response = await fetch('includes/footer.html');
    if (!response.ok) throw new Error('No se pudo cargar el pie de página');
    
    const footerHTML = await response.text();
    document.getElementById('footer-placeholder').innerHTML = footerHTML;
  } catch (error) {
    console.error('Error al cargar el pie de página:', error);
  }
}
