// utils.js - Funciones compartidas para la aplicación VIVAE

// Configuración global
const CONFIG = {
    apiUrl: 'data/productos.json',
    WHATSAPP_NUMBER: '573175535562',
    getWhatsAppUrl: function(productName = '') {
        try {
            const message = encodeURIComponent(
                `¡Hola! Estoy interesado en ${productName ? 'el producto: ' + productName : 'tus productos'}. ` +
                '¿Podrías brindarme más información por favor?'
            );
            return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
        } catch (error) {
            console.error('Error al generar la URL de WhatsApp:', error);
            return `https://wa.me/${this.WHAPP_NUMBER}`;
        }
    }
};

// Estado global
const state = {
    productos: []
};

/**
 * Carga el contenido de un archivo HTML y lo inserta en el elemento especificado
 * @param {string} url - URL del archivo a cargar
 * @param {string} targetId - ID del elemento donde se insertará el contenido
 * @param {Function} [callback] - Función a ejecutar después de cargar el contenido
 */
async function loadHTML(url, targetId, callback) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`No se pudo cargar: ${url}`);
        
        const html = await response.text();
        const target = document.getElementById(targetId);
        if (target) {
            target.innerHTML = html;
            if (typeof callback === 'function') {
                callback();
            }
        }
    } catch (error) {
        console.error(`Error al cargar ${url}:`, error);
    }
}

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    const menuOverlay = document.getElementById('menuOverlay');
    let menuOpen = false;
    
    if (!menuToggle || !mainNav) return;

    // Función para abrir el menú
    function openMenu() {
        menuToggle.setAttribute('aria-expanded', 'true');
        mainNav.classList.add('active');
        if (menuOverlay) menuOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        menuOpen = true;
        
        // Enfocar el primer enlace del menú cuando se abre
        const firstLink = mainNav.querySelector('a');
        if (firstLink) {
            firstLink.focus();
        }
        
        // Agregar event listener para atrapar el foco dentro del menú
        mainNav.addEventListener('keydown', trapFocus);
    }
    
    // Función para cerrar el menú
    function closeMenu() {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
        if (menuOverlay) menuOverlay.classList.remove('active');
        document.body.style.overflow = '';
        menuOpen = false;
        
        // Enfocar el botón del menú al cerrar
        menuToggle.focus();
        
        // Remover el event listener de atrapado de foco
        mainNav.removeEventListener('keydown', trapFocus);
    }
    
    // Función para atrapar el foco dentro del menú
    function trapFocus(e) {
        if (e.key === 'Tab') {
            const focusableElements = Array.from(mainNav.querySelectorAll('a, button, [tabindex="0"]'));
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        } else if (e.key === 'Escape') {
            closeMenu();
        }
    }
    
    // Función para alternar el menú
    function toggleMenu() {
        if (menuOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    }
    
    // Event listeners
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });
    
    if (menuOverlay) {
        menuOverlay.addEventListener('click', closeMenu);
    }
    
    // Cerrar menú al hacer clic en un enlace
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });
    
    // Cerrar menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && menuOpen) {
            closeMenu();
        }
    });
    
    // Manejar el teclado para accesibilidad
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        } else if (e.key === 'Escape' && menuOpen) {
            closeMenu();
        }
    });
}

/**
 * Carga la navegación en el elemento con id 'navbar-placeholder'
 */
async function cargarNavegacion() {
    await loadHTML('includes/nav.html', 'navbar-placeholder', () => {
        // Inicializar el menú móvil después de cargar la navegación
        initMobileMenu();
    });
}

/**
 * Carga el pie de página en el elemento con id 'footer-placeholder'
 */
export async function cargarFooter() {
  try {
    const response = await fetch('includes/footer.html');
    if (!response.ok) throw new Error('No se pudo cargar el pie de página');
    
    const html = await response.text();
    const footer = document.getElementById('footer-placeholder');
    if (footer) footer.innerHTML = html;
  } catch (error) {
    console.error('Error al cargar el pie de página:', error);
  }
}

// Exportar funciones para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        state,
        loadHTML,
        initMobileMenu,
        cargarNavegacion,
        cargarFooter
    };
}
