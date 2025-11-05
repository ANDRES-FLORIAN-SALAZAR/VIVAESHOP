// Verificar si CONFIG ya está definido
if (!window.CONFIG) {
    // Configuración global de la aplicación
    window.CONFIG = {
        WHATSAPP_NUMBER: '573175535562', // usuario +57 3175535562 sin +
        getWhatsAppUrl: function(productName = '') {
            const message = encodeURIComponent(
                `¡Hola! Estoy interesado en ${productName ? 'el producto: ' + productName : 'tus productos'}. ` +
                '¿Podrías brindarme más información por favor?'
            );
            return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${message}`;
        }
    };
}
