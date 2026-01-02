// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Obtener el ID del producto de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (!productId) {
        mostrarError('No se ha especificado un producto');
        return;
    }

    // Cargar el producto
    cargarProducto(productId);
});

/**
 * Carga los datos del producto desde el archivo JSON
 */
async function cargarProducto(id) {
    try {
        // Mostrar estado de carga
        document.getElementById('loading').style.display = 'flex';
        
        // Ocultar sección de error si está visible
        document.getElementById('error-container').style.display = 'none';
        
        // Cargar los productos
        const response = await fetch('data/productos.json');
        if (!response.ok) {
            throw new Error('Error al cargar los productos');
        }
        
        const productos = await response.json();
        
        // Buscar el producto por ID
        const producto = Array.isArray(productos) ? 
            productos.find(p => p.id == id) : 
            null;
        
        if (!producto) {
            throw new Error('Producto no encontrado');
        }
        
        // Mostrar el producto
        mostrarProducto(producto);
    } catch (error) {
        console.error('Error al cargar el producto:', error);
        mostrarError('No se pudo cargar la información del producto. Por favor, inténtalo de nuevo más tarde.');
    } finally {
        // Ocultar estado de carga
        document.getElementById('loading').style.display = 'none';
    }
}

/**
 * Muestra los datos del producto en la página
 */
