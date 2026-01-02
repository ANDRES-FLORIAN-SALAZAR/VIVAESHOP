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
        if (btnContactar && btnContactar.href && btnContactar.href.includes('whatsapp')) {
            // Permitir la navegación normal a WhatsApp
            return true;
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
    
    // Obtener el contenedor de productos
    const contenedorProductos = document.getElementById('products-grid');
    if (!contenedorProductos) {
        console.error('No se encontró el contenedor de productos');
        return;
    }
    
    // Limpiar el contenedor para evitar duplicados
    contenedorProductos.innerHTML = '';
    
    // Ordenar productos por ID (o por el campo que prefieras)
    const productosOrdenados = [...productos].sort((a, b) => a.id - b.id);
    
    // Verificar si hay productos para mostrar
    if (!productosOrdenados || productosOrdenados.length === 0) {
        mostrarMensajeSinResultados();
        return contenedorProductos;
    }
    
    // Crear la cuadrícula de productos
    const productosGrid = document.createElement('div');
    productosGrid.className = 'productos-grid';
    
    // Crear elementos para cada producto
    for (const producto of productosOrdenados) {
        const productCard = document.createElement('div');
        productCard.className = 'producto-card';
        
        // Formatear el precio
        const precio = producto.price ? new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(producto.price) : 'Precio no disponible';
        
        try {
            // Obtener la URL de la imagen directamente del producto
            const imagenUrl = producto.image || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
            
            // Construir el HTML del producto
            productCard.innerHTML = `
                <div class="product-image-container">
                    <img class="product-image" src="${imagenUrl}" alt="${producto.name || 'Producto'}" loading="lazy" 
                         onerror="this.onerror=null; this.src='${imagenUrl}'">
                    ${producto.featured ? '<div class="producto-destacado">Destacado</div>' : ''}
                </div>
                <div class="product-info">
                    ${producto.category ? `<span class="producto-categoria">${producto.category}</span>` : ''}
                    <h3 class="product-title">${producto.name || 'Producto sin nombre'}</h3>
                    <p class="product-price">${precio}</p>
                    
                    <div class="producto-detalles">
                        ${producto.sizes && producto.sizes.length > 0 ? 
                          `<div class="producto-talla">
                              <i class="fas fa-ruler"></i> ${producto.sizes.join(', ')}
                          </div>` : ''}
                        ${producto.colors && producto.colors.length > 0 ? 
                          `<div class="producto-color">
                              <i class="fas fa-palette"></i> ${producto.colors.join(', ')}
                          </div>` : ''}
                    </div>
                    
                    <div class="product-actions">
                        <a href="producto-detalle.html?id=${producto.id}" class="btn-ver-detalle" data-id="${producto.id}" aria-label="Ver detalles">
                            <i class="fas fa-eye"></i> Ver detalles
                        </a>
                        <button class="btn-anadir-carrito" data-producto='${JSON.stringify(producto).replace(/'/g, "'")}'>
                            <i class="fas fa-cart-plus"></i> Añadir al carrito
                        </button>
                    </div>
                </div>
            `;
            
            productosGrid.appendChild(productCard);
        } catch (error) {
            console.error('Error al cargar la imagen del producto:', producto.id, error);
            // Continuar con el siguiente producto si hay un error
            continue;
        }
    }
    
    // Agregar la cuadrícula al contenedor
    contenedorProductos.appendChild(productosGrid);
    
    // Ocultar mensaje de sin resultados si está visible
    const noResults = document.getElementById('no-results');
    if (noResults) noResults.style.display = 'none';
    
    // Inicializar eventos de los botones
    inicializarEventosProductos();
    
    return contenedorProductos;
}

/**
 * Configura los filtros de búsqueda y categorías
 */
function configurarFiltros() {
    // Si ya se configuraron los filtros, salir
    if (window.filtrosConfigurados) return;
    
    const buscador = document.getElementById('buscador');
    const contenedorFiltros = document.querySelector('.filtros-categorias');
    
    // Limpiar eventos anteriores si existen
    if (window.handleSearch) {
        buscador?.removeEventListener('input', window.handleSearch);
        buscador?.removeEventListener('keypress', window.handleSearchKeypress);
    }
    if (window.handleFilterClick) {
        contenedorFiltros?.removeEventListener('click', window.handleFilterClick);
    }
    
    // Configurar el buscador
    if (buscador) {
        // Función para manejar la búsqueda con debounce
        window.handleSearch = (e) => {
            clearTimeout(window.searchTimeout);
            window.searchTimeout = setTimeout(() => {
                const termino = e.target.value.trim().toLowerCase();
                const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
                filtrarProductos(termino, categoriaActiva);
            }, 300);
        };
        
        // Función para manejar la tecla Enter
        window.handleSearchKeypress = (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const termino = e.target.value.trim().toLowerCase();
                const categoriaActiva = document.querySelector('.filtro-btn.active')?.dataset.categoria || 'todos';
                filtrarProductos(termino, categoriaActiva);
            }
        };
        
        // Agregar eventos del buscador
        buscador.addEventListener('input', window.handleSearch);
        buscador.addEventListener('keypress', window.handleSearchKeypress);
    }
    
    // Configurar botones de categoría con delegación de eventos
    if (contenedorFiltros) {
        // Función para manejar clics en los botones de categoría
        window.handleFilterClick = (e) => {
            const boton = e.target.closest('.filtro-btn');
            if (boton) {
                // Prevenir comportamiento por defecto
                e.preventDefault();
                
                // Si ya está activo, no hacer nada
                if (boton.classList.contains('active')) return;
                
                // Actualizar botón activo
                document.querySelectorAll('.filtro-btn').forEach(btn => btn.classList.remove('active'));
                boton.classList.add('active');
                
                // Filtrar productos
                const termino = document.getElementById('buscador')?.value.trim().toLowerCase() || '';
                const categoria = boton.dataset.categoria || 'todos';
                filtrarProductos(termino, categoria);
            }
        };
        
        // Agregar evento de clic al contenedor de filtros
        contenedorFiltros.addEventListener('click', window.handleFilterClick);
    }
    
    // Marcar como configurado
    window.filtrosConfigurados = true;
}

