// Función para mostrar notificaciones
function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;

    const estilos = document.createElement('style');
    estilos.textContent = `
        .notificacion {
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 12px 24px;
            border-radius: 6px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.3s, transform 0.3s;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .notificacion.mostrar {
            opacity: 1;
            transform: translateY(0);
        }
        .notificacion-exito {
            background-color: #10b981;
        }
        .notificacion-error {
            background-color: #ef4444;
        }
        .notificacion-info {
            background-color: #3b82f6;
        }
    `;
    document.head.appendChild(estilos);

    document.body.appendChild(notificacion);

    // Mostrar notificación
    setTimeout(() => {
        notificacion.classList.add('mostrar');
    }, 10);

    // Ocultar y eliminar después de 3 segundos
    setTimeout(() => {
        notificacion.classList.remove('mostrar');
        setTimeout(() => {
            document.body.removeChild(notificacion);
            document.head.removeChild(estilos);
        }, 300);
    }, 3000);
}

// Hacer la función disponible globalmente
window.mostrarNotificacion = mostrarNotificacion;
