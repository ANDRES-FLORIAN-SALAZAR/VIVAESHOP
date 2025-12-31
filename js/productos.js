/**
 * productos.js - Manejo de la página de productos de VIVAE
 */

// Verificar si ya hay una función mostrarProductos definida
if (typeof window.mostrarProductosVIVAE === 'undefined') {
    // Mover la función mostrarProductos al ámbito global con un nombre único
    window.mostrarProductosVIVAE = mostrarProductos;
}

// Función para verificar si el DOM está listo
function domReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        callback();
    }
}

// Inicializar la página de productos cuando el DOM esté listo
domReady(function() {
    console.log('DOM completamente cargado, inicializando productos...');
    
    // Verificar si ya se inicializó
    if (window.productosInicializados) {
        console.log('La página de productos ya fue inicializada');
        return;
    }
    
    // Marcar como inicializado
    window.productosInicializados = true;
    
    // Verificar si estamos en la página de productos
    if (!document.body.classList.contains('pagina-productos') && 
        !window.location.pathname.includes('productos.html')) {
        return;
    }

    // Inicializar la página de productos
    initProductosPage();
    
    // Configurar eventos de los botones de contacto
    document.addEventListener('click', function(e) {
        const btnContactar = e.target.closest('.btn-contactar');
        if (btnContactar) {
            e.preventDefault();
            const productoId = btnContactar.dataset.id;
            if (productoId && window.vivae && typeof window.vivae.manejarContacto === 'function') {
                window.vivae.manejarContacto(productoId);
            } else if (btnContactar.href && btnContactar.href.includes('whatsapp')) {
                // Si ya tiene un enlace a WhatsApp, permitir la navegación normal
                return true;
            }
        }
    });
});

/**
 * Inicializa la página de productos
 */
