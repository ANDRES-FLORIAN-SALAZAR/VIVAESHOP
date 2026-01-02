/**
 * carrito.js - Manejo del carrito de compras de VIVAE
 */

class Carrito {
    constructor() {
        this.carrito = [];
        this.cargarCarrito();
        this.inicializarEventos();
        this.actualizarContador();
    }

    // Cargar carrito desde localStorage
    cargarCarrito() {
        const carritoGuardado = localStorage.getItem('carritoVIVAE');
        if (carritoGuardado) {
            this.carrito = JSON.parse(carritoGuardado);
        }
    }

    // Guardar carrito en localStorage
    guardarCarrito() {
        localStorage.setItem('carritoVIVAE', JSON.stringify(this.carrito));
        this.actualizarContador();
    }

    // Agregar producto al carrito
    agregarProducto(producto, cantidad = 1) {
        return new Promise((resolve) => {
            const productoExistente = this.carrito.find(item => item.id === producto.id);
            
            if (productoExistente) {
                productoExistente.cantidad += cantidad;
            } else {
                this.carrito.push({
                    ...producto,
                    cantidad: cantidad
                });
            }
            
            this.guardarCarrito();
            this.actualizarVista();
            this.mostrarNotificacion('Producto agregado al carrito');
            resolve();
        });
    }

    // Eliminar producto del carrito
    eliminarProducto(id) {
        this.carrito = this.carrito.filter(item => item.id !== id);
        this.guardarCarrito();
        this.actualizarVista();
        this.mostrarNotificacion('Producto eliminado');
    }

    // Actualizar cantidad de un producto
    actualizarCantidad(id, cantidad) {
        const producto = this.carrito.find(item => item.id === id);
        if (producto) {
            producto.cantidad = parseInt(cantidad) || 1;
            if (producto.cantidad < 1) producto.cantidad = 1;
            this.guardarCarrito();
            this.actualizarVista();
        }
    }

    // Vaciar el carrito
    vaciarCarrito() {
        this.carrito = [];
        this.guardarCarrito();
        this.actualizarVista();
        this.mostrarNotificacion('Carrito vaciado');
    }

    // Calcular el total del carrito
    calcularTotal() {
        return this.carrito.reduce((total, item) => {
            return total + (item.precio * item.cantidad);
        }, 0);
    }

    // Actualizar el contador de productos en el ícono del carrito
    actualizarContador() {
        const contador = document.querySelector('.carrito-contador');
        if (contador) {
            const totalItems = this.carrito.reduce((total, item) => total + item.cantidad, 0);
            contador.textContent = totalItems;
            contador.style.display = totalItems > 0 ? 'flex' : 'none';
        }
    }

    // Mostrar notificación
    mostrarNotificacion(mensaje) {
        const notificacion = document.createElement('div');
        notificacion.className = 'notificacion';
        notificacion.textContent = mensaje;
        document.body.appendChild(notificacion);
        
        setTimeout(() => {
            notificacion.classList.add('mostrar');
        }, 10);
        
        setTimeout(() => {
            notificacion.classList.remove('mostrar');
            setTimeout(() => {
                document.body.removeChild(notificacion);
            }, 300);
        }, 3000);
    }

