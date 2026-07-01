/*=========================================
        STORAGE.JS
        Manejo del LocalStorage
=========================================*/

/**
 * Obtiene los datos almacenados en localStorage.
 * @param {string} clave
 * @returns {Array}
 */
function obtenerDatos(clave) {
    return JSON.parse(localStorage.getItem(clave)) || [];
}

/**
 * Guarda datos en localStorage.
 * @param {string} clave
 * @param {Array} datos
 */
function guardarDatos(clave, datos) {
    localStorage.setItem(clave, JSON.stringify(datos));
}

/*=========================================
                EVENTOS
=========================================*/

/**
 * Retorna todos los eventos.
 */
function obtenerEventos() {
    return obtenerDatos("eventos");
}

/**
 * Guarda el arreglo de eventos.
 */
function guardarEventos(eventos) {
    guardarDatos("eventos", eventos);
}

/**
 * Agrega un evento.
 */
function agregarEvento(evento) {
    const eventos = obtenerEventos();
    eventos.push(evento);
    guardarEventos(eventos);
}

/**
 * Actualiza un evento.
 */
function actualizarEvento(eventoActualizado) {

    const eventos = obtenerEventos();

    const indice = eventos.findIndex(
        evento => evento.id === eventoActualizado.id
    );

    if (indice !== -1) {
        eventos[indice] = eventoActualizado;
        guardarEventos(eventos);
    }
}

/**
 * Elimina un evento.
 */
function eliminarEvento(id) {

    const eventos = obtenerEventos().filter(
        evento => evento.id !== id
    );

    guardarEventos(eventos);
}

/**
 * Busca un evento por ID.
 */
function buscarEventoPorId(id) {
    return obtenerEventos().find(
        evento => evento.id === id
    );
}

/*=========================================
            CATEGORÍAS
=========================================*/

function obtenerCategorias() {
    return obtenerDatos("categorias");
}

function guardarCategorias(categorias) {
    guardarDatos("categorias", categorias);
}

/*=========================================
                USUARIOS
=========================================*/

function obtenerUsuarios() {
    return obtenerDatos("usuarios");
}

function guardarUsuarios(usuarios) {
    guardarDatos("usuarios", usuarios);
}

/**
 * Busca un usuario por correo.
 */
function buscarUsuario(correo) {
    return obtenerUsuarios().find(
        usuario => usuario.correo === correo
    );
}

/*=========================================
                VENTAS
=========================================*/

function obtenerVentas() {
    return obtenerDatos("ventas");
}

function guardarVentas(ventas) {
    guardarDatos("ventas", ventas);
}

function agregarVenta(venta) {
    const ventas = obtenerVentas();
    ventas.push(venta);
    guardarVentas(ventas);
}

/*=========================================
            ESTADÍSTICAS
=========================================*/

function totalEventos() {
    return obtenerEventos().length;
}

function totalCategorias() {
    return obtenerCategorias().length;
}

function totalVentas() {
    return obtenerVentas().length;
}

function ingresosTotales() {

    const ventas = obtenerVentas();

    return ventas.reduce(
        (total, venta) => total + venta.total,
        0
    );
}

/*=========================================
                UTILIDADES
=========================================*/

/**
 * Genera un nuevo ID consecutivo.
 */
function generarId(lista) {

    if (lista.length === 0) {
        return 1;
    }

    return Math.max(...lista.map(item => item.id)) + 1;
}