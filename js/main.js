// @ts-nocheck

/**
 * VIVAE - Tienda Online
 * main.js - Código principal de la aplicación VIVAE
 */

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
            return `https://wa.me/${this.WHATSAPP_NUMBER}`;
        }
    }
};

// Estado global
const state = {
    productos: []
};

// Función principal de inicialización
function init() {
    console.log('Inicializando aplicación VIVAE...');
    
    // Inicializar menú móvil
    if (typeof initMobileMenu === 'function') {
        initMobileMenu();
    }
    
    // Cargar y mostrar productos
    if (typeof cargarProductos === 'function') {
        cargarProductos().then(productos => {
            if (productos && productos.length > 0) {
                state.productos = productos;
                mostrarProductos(productos);
            } else {
                console.warn('No se cargaron productos o la lista está vacía.');
            }
        }).catch(error => {
            console.error('Error al cargar productos:', error);
        });
    }
}

/**
 * Carga los productos desde el archivo JSON
 */
async function cargarProductos() {
    try {
        const response = await fetch(CONFIG.apiUrl);
        if (!response.ok) throw new Error('Error al cargar los productos');
        const data = await response.json();
        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error('Error al cargar productos:', error);
        return [];
    }
}

/**
 * Muestra los productos en la página
 * @param {Array} productos - Lista de productos a mostrar
 */
async function mostrarProductos(productos) {
    console.log('Mostrando productos desde main.js');
    const productsGrid = document.getElementById('products-grid');
    
    // Si no hay contenedor de productos, salir silenciosamente
    if (!productsGrid) {
        console.log('No se encontró el contenedor de productos (products-grid) - Esto es normal en la página de inicio');
        return;
    }
    
    // Mostrar indicador de carga solo si el contenedor existe
    productsGrid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    if (!productos || productos.length === 0) {
        const noResults = document.getElementById('no-results');
        if (noResults) noResults.style.display = 'block';
        productsGrid.innerHTML = '';
        return;
    }
    
    // Limpiar la cuadrícula
    productsGrid.innerHTML = '';
    
    // Crear y añadir elementos de producto
    const productElements = productos.map(producto => {
        const imagenUrl = producto.imagen || producto.image || 'img/placeholder.jpg';
        const precio = producto.precio || producto.price
            ? `$${Number(producto.precio || producto.price).toLocaleString('es-CO')}`
            : 'Precio no disponible';
            
        return `
        <div class="producto" data-id="${producto.id}">
            <div class="producto-imagen">
                <img src="${imagenUrl}" alt="${producto.nombre || 'Producto'}" loading="lazy">
            </div>
            <div class="producto-info">
                <h3>${producto.nombre || 'Producto sin nombre'}</h3>
                <p class="precio">${precio}</p>
                <a href="producto.html?id=${producto.id}" class="btn-ver">Ver detalles</a>
            </div>
        </div>`;
    });

    productsGrid.innerHTML = productElements.join('');

    // Ocultar indicador de carga
    if (document.getElementById('loading')) {
        document.getElementById('loading').style.display = 'none';
    }
}

/**
 */
function manejarClickContacto(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const boton = e.currentTarget;
    const productoId = boton.dataset.id;
    
    if (!productoId) {
        console.error('No se pudo obtener el ID del producto');
        return;
    }
    
    // Buscar el producto en el estado global
    const producto = state.productos.find(p => p.id === productoId);
    
    if (!producto) {
        console.error('No se encontró el producto con ID:', productoId);
        return;
    }
    
    // Redirigir a WhatsApp para consultar sobre el producto
    const whatsappUrl = CONFIG.getWhatsAppUrl(producto.nombre);
    window.open(whatsappUrl, '_blank');
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    // Implementar lógica para mostrar mensajes de error
    console.error(mensaje);
    alert(mensaje);
}

/**
 * Inicializa el menú móvil
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!menuToggle || !mainNav) return;

    function toggleMenu() {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        mainNav.classList.toggle('active');
        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    function handleLinkClick() {
        if (window.innerWidth <= 768) {
            toggleMenu();
        }
    }

    function handleDocumentClick(e) {
        if (!menuToggle.contains(e.target) && !mainNav.contains(e.target)) {
            if (mainNav.classList.contains('active')) {
                toggleMenu();
            }
        }
    }

    function handleResize() {
        if (window.innerWidth > 768) {
            menuToggle.setAttribute('aria-expanded', 'false');
            mainNav.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    // Configurar eventos
    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu();
    });

    navLinks.forEach(link => {
        link.addEventListener('click', handleLinkClick);
    });

    document.addEventListener('click', handleDocumentClick);
    window.addEventListener('resize', handleResize);
}

// Inicializar la aplicación cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

/**
 * Configura los filtros de búsqueda
 */
function configurarFiltros() {
    const buscador = document.getElementById('buscador');
    const filtros = document.querySelectorAll('.filtro-btn');
    
    // Configurar búsqueda
    if (buscador) {
        buscador.addEventListener('input', (e) => {
            const termino = e.target.value.trim().toLowerCase();
            const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
            filtrarProductos(termino, categoriaActiva);
        });
    }
    
    // Configurar filtros de categoría
    if (filtros.length > 0) {
        filtros.forEach(filtro => {
            filtro.addEventListener('click', (e) => {
                // Remover clase active de todos los botones
                filtros.forEach(btn => btn.classList.remove('active'));
                // Agregar clase active al botón clickeado
                e.target.classList.add('active');
                // Filtrar productos por categoría
                const categoria = e.target.dataset.categoria || 'todos';
                const termino = document.getElementById('buscador')?.value.trim().toLowerCase() || '';
                filtrarProductos(termino, categoria);
            });
        });
    }
}

// Mostrar mensaje cuando no hay resultados
function mostrarMensajeSinResultados() {
    const noResults = document.getElementById('no-results');
    const productsGrid = document.getElementById('products-grid');
    
    if (noResults) noResults.style.display = 'flex';
    if (productsGrid) productsGrid.innerHTML = '';
}

// Mostrar mensaje de error
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>${mensaje}</p>
            </div>`;
        errorContainer.style.display = 'block';
    }
}

/**
 * Limpia los event listeners al cerrar la pestaña
 */
function limpiarEventListeners() {
    // Eliminar event listeners del menú móvil
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');
    
    if (menuToggle) {
        const newToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newToggle, menuToggle);
    }
    
    if (menuOverlay) {
        const newOverlay = menuOverlay.cloneNode(true);
        menuOverlay.parentNode.replaceChild(newOverlay, menuOverlay);
    }
    
    // Eliminar event listeners de los botones de contacto
    document.querySelectorAll('.btn-contactar').forEach(btn => {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);
    });
}

// Limpiar event listeners al cerrar la pestaña
window.addEventListener('beforeunload', limpiarEventListeners);