async function initProductosPage() {
    try {
        // Verificar si ya hay productos cargados (por main.js)
        if (window.vivae && window.vivae.state && window.vivae.state.productos && window.vivae.state.productos.length > 0) {
            console.log('Usando productos cargados desde main.js');
            // Configurar eventos de filtrado
            configurarFiltros();
            return;
        }
        
        // Si no hay productos cargados, cargarlos aquí
        console.log('Cargando productos desde productos.js');
        
        // Mostrar estado de carga
        const loading = document.getElementById('loading');
        const errorContainer = document.getElementById('error-container');
        const productsGrid = document.getElementById('products-grid');
        
        if (loading) loading.style.display = 'flex';
        if (errorContainer) errorContainer.style.display = 'none';
        if (productsGrid) productsGrid.innerHTML = '';

        // Cargar productos
        const productos = await cargarProductos();
        
        if (productos && productos.length > 0) {
            // Mostrar productos
            mostrarProductos(productos);
            
            // Configurar eventos de filtrado
            configurarFiltros();
        } else {
            mostrarMensajeSinResultados();
        }
    } catch (error) {
        console.error('Error al inicializar la página de productos:', error);
        mostrarError('No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }
}

/**
 * Carga los productos desde el archivo JSON
 */
async function cargarProductos() {
    try {
        console.log('Cargando productos desde el archivo JSON...');
        const response = await fetch('data/productos.json');
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Validar que los datos sean un array
        if (!Array.isArray(data)) {
            console.error('Los datos recibidos no son un array:', data);
            throw new Error('Formato de datos inválido');
        }
        
        // Mapear los productos exactamente como están en el JSON
        const productos = data.map((producto, index) => ({
            id: String(producto.id || `prod-${index}`).trim(),
            nombre: (producto.name || producto.nombre || 'Producto sin nombre').trim(),
            precio: producto.price || producto.precio ? Number(producto.price || producto.precio) : 0,
            imagen: producto.image || producto.imagen || 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MDAiIGhlaWdodD0iNDAwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2RkZGRkZCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxyZWN0IHg9IjMiIHk9IjMiIHdpZHRoPSIxOCIgaGVpZ2h0PSIxOCIgcng9IjIiIHJ5PSIyIj48L3JlY3Q+PGNpcmNsZSBjeD0iOC41IiBjeT0iOC41IiByPSIxLjUiPjwvY2lyY2xlPjxwb2x5bGluZSBwb2ludHM9IjIxIDE1IDE2IDEwIDUgMjEiPjwvcG9seWxpbmU+PC9zdmc+',
            descripcion: (producto.description || producto.descripcion || '').trim(),
            categoria: (producto.category || producto.categoria || 'sin-categoria').toString().toLowerCase().trim(),
            __index: index, // Mantener el índice original
            ...producto // Mantener propiedades adicionales
        }));
        
        console.log(`Se cargaron ${productos.length} productos exactamente como están en el JSON`);
        
        return productos;
        
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarError('No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.');
        return [];
    }
}

/**
 * Muestra los productos en la cuadrícula
 */
async function mostrarProductos(productos) {
    console.log('Mostrando productos desde productos.js');
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (!productsGrid) {
        console.error('Error: No se encontró el contenedor de productos (products-grid)');
        return;
    }
    
    // Mostrar indicador de carga
    productsGrid.innerHTML = '<div class="loading">Cargando productos...</div>';
    
    if (!productos || productos.length === 0) {
        if (noResults) noResults.style.display = 'block';
        productsGrid.innerHTML = '';
        return;
    }
    
    // Limpiar la cuadrícula
    productsGrid.innerHTML = '';
    
    // Función para verificar si una imagen existe
    const verificarImagen = (url) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    };

    // Función para obtener la ruta de la imagen con manejo de errores
    const obtenerRutaImagen = async (ruta) => {
        if (!ruta) return null;
        
        // Si ya es una URL de datos, devolverla tal cual
        if (ruta.startsWith('data:')) return ruta;
        
        let rutaFinal = ruta;
        
        // Si es una ruta relativa que no empieza con 'img/', añadir 'img/'
        if (!ruta.startsWith('http') && !ruta.startsWith('/') && !ruta.startsWith('img/')) {
            rutaFinal = `img/${ruta}`;
        }
        
        // Verificar si la imagen existe
        const existe = await verificarImagen(rutaFinal);
        
        // Si la imagen no existe, usar un placeholder
        if (!existe) {
            // Intentar con minúsculas
            const rutaMinusculas = rutaFinal.toLowerCase();
            const existeMinusculas = await verificarImagen(rutaMinusculas);
            
            if (existeMinusculas) {
                return rutaMinusculas;
            }
            
            // Mantener el orden original del array
            return 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
        }
        
        return rutaFinal;
    };
    
    // Usar una imagen transparente 1x1 como fallback
    const transparentPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    
    // Crear elementos para cada producto
    for (const producto of productos) {
        const productCard = document.createElement('div');
        productCard.className = 'producto-card';
        
        // Formatear el precio
        const precio = producto.price ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(producto.price) : 'Precio no disponible';
        
        try {
            // Obtener la URL de la imagen de forma asíncrona
            const imagenUrl = await obtenerRutaImagen(producto.image) || transparentPixel;
            
            // Construir el HTML del producto
            productCard.innerHTML = `
                <div class="producto-imagen">
                    <img src="${imagenUrl}" alt="${producto.name || 'Producto'}" loading="lazy" 
                         onerror="this.onerror=null; this.src='${transparentPixel}'">
                    ${producto.featured ? '<div class="producto-destacado">Destacado</div>' : ''}
                    <div class="producto-acciones">
                        <a href="${CONFIG.getWhatsAppUrl(producto.nombre || '')}" class="btn-contactar" target="_blank" rel="noopener noreferrer" data-id="${producto.id}" aria-label="Contactar por WhatsApp">
                            <i class="fab fa-whatsapp"></i> Contactar
                        </a>
                        <a href="/producto-detalle.html?id=${producto.id}" class="btn-ver-detalle" data-id="${producto.id}" aria-label="Ver detalles">
                            <i class="fas fa-eye"></i> Ver detalles
                        </a>
                    </div>
                </div>
                <div class="producto-info">
                    <h3 class="producto-nombre">${producto.name || 'Producto sin nombre'}</h3>
                    <p class="producto-precio">${precio}</p>
                    ${producto.category ? `<span class="producto-categoria">${producto.category}</span>` : ''}
                    <p class="producto-descripcion">${producto.description || 'Sin descripción disponible'}</p>
                    <div class="producto-detalles">
                        ${producto.sizes && producto.sizes.length > 0 ? 
                          `<div class="producto-talla">
                              <i class="fas fa-ruler"></i> Tallas: ${producto.sizes.join(', ')}
                          </div>` : ''}
                        ${producto.colors && producto.colors.length > 0 ? 
                          `<div class="producto-color">
                              <i class="fas fa-palette"></i> Colores: ${producto.colors.join(', ')}
                          </div>` : ''}
                    </div>
                </div>
            `;
            
            productsGrid.appendChild(productCard);
        } catch (error) {
            console.error('Error al cargar la imagen del producto:', producto.id, error);
            // Continuar con el siguiente producto si hay un error
            continue;
        }
    }
    
    // Ocultar mensaje de sin resultados si está visible
    if (noResults) noResults.style.display = 'none';
    
    // Inicializar eventos de los botones
    inicializarEventosProductos();
}

/**
 * Configura los filtros de búsqueda y categorías
 */
function configurarFiltros() {
    const buscador = document.getElementById('buscador');
    const botonesCategoria = document.querySelectorAll('.filtro-btn');
    
    // Eliminar manejadores de eventos anteriores si existen
    if (buscador && buscadorHandler) {
        buscador.removeEventListener('input', buscadorHandler);
    }
    
    // Eliminar manejadores de botones de categoría anteriores
    botonesCategoriaHandlers.forEach(({boton, handler}) => {
        boton.removeEventListener('click', handler);
    });
    botonesCategoriaHandlers = [];
    
    // Filtrar al escribir en el buscador
    if (buscador) {
        // Eliminar el manejador anterior si existe
        if (buscadorHandler) {
            buscador.removeEventListener('input', buscadorHandler);
        }
        
        // Crear un nuevo manejador con debounce para mejorar el rendimiento
        let timeoutId;
        buscadorHandler = (e) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                const termino = e.target.value.trim().toLowerCase();
                const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
                console.log('Búsqueda activada. Término:', termino, 'Categoría:', categoriaActiva);
                filtrarProductos(termino, categoriaActiva);
            }, 300); // 300ms de retraso
        };
        
        // Agregar el evento de búsqueda
        buscador.addEventListener('input', buscadorHandler);
        
        // Permitir búsqueda al presionar Enter
        buscador.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const termino = e.target.value.trim().toLowerCase();
                const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
                console.log('Búsqueda con Enter. Término:', termino, 'Categoría:', categoriaActiva);
                filtrarProductos(termino, categoriaActiva);
            }
        });
    }
    
    // Filtrar por categoría
    botonesCategoria.forEach(boton => {
        const handler = (e) => {
            e.preventDefault();
            
            // Actualizar botón activo
            botonesCategoria.forEach(btn => btn.classList.remove('active'));
            boton.classList.add('active');
            
            const categoria = boton.dataset.categoria || 'todos';
            const termino = buscador ? buscador.value.trim().toLowerCase() : '';
            
            filtrarProductos(termino, categoria);
        };
        
        boton.addEventListener('click', handler);
        botonesCategoriaHandlers.push({boton, handler});
    });
}

