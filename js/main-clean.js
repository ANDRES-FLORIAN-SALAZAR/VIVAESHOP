// main-clean.js - Versión simplificada y limpia
console.log("main-clean.js cargado correctamente");

// Hacer que loadProducts esté disponible globalmente
window.loadProducts = async function() {
    try {
        console.log("[DEBUG] Cargando productos...");
        const response = await fetch("data/productos.json");
        
        if (!response.ok) {
            throw new Error(`Error HTTP! estado: ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[EXITO] ${data.length} productos cargados`);
        return data;
        
    } catch (error) {
        console.error("[ERROR] No se pudieron cargar los productos:", error);
        
        // Mostrar mensaje de error en la interfaz
        const errorContainer = document.createElement("div");
        errorContainer.style.padding = "20px";
        errorContainer.style.color = "red";
        errorContainer.style.textAlign = "center";
        errorContainer.innerHTML = `
            <h3>Error al cargar los productos</h3>
            <p>${error.message}</p>
            <p>Por favor, recarga la página o intenta más tarde.</p>
            <button onclick="window.location.reload()" style="padding: 8px 16px; margin-top: 10px;">
                Reintentar
            </button>
        `;
        
        const mainContent = document.querySelector(".main-content");
        if (mainContent) {
            mainContent.prepend(errorContainer);
        }
        
        return [];
    }
};

// Espacio para futuras inicializaciones globales