async function mostrarProducto(producto) {
    // Actualizar título de la página
    document.title = `${producto.name || 'Producto'} - VIVAE`;
    
    // Actualizar la información básica
    document.getElementById('producto-nombre').textContent = producto.name || 'Producto sin nombre';
    
    // Formatear y mostrar el precio
    const precio = producto.price ? 
        new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(producto.price) : 
        'Precio no disponible';
    document.getElementById('producto-precio').textContent = precio;
    
    // Mostrar descripción
    const descripcion = producto.description || 'Sin descripción disponible.';
    document.getElementById('producto-descripcion').innerHTML = `<p>${descripcion.replace(/\n/g, '</p><p>')}</p>`;
    
    // Configurar el botón de WhatsApp
    const btnWhatsApp = document.getElementById('btn-contactar');
    const mensaje = `Hola, estoy interesado en el producto: ${producto.name || ''} (${window.location.href})`;
    btnWhatsApp.href = `https://wa.me/573175535562?text=${encodeURIComponent(mensaje)}`;
    
    // Configurar imágenes
    const imagenes = [];
    const imagenPorDefecto = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA0MDAgNDAwIiBmaWxsPSJub25lIiBzdHJva2U9IiNlZWVlZWUiIHN0cm9rZS13aWR0aD0iMiI+PHJlY3Qgd2lkdGg9IjQwMCIgaGVpZ2h0PSI0MDAiIGZpbGw9IiNmOGY5ZmEiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBhbGlnbm1lbnQtYmFzZWxpbmU9Im1pZGRsZSIgZmlsbD0iIzk5OSI+SW1hZ2VuIG5vIGRpc3BvbmlibGU8L3RleHQ+PC9zdmc+';
    
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
            
            return imagenPorDefecto;
        }
        
        return rutaFinal;
    };
    
    // Función para cargar las imágenes de forma asíncrona
    const cargarImagenes = async () => {
        if (producto.image) {
            if (Array.isArray(producto.image)) {
                // Procesar cada imagen del array
                for (const img of producto.image) {
                    const ruta = await obtenerRutaImagen(img);
                    if (ruta) imagenes.push(ruta);
                }
            } else {
                const ruta = await obtenerRutaImagen(producto.image);
                if (ruta) imagenes.push(ruta);
            }
        }
        
        // Si no hay imágenes, usar la imagen por defecto
        if (imagenes.length === 0) {
            imagenes.push(imagenPorDefecto);
        }
        
        return imagenes;
    };
    
    // Cargar las imágenes y luego continuar
    const imagenesCargadas = await cargarImagenes();
    
    
    const imagenPrincipal = document.getElementById('imagen-principal');
    const contenedorMiniaturas = document.getElementById('miniaturas');
    
    // Establecer la imagen principal con manejo de errores
    imagenPrincipal.src = imagenesCargadas[0];
    imagenPrincipal.alt = producto.name || 'Imagen del producto';
    imagenPrincipal.onerror = function() {
        this.src = imagenPorDefecto;
        this.onerror = null; // Prevenir bucles de error
    };
    
    // Limpiar miniaturas existentes
    contenedorMiniaturas.innerHTML = '';
    
    // Agregar miniaturas
    imagenesCargadas.forEach((imagen, index) => {
        const miniatura = document.createElement('img');
        miniatura.src = imagen;
        miniatura.alt = `Vista ${index + 1} de ${producto.name || 'producto'}`;
        miniatura.loading = 'lazy';
        miniatura.onclick = () => {
            imagenPrincipal.src = imagen;
            // Actualizar clase activa
            document.querySelectorAll('#miniaturas img').forEach(img => 
                img.classList.remove('activa')
            );
            miniatura.classList.add('activa');
        };
        
        // Marcar la primera miniatura como activa
        if (index === 0) miniatura.classList.add('activa');
        
        contenedorMiniaturas.appendChild(miniatura);
    });
    
    // Mostrar características
    const listaCaracteristicas = document.getElementById('lista-caracteristicas');
    listaCaracteristicas.innerHTML = '';
    
    // Agregar categoría
    if (producto.category) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Categoría:</strong> ${producto.category}`;
        listaCaracteristicas.appendChild(li);
    }
    
    // Agregar tallas si existen
    if (producto.sizes && producto.sizes.length > 0) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Tallas disponibles:</strong> ${producto.sizes.join(', ')}`;
        listaCaracteristicas.appendChild(li);
    }
    
    // Agregar colores si existen
    if (producto.colors && producto.colors.length > 0) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>Colores disponibles:</strong> ${producto.colors.join(', ')}`;
        listaCaracteristicas.appendChild(li);
    }
    
    // Mostrar la sección del producto con una transición suave
    const productoDetalle = document.getElementById('producto-detalle');
    productoDetalle.style.opacity = '0';
    productoDetalle.style.display = 'grid';
    
    // Forzar reflow para que la animación funcione
    void productoDetalle.offsetWidth;
    
    // Aplicar la transición
    productoDetalle.style.transition = 'opacity 0.3s ease-in-out';
    productoDetalle.style.opacity = '1';
    
    // Desplazamiento suave al inicio de la página
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Muestra un mensaje de error
 */
function mostrarError(mensaje) {
    const errorContainer = document.getElementById('error-container');
    if (errorContainer) {
        errorContainer.querySelector('p').textContent = mensaje;
        errorContainer.style.display = 'flex';
    }
}

// Cargar la navegación y el pie de página
document.addEventListener('DOMContentLoaded', function() {
    cargarNavegacion().then(() => {
        // Inicializar menú móvil después de cargar la navegación
        if (typeof initMobileMenu === 'function') {
            initMobileMenu();
        }
        // Asegurar que los enlaces del menú funcionen correctamente
        setupMenuLinks();
    });
    cargarFooter();
});

// Función para cargar la navegación
async function cargarNavegacion() {
    try {
        const response = await fetch('includes/nav.html');
        if (!response.ok) throw new Error('No se pudo cargar la navegación');
        
        const html = await response.text();
        const navElement = document.getElementById('navbar-placeholder');
        if (navElement) {
            navElement.innerHTML = html;
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error al cargar la navegación:', error);
        return false;
    }
}

// Configurar los enlaces del menú
function setupMenuLinks() {
    // Actualizar el enlace activo según la página actual
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (currentPage === linkHref || 
            (currentPage === '' && linkHref === 'index.html') ||
            (currentPage.includes('producto') && linkHref === 'productos.html')) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.classList.remove('active');
            link.removeAttribute('aria-current');
        }
    });
}

// Función para cargar el pie de página
async function cargarFooter() {
    try {
        const response = await fetch('includes/footer.html');
        if (!response.ok) throw new Error('No se pudo cargar el pie de página');
        
        const html = await response.text();
        document.getElementById('footer-placeholder').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar el pie de página:', error);
    }
}