/**
 * Filtra los productos según el término de búsqueda y la categoría
 */
async function filtrarProductos(termino = '', categoria = 'todos') {
    try {
        const loading = document.getElementById('loading');
        const productsGrid = document.getElementById('products-grid');
        const noResults = document.getElementById('no-results');
        
        if (loading) loading.style.display = 'flex';
        if (productsGrid) productsGrid.innerHTML = '';
        if (noResults) noResults.style.display = 'none';
        
        // Cargar productos (usará la caché si está disponible)
        let productos = await cargarProductos();
        
        if (!productos || productos.length === 0) {
            mostrarMensajeSinResultados();
            return;
        }
        
        console.log('Filtrando productos. Total cargados:', productos.length);
        console.log('Filtrando productos con término:', termino, 'y categoría:', categoria);
        
        // Normalizar términos de búsqueda
        const terminoBusqueda = termino ? termino.toString().toLowerCase().trim() : '';
        const categoriaFiltro = categoria ? categoria.toString().toLowerCase().trim() : 'todos';
        
        // Filtrar productos
        const productosFiltrados = productos.filter(producto => {
            // Normalizar datos del producto
            const nombre = (producto.name || producto.nombre || '').toString().toLowerCase().trim();
            const descripcion = (producto.description || producto.descripcion || '').toString().toLowerCase().trim();
            const categoria = (producto.category || producto.categoria || '').toString().toLowerCase().trim();
            
            // Filtrar por categoría primero (más eficiente)
            const coincideCategoria = 
                categoriaFiltro === 'todos' || 
                categoria === categoriaFiltro;
            
            // Si la categoría no coincide, no es necesario verificar el término de búsqueda
            if (!coincideCategoria) return false;
            
            // Si no hay término de búsqueda, devolver true si coincide la categoría
            if (!terminoBusqueda) return true;
            
            // Filtrar por término de búsqueda
            const terminosBusqueda = terminoBusqueda.split(' ').filter(t => t.length > 0);
            
            // Verificar si todos los términos de búsqueda están presentes en algún campo
            return terminosBusqueda.every(termino => 
                (nombre && nombre.includes(termino)) ||
                (descripcion && descripcion.includes(termino)) ||
                (categoria && categoria.includes(termino))
            );
        });
        
        console.log('Productos encontrados:', productosFiltrados.length);
        
        // Mostrar resultados
        console.log('Productos después de filtrar:', productosFiltrados);
        if (productosFiltrados.length > 0) {
            // Mostrar el contador de resultados
            const contadorResultados = document.getElementById('contador-resultados');
            if (contadorResultados) {
                contadorResultados.textContent = `${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}`;
                contadorResultados.style.display = 'block';
            }
            
            // Usar la versión segura de mostrarProductos
            const mostrarFn = window.mostrarProductosVIVAE || mostrarProductos;
            if (typeof mostrarFn === 'function') {
                mostrarFn(productosFiltrados);
            } else {
                console.error('No se encontró una función válida para mostrar productos');
                // Intentar con la función de main.js si está disponible
                if (window.vivae && typeof window.vivae.mostrarProductos === 'function') {
                    window.vivae.mostrarProductos(productosFiltrados);
                } else {
                    console.error('No se pudo mostrar los productos: función no encontrada');
                    // Mostrar un mensaje de error al usuario
                    const productsGrid = document.getElementById('products-grid');
                    if (productsGrid) {
                        productsGrid.innerHTML = `
                            <div class="error-message">
                                <p>Error al cargar los productos. Por favor, recarga la página.</p>
                            </div>
                        `;
                    }
                }
            }
        } else {
            console.log('No se encontraron productos que coincidan con los criterios de búsqueda');
            mostrarMensajeSinResultados();
        }
        
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        mostrarError('Ocurrió un error al filtrar los productos. Por favor, inténtalo de nuevo.');
    } finally {
        const loading = document.getElementById('loading');
        if (loading) loading.style.display = 'none';
    }
}