    // Renderizar los productos en el carrito
    renderizarProductos() {
        const carritoItems = document.querySelector('.carrito-items');
        if (!carritoItems) return '';

        if (this.carrito.length === 0) {
            return `
                <div class="carrito-vacio">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                    <p>¡Agrega productos para comenzar a comprar!</p>
                </div>
            `;
        }

        return this.carrito.map(item => `
            <div class="carrito-item" data-id="${item.id}">
                <img src="${item.imagen || 'img/placeholder.jpg'}" alt="${item.nombre}" class="carrito-item-img">
                <div class="carrito-item-detalles">
                    <h4 class="carrito-item-titulo">${item.nombre}</h4>
                    <p class="carrito-item-precio">$${item.precio.toFixed(2)}</p>
                    <div class="carrito-item-cantidad">
                        <button class="btn-cantidad" data-accion="restar">-</button>
                        <input type="number" value="${item.cantidad}" min="1" class="input-cantidad">
                        <button class="btn-cantidad" data-accion="sumar">+</button>
                    </div>
                    <button class="carrito-eliminar" data-id="${item.id}">
                        <i class="fas fa-trash"></i> Eliminar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Actualizar la vista del carrito
    actualizarVista() {
        const carritoItems = document.querySelector('.carrito-items');
        const carritoTotal = document.querySelector('.carrito-total-precio');
        
        if (carritoItems) {
            carritoItems.innerHTML = this.renderizarProductos();
        }
        
        if (carritoTotal) {
            carritoTotal.textContent = `$${this.calcularTotal().toFixed(2)}`;
        }
        
        this.actualizarContador();
    }

    // Inicializar eventos del carrito
    inicializarEventos() {
        // Toggle del carrito
        document.querySelectorAll('.carrito-icono').forEach(icono => {
            icono.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.carrito-contenedor').classList.toggle('activo');
                document.querySelector('.carrito-overlay').classList.toggle('activo');
                document.body.style.overflow = 'hidden';
            });
        });

        // Cerrar carrito
        document.querySelectorAll('.carrito-cerrar, .carrito-overlay').forEach(elemento => {
            elemento.addEventListener('click', () => {
                document.querySelector('.carrito-contenedor').classList.remove('activo');
                document.querySelector('.carrito-overlay').classList.remove('activo');
                document.body.style.overflow = '';
            });
        });

        // Delegación de eventos para los botones de cantidad y eliminar
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-accion]') || e.target.closest('.carrito-eliminar');
            if (!target) return;

            const item = target.closest('.carrito-item');
            if (!item) return;

            const id = item.dataset.id;

            // Manejar botones de cantidad
            if (target.matches('[data-accion]')) {
                const input = item.querySelector('.input-cantidad');
                let cantidad = parseInt(input.value) || 1;
                
                if (target.dataset.accion === 'sumar') {
                    cantidad++;
                } else if (target.dataset.accion === 'restar' && cantidad > 1) {
                    cantidad--;
                }
                
                input.value = cantidad;
                this.actualizarCantidad(id, cantidad);
            }
            
            // Manejar botón de eliminar
            if (target.matches('.carrito-eliminar')) {
                this.eliminarProducto(id);
            }
        });

        // Manejar cambios en el input de cantidad
        document.addEventListener('change', (e) => {
            if (e.target.matches('.input-cantidad')) {
                const item = e.target.closest('.carrito-item');
                const id = item.dataset.id;
                const cantidad = parseInt(e.target.value) || 1;
                this.actualizarCantidad(id, cantidad);
            }
        });

        // Botón vaciar carrito
        const btnVaciar = document.querySelector('.btn-vaciar');
        if (btnVaciar) {
            btnVaciar.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    this.vaciarCarrito();
                }
            });
        }

        // Botón pagar
        const btnPagar = document.querySelector('.btn-pagar');
        if (btnPagar) {
            btnPagar.addEventListener('click', () => {
                if (this.carrito.length === 0) {
                    this.mostrarNotificacion('El carrito está vacío');
                    return;
                }
                // Aquí podrías redirigir a la página de pago
                alert('Redirigiendo al proceso de pago...');
                // window.location.href = 'pago.html';
            });
        }
    }

    // Inicializar todos los eventos
    inicializarEventos() {
        // Asegurarse de que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.inicializarEventosCarrito());
        } else {
            this.inicializarEventosCarrito();
        }
    }

    // Inicializar eventos del carrito
    inicializarEventosCarrito() {
        // Toggle del carrito
        document.querySelectorAll('.carrito-icono').forEach(icono => {
            icono.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.carrito-contenedor').classList.toggle('activo');
                document.querySelector('.carrito-overlay').classList.toggle('activo');
                document.body.style.overflow = 'hidden';
                this.actualizarVista();
            });
        });

        // Cerrar carrito
        document.querySelectorAll('.carrito-cerrar, .carrito-overlay').forEach(elemento => {
            elemento.addEventListener('click', () => {
                document.querySelector('.carrito-contenedor').classList.remove('activo');
                document.querySelector('.carrito-overlay').classList.remove('activo');
                document.body.style.overflow = '';
            });
        });

        // Delegación de eventos para los botones de cantidad y eliminar
        document.addEventListener('click', (e) => {
            const target = e.target.closest('[data-accion]') || e.target.closest('.carrito-eliminar');
            if (!target) return;

            const item = target.closest('.carrito-item');
            if (!item) return;

            const id = item.dataset.id;

            // Manejar botones de cantidad
            if (target.matches('[data-accion]')) {
                const input = item.querySelector('.input-cantidad');
                let cantidad = parseInt(input.value) || 1;
                
                if (target.dataset.accion === 'sumar') {
                    cantidad++;
                } else if (target.dataset.accion === 'restar' && cantidad > 1) {
                    cantidad--;
                }
                
                input.value = cantidad;
                this.actualizarCantidad(id, cantidad);
            }
            
            // Manejar botón de eliminar
            if (target.matches('.carrito-eliminar')) {
                this.eliminarProducto(id);
            }
        });

        // Manejar cambios en el input de cantidad
        document.addEventListener('change', (e) => {
            if (e.target.matches('.input-cantidad')) {
                const item = e.target.closest('.carrito-item');
                const id = item.dataset.id;
                const cantidad = parseInt(e.target.value) || 1;
                this.actualizarCantidad(id, cantidad);
            }
        });

        // Botón vaciar carrito
        const btnVaciar = document.querySelector('.btn-vaciar');
        if (btnVaciar) {
            btnVaciar.addEventListener('click', () => {
                if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
                    this.vaciarCarrito();
                }
            });
        }

        // Botón pagar
        const btnPagar = document.querySelector('.btn-pagar');
        if (btnPagar) {
            btnPagar.addEventListener('click', () => {
                if (this.carrito.length === 0) {
                    this.mostrarNotificacion('El carrito está vacío');
                    return;
                }
                // Aquí podrías redirigir a la página de pago
                alert('Redirigiendo al proceso de pago...');
                // window.location.href = 'pago.html';
            });
        }
    }
}

// Inicializar el carrito cuando el DOM esté listo
const carrito = new Carrito();

// Hacer el carrito accesible globalmente
window.vivae = window.vivae || {};
window.vivae.carrito = carrito;

// Función para agregar un producto al carrito desde cualquier parte de la aplicación
function agregarAlCarrito(producto, cantidad = 1) {
    return carrito.agregarProducto(producto, cantidad);
}

// Exportar la función para uso global
window.agregarAlCarrito = agregarAlCarrito;
