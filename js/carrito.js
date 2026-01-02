// Carrito de compras
class Carrito {
    constructor() {
        this.items = [];
        this.total = 0;
        this.cargarCarrito();
        this.initEventListeners();
    }

    // Cargar carrito desde localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carrito');
        if (carritoGuardado) {
            this.items = JSON.parse(carritoGuardado);
            this.calcularTotal();
        }
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carrito', JSON.stringify(this.items));
        this.actualizarVista();
    }

    // Agregar producto al carrito
    agregarProducto(producto) {
        const itemExistente = this.items.find(item => item.id === producto.id);
        
        if (itemExistente) {
            itemExistente.cantidad += 1;
        } else {
            this.items.push({
                ...producto,
                cantidad: 1
            });
        }
        
        this.guardarCarrito();
        this.mostrarNotificacion(`"${producto.nombre}" agregado al carrito`);
        this.mostrarCarrito();
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.guardarCarrito();
        this.mostrarNotificacion('Producto eliminado del carrito');
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, cambio) {
        const item = this.items.find(item => item.id === id);
        if (item) {
            item.cantidad += cambio;
            if (item.cantidad <= 0) {
                this.eliminarProducto(id);
            } else {
                this.guardarCarrito();
            }
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = mensaje;
        document.body.appendChild(notification);
        
        // Mostrar notificación
        setTimeout(() => notification.classList.add('show'), 10);
        
        // Ocultar después de 3 segundos
        setTimeout(() => {
            notification.classList.remove('show');
            // Eliminar después de la animación
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Renderizar carrito en el DOM
    renderizarCarrito() {
        const cartBody = document.querySelector('.cart-body');
        const cartTotal = document.querySelector('.cart-total span');
        
        if (!cartBody) return;
        
        if (this.items.length === 0) {
            cartBody.innerHTML = `
                <div class="cart-empty">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
            document.querySelector('.cart-footer').style.display = 'none';
            return;
        }
        
        // Mostrar el footer si hay productos
        document.querySelector('.cart-footer').style.display = 'block';
        
        // Renderizar productos
        cartBody.innerHTML = this.items.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.imagen || 'img/placeholder.jpg'}" alt="${item.nombre}" class="cart-item-img">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.nombre}</h4>
                    <span class="cart-item-price">$${item.precio.toFixed(2)}</span>
                    <div class="cart-item-actions">
                        <button class="quantity-btn decrease">-</button>
                        <span class="quantity">${item.cantidad}</span>
                        <button class="quantity-btn increase">+</button>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
        
        // Actualizar total
        if (cartTotal) {
            cartTotal.textContent = `$${this.calcularTotal().toFixed(2)}`;
        }
        
        // Añadir event listeners a los botones
        this.addItemEventListeners();
    }
    
    // Añadir event listeners a los elementos del carrito
    addItemEventListeners() {
        document.querySelectorAll('.quantity-btn.increase').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                this.actualizarCantidad(itemId, 1);
            });
        });
        
        document.querySelectorAll('.quantity-btn.decrease').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                this.actualizarCantidad(itemId, -1);
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.cart-item').dataset.id);
                this.eliminarProducto(itemId);
            });
        });
    }
    
    // Inicializar event listeners
    initEventListeners() {
        // Toggle carrito
        document.addEventListener('click', (e) => {
            if (e.target.closest('#cart-icon') || e.target === document.getElementById('cart-icon')) {
                e.preventDefault();
                this.mostrarCarrito();
            }
            
            if (e.target.closest('.cart-close') || e.target === document.querySelector('.cart-close')) {
                this.ocultarCarrito();
            }
            
            if (e.target === document.querySelector('.cart-overlay')) {
                this.ocultarCarrito();
            }
        });
        
        // Botón de checkout
        document.addEventListener('click', (e) => {
            if (e.target.closest('.btn-checkout')) {
                e.preventDefault();
                this.procesarPago();
            }
        });
    }
    
    // Mostrar el carrito
    mostrarCarrito() {
        document.querySelector('.cart-overlay').classList.add('active');
        document.querySelector('.cart-sidebar').classList.add('active');
        document.body.style.overflow = 'hidden';
        this.renderizarCarrito();
    }
    
    // Ocultar el carrito
    ocultarCarrito() {
        document.querySelector('.cart-overlay').classList.remove('active');
        document.querySelector('.cart-sidebar').classList.remove('active');
        document.body.style.overflow = '';
    }
    
    // Procesar pago
    procesarPago() {
        // Aquí iría la lógica de pago
        alert('Redirigiendo al proceso de pago...');
        // this.limpiarCarrito(); // Descomentar si se desea limpiar el carrito después del pago
    }
    
    // Limpiar carrito
    limpiarCarrito() {
        this.items = [];
        this.guardarCarrito();
        this.ocultarCarrito();
    }
    
    // Actualizar toda la vista del carrito
    actualizarVista() {
        this.calcularTotal();
        this.actualizarContador();
        this.renderizarCarrito();
    }

    // Calcular el total del carrito
    calcularTotal() {
        this.total = this.items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        return this.total;
    }

    // Obtener cantidad total de items
    obtenerTotalItems() {
        return this.items.reduce((sum, item) => sum + item.cantidad, 0);
    }

    // Actualizar contador del carrito
    actualizarContador() {
        const contador = document.querySelector('.cart-count');
        if (contador) {
            const totalItems = this.obtenerTotalItems();
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }
}

// Inicializar carrito
const carrito = new Carrito();

// Exportar para uso global
window.vivae = window.vivae || {};
window.vivae.carrito = carrito;

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Crear elementos del carrito si no existen
    if (!document.querySelector('.cart-overlay')) {
        const cartHTML = `
            <!-- Overlay del carrito -->
            <div class="cart-overlay"></div>
            
            <!-- Sidebar del carrito -->
            <div class="cart-sidebar">
                <div class="cart-header">
                    <h3>Tu Carrito</h3>
                    <button class="cart-close">&times;</button>
                </div>
                
                <div class="cart-body">
                    <!-- Los productos del carrito se insertarán aquí -->
                </div>
                
                <div class="cart-footer">
                    <div class="cart-total">
                        <span>Total:</span>
                        <span>$0.00</span>
                    </div>
                    <div class="cart-actions">
                        <a href="#" class="btn-checkout">Proceder al Pago</a>
                    </div>
                </div>
            </div>
        `;
        
        // Insertar el HTML del carrito al final del body
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }
    
    // Inicializar el carrito
    carrito.actualizarVista();
    
    // Añadir evento a los botones de "Añadir al carrito"
    document.addEventListener('click', (e) => {
        const addToCartBtn = e.target.closest('.btn-anadir-carrito');
        if (addToCartBtn) {
            e.preventDefault();
            const productData = JSON.parse(addToCartBtn.dataset.producto);
            carrito.agregarProducto({
                id: productData.id,
                nombre: productData.name || 'Producto sin nombre',
                precio: parseFloat(productData.price) || 0,
                imagen: productData.image || 'img/placeholder.jpg',
                categoria: productData.category || 'Sin categoría'
            });
        }
    });
});