/**
 * Muestra un mensaje cuando no hay resultados
 */
function mostrarMensajeSinResultados() {
    const productsGrid = document.getElementById('products-grid');
    const noResults = document.getElementById('no-results');
    
    if (productsGrid) productsGrid.innerHTML = '';
    if (noResults) noResults.style.display = 'flex';
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        const mensajeElement = errorContainer.querySelector('p');
        if (mensajeElement) mensajeElement.textContent = mensaje;
        errorContainer.style.display = 'flex';
    }
}

/**
 * Inicializa los eventos de los botones de los productos
 */
function inicializarEventosProductos() {
    // Evento para los botones de contacto
    document.querySelectorAll('.btn-contactar').forEach(boton => {
        boton.addEventListener('click', (e) => {
            e.preventDefault();
            const productoId = boton.dataset.id;
            if (window.vivae && typeof window.vivae.manejarContacto === 'function') {
                window.vivae.manejarContacto(productoId);
            } else if (boton.href && boton.href.includes('whatsapp')) {
                // Si ya tiene un enlace a WhatsApp, permitir la navegación normal
                return true;
            }
        });
    });

    // Evento para los botones de ver detalles
    document.querySelectorAll('.btn-ver-detalle').forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Obtener el ID del producto del atributo data-id
            const productoId = boton.dataset.id;
            console.log('Ver detalles del producto:', productoId);
            // La navegación se maneja con el href del enlace
            // No es necesario preventDefault() ya que queremos que el enlace funcione normalmente
        });
    });
}

// Variables globales
let isInitialized = false;
let buscadorHandler = null;
let botonesCategoriaHandlers = [];

// Hacer las funciones disponibles globalmente si es necesario
window.vivae = window.vivae || {};
window.vivae.productos = {
    init: async function() {
        // Prevenir múltiples inicializaciones
        if (isInitialized) return;
        isInitialized = true;
        
        try {
            await initProductosPage();
        } catch (error) {
            console.error('Error al inicializar la página de productos:', error);
            mostrarError('Ocurrió un error al cargar la página de productos.');
        }
    },
    cargarProductos,
    mostrarProductos,
    filtrarProductos,
    manejarContacto: function(productoId) {
        const producto = this.state?.productos?.find(p => p.id == productoId);
        if (producto) {
            const url = CONFIG.getWhatsAppUrl(producto.nombre || '');
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    }
};

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que no se esté ejecutando ya
    if (!isInitialized) {
        window.vivae.productos.init();
    }
});
