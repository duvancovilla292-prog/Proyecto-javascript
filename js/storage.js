// Constante que guarda las palabras clave exactas que se usarán en el LocalStorage
// Esto evita que por un error de dedo escribas mal el nombre de la clave en otros archivos.
const KEYS = {
    EVENTOS: 'eventpass_eventos',
    CARRITO: 'eventpass_carrito',
    COMPRAS: 'eventpass_compras'
};

// Objeto de servicios exportable que contiene las funciones de lectura y escritura
export const StorageService = {
    
    // ====================
    // FUNCIÓN: get(key)
    // ====================
    // Sirve para traer cualquier información guardada en el navegador.
    
    get(key) {
        const data = localStorage.getItem(key); // Intenta buscar la clave en el navegador
        return data ? JSON.parse(data) : []; // Si tiene datos, los convierte en objetos/arreglos utilizables; si no, devuelve un arreglo vacío [].
    },

    // ====================
    // FUNCIÓN: set(key, data)
    // ====================
    // Sirve para escribir o guardar información directamente en el navegador.
    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data)); // Convierte el código de JS a texto plano para que el navegador lo pueda procesar y almacenar.
    },

    // ====================
    // MÉTODOS DE EVENTOS
    // ====================
    // Obtiene los eventos guardados usando la clave específica de eventos
    getEventos() {
        return this.get(KEYS.EVENTOS);
    },
    // Guarda o actualiza la lista completa de eventos en el almacenamiento
    saveEventos(eventos) {
        this.set(KEYS.EVENTOS, eventos);
    },

    // ====================
    // MÉTODOS DEL CARRITO
    // ====================
    // Obtiene los productos añadidos temporalmente por el cliente
    getCarrito() {
        return this.get(KEYS.CARRITO);
    },
    // Guarda el estado actual del carrito para que no se pierda al recargar
    saveCarrito(carrito) {
        this.set(KEYS.CARRITO, carrito);
    },

    // ====================
    // MÉTODOS DE COMPRAS
    // ====================
    // Obtiene el historial de todas las facturas o tickets generados en la app
    getCompras() {
        return this.get(KEYS.COMPRAS);
    },
    // Añade una nueva compra al historial existente sin borrar las anteriores
    saveCompra(nuevaCompra) {
        const compras = this.get(KEYS.COMPRAS); // 1. Trae las compras viejas
        compras.push(nuevaCompra); // 2. Agrega la nueva compra a la lista
        this.set(KEYS.COMPRAS, compras); // 3. Guarda la lista actualizada en el navegador
    }
};
