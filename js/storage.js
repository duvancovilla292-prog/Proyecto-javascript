const KEYS = {
    EVENTOS: 'eventpass_eventos',
    CARRITO: 'eventpass_carrito',
    COMPRAS: 'eventpass_compras'
};

export const StorageService = {
    get(key) {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    set(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    // --- GESTIÓN DE EVENTOS ---
    getEventos() {
        return this.get(KEYS.EVENTOS);
    },
    saveEventos(eventos) {
        this.set(KEYS.EVENTOS, eventos);
    },

    // --- GESTIÓN DEL CARRITO ---
    getCarrito() {
        return this.get(KEYS.CARRITO);
    },
    saveCarrito(carrito) {
        this.set(KEYS.CARRITO, carrito);
    },

    // --- GESTIÓN DE COMPRAS (DASHBOARD) ---
    getCompras() {
        return this.get(KEYS.COMPRAS);
    },
    saveCompra(nuevaCompra) {
        const compras = this.get(KEYS.COMPRAS);
        compras.push(nuevaCompra);
        this.set(KEYS.COMPRAS, compras);
    }
};