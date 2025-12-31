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
function mostrarProducto(producto) {
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
    if (producto.image) {
        if (Array.isArray(producto.image)) {
            imagenes.push(...producto.image);
        } else {
            imagenes.push(producto.image);
        }
    } else {
        // Imagen por defecto si no hay imágenes
        imagenes.push('img/placeholder-producto.jpg');
    }
    
    const imagenPrincipal = document.getElementById('imagen-principal');
    const contenedorMiniaturas = document.getElementById('miniaturas');
    
    // Establecer la imagen principal
    imagenPrincipal.src = imagenes[0];
    imagenPrincipal.alt = producto.name || 'Imagen del producto';
    
    // Limpiar miniaturas existentes
    contenedorMiniaturas.innerHTML = '';
    
    // Agregar miniaturas
    imagenes.forEach((imagen, index) => {
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
    
    // Mostrar la sección del producto
    document.getElementById('producto-detalle').style.display = 'grid';
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
cargarNavegacion();
cargarFooter();

// Función para cargar la navegación
async function cargarNavegacion() {
    try {
        const response = await fetch('includes/nav.html');
        if (!response.ok) throw new Error('No se pudo cargar la navegación');
        
        const html = await response.text();
        document.getElementById('navbar-placeholder').innerHTML = html;
    } catch (error) {
        console.error('Error al cargar la navegación:', error);
    }
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
