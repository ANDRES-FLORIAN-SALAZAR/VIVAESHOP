// Función para cargar productos destacados en la página de inicio
document.addEventListener('DOMContentLoaded', function() {
    const featuredProductsContainer = document.getElementById('featured-products');
    
    // Solo ejecutar si estamos en la página de inicio y existe el contenedor
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        cargarProductosDestacados();
    }

    // Función para cargar productos destacados
    async function cargarProductosDestacados() {
        if (!featuredProductsContainer) return;

        try {
            // Mostrar indicador de carga
            featuredProductsContainer.innerHTML = '<div class="loading">Cargando productos destacados...</div>';
            
            // Cargar productos desde el archivo JSON
            const response = await fetch('data/productos.json');
            if (!response.ok) {
                throw new Error('Error al cargar los productos');
            }
            
            const productos = await response.json();
            
            // Mostrar solo los primeros 4 productos (o menos si hay menos de 4)
            const productosDestacados = productos.slice(0, 4);
            
            // Limpiar el contenedor
            featuredProductsContainer.innerHTML = '';
            
            // Agregar los productos al DOM
            productosDestacados.forEach(producto => {
                const productoElement = crearElementoProducto(producto);
                featuredProductsContainer.appendChild(productoElement);
            });
            
        } catch (error) {
            console.error('Error al cargar productos destacados:', error);
            featuredProductsContainer.innerHTML = '<div class="error">No se pudieron cargar los productos. Por favor, inténtalo de nuevo más tarde.</div>';
        }
    }
    
    // Función para crear el elemento HTML de un producto
    function crearElementoProducto(producto) {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        // Crear la URL de la imagen o usar una por defecto
        const imagenUrl = producto.imagen || producto.image || 'img/placeholder.jpg';
        
        // Crear el enlace al detalle del producto
        const productLink = document.createElement('a');
        productLink.href = `producto.html?id=${producto.id}`;
        productLink.style.textDecoration = 'none';
        productLink.style.color = 'inherit';
        
        // Contenido del producto
        productLink.innerHTML = `
            <div class="product-image-container">
                <img src="${imagenUrl}" alt="${producto.nombre || producto.name}" class="product-image" onerror="this.onerror=null; this.src='img/placeholder.jpg';">
            </div>
            <div class="product-info">
                <h3 class="product-title">${producto.nombre || producto.name || 'Producto sin nombre'}</h3>
                <p class="product-price">$${(producto.precio || producto.price || 0).toLocaleString()}</p>
            </div>
        `;
        
        productCard.appendChild(productLink);
        return productCard;
    }
});