/**
 * Filtra los productos según el término de búsqueda y la categoría
 */
async function filtrarProductos(termino = '', categoria = 'todos') {
    try {
        console.log(`Filtrando productos: término="${termino}", categoría="${categoria}"`);
        
        const loading = document.getElementById('loading');
        const productsGrid = document.querySelector('.productos-grid');
        const noResults = document.getElementById('no-results');
        
        // Mostrar indicador de carga
        if (loading) loading.style.display = 'block';
        if (productsGrid) productsGrid.style.opacity = '0.5';
        if (noResults) noResults.style.display = 'none';
        
        // Obtener los productos
        let productos = [];
        if (window.vivae?.state?.productos?.length > 0) {
            productos = window.vivae.state.productos;
            console.log(`Usando ${productos.length} productos del estado existente`);
        } else {
            console.log('Cargando productos...');
            productos = await cargarProductos();
            if (window.vivae) {
                window.vivae.state = window.vivae.state || {};
                window.vivae.state.productos = productos;
                console.log(`Se cargaron ${productos.length} productos`);
            }
        }
        
        // Si no hay productos, mostrar mensaje
        if (!productos || productos.length === 0) {
            console.warn('No hay productos para mostrar');
            if (noResults) noResults.style.display = 'block';
            if (productsGrid) productsGrid.innerHTML = '';
            return;
        }
        
        // Convertir el término de búsqueda a minúsculas para la comparación
        const terminoBusqueda = termino.toLowerCase().trim();
        const categoriaFiltro = categoria.toLowerCase().trim();
        
        console.log(`Filtrando ${productos.length} productos por término "${terminoBusqueda}" y categoría "${categoriaFiltro}"`);
        
        // Filtrar productos
        const productosFiltrados = productos.filter(producto => {
            try {
                // Obtener valores de los campos, asegurando que sean cadenas
                const nombre = (producto.name || producto.nombre || '').toString().toLowerCase().trim();
                const descripcion = (producto.description || producto.descripcion || '').toString().toLowerCase().trim();
                const categoria = (producto.category || producto.categoria || '').toString().toLowerCase().trim();
                
                // Filtrar por categoría
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
            } catch (error) {
                console.error('Error al filtrar producto:', error, producto);
                return false;
            }
        });
        
        console.log(`Se encontraron ${productosFiltrados.length} productos que coinciden con los criterios`);
        
        // Mostrar resultados
        if (productosFiltrados.length > 0) {
            // Mostrar el contador de resultados si existe
            const contadorResultados = document.getElementById('contador-resultados');
            if (contadorResultados) {
                contadorResultados.textContent = `${productosFiltrados.length} ${productosFiltrados.length === 1 ? 'producto encontrado' : 'productos encontrados'}`;
                contadorResultados.style.display = 'block';
            }
            
            // Usar la función mostrarProductos actualizada
            if (typeof mostrarProductos === 'function') {
                await mostrarProductos(productosFiltrados);
            } else {
                console.error('La función mostrarProductos no está disponible');
                // Mostrar un mensaje de error al usuario
                if (productsGrid) {
                    productsGrid.innerHTML = '<p class="error">Error al cargar los productos. Por favor, recarga la página.</p>';
                }
            }
        } else {
            console.log('No se encontraron productos que coincidan con los criterios de búsqueda');
            // Mostrar mensaje de "sin resultados"
            mostrarMensajeSinResultados();
        }
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        mostrarError('Ocurrió un error al filtrar los productos. Por favor, inténtalo de nuevo.');
    } finally {
        // Ocultar indicador de carga
        const loading = document.getElementById('loading');
        const productsGrid = document.querySelector('.productos-grid');
        
        if (loading) loading.style.display = 'none';
        if (productsGrid) productsGrid.style.opacity = '1';
        
        console.log('Filtrado de productos completado');
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
            if (boton.href && boton.href.includes('whatsapp')) {
                // Permitir la navegación normal a WhatsApp
                return true;
            }
            e.preventDefault();
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

// Variable para controlar la inicialización
let isInitialized = false;

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
    filtrarProductos
};

// Inicializar la página cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Verificar que no se esté ejecutando ya
    if (!isInitialized) {
        window.vivae.productos.init();
    }
});
