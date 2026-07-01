/*=========================================
            ADMIN.JS
=========================================*/

let editando = false;
let idEditar = null;

/*=========================================
            INICIALIZAR
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    actualizarDashboard();

    pintarTablaEventos();

    eventosBotones();

});

/*=========================================
        EVENTOS PRINCIPALES
=========================================*/

function eventosBotones() {

    const btnNuevo = document.getElementById("nuevoEvento");
    const modal = document.getElementById("modalEvento");
    const cerrarModal = document.getElementById("cerrarModal");
    const formulario = document.getElementById("formEvento");

    if (btnNuevo) {

        btnNuevo.addEventListener("click", () => {

            formulario.reset();

            editando = false;

            idEditar = null;

            modal.classList.remove("oculto");

        });

    }

    if (cerrarModal) {

        cerrarModal.addEventListener("click", () => {

            modal.classList.add("oculto");

        });

    }

    if (formulario) {

        formulario.addEventListener("submit", guardarEvento);

    }

}

/*=========================================
            GUARDAR EVENTO
=========================================*/

function guardarEvento(e) {

    e.preventDefault();

    const eventos = obtenerEventos();

    const nuevoEvento = {

        id: editando ? idEditar : generarId(eventos),

        codigo: document.getElementById("codigo").value,

        nombre: document.getElementById("nombre").value,

        categoria: document.getElementById("categoria").value,

        ciudad: document.getElementById("ciudad").value,

        fecha: document.getElementById("fecha").value,

        hora: document.getElementById("hora").value,

        precio: Number(document.getElementById("precio").value),

        imagen: document.getElementById("imagen").value,

        descripcion: document.getElementById("descripcion").value,

        entradas: 500,

        vendidos: 0

    };

    if (editando) {

        actualizarEvento(nuevoEvento);

        mostrarMensaje("Evento actualizado");

    } else {

        agregarEvento(nuevoEvento);

        mostrarMensaje("Evento agregado");

    }

    document.getElementById("modalEvento").classList.add("oculto");

    document.getElementById("formEvento").reset();

    actualizarDashboard();

    pintarTablaEventos();

}

/*=========================================
        ELIMINAR Y EDITAR
=========================================*/

document.addEventListener("click", (e) => {

    /* Eliminar */

    if (e.target.closest(".btnEliminar")) {

        const id = Number(

            e.target.closest(".btnEliminar").dataset.id

        );

        if (confirm("¿Desea eliminar este evento?")) {

            eliminarEvento(id);

            pintarTablaEventos();

            actualizarDashboard();

            mostrarMensaje("Evento eliminado", "#DC2626");

        }

    }

    /* Editar */

    if (e.target.closest(".btnEditar")) {

        const id = Number(

            e.target.closest(".btnEditar").dataset.id

        );

        editarEvento(id);

    }

});

/*=========================================
            EDITAR
=========================================*/

function editarEvento(id) {

    const evento = buscarEventoPorId(id);

    if (!evento) return;

    editando = true;

    idEditar = id;

    document.getElementById("codigo").value = evento.codigo;

    document.getElementById("nombre").value = evento.nombre;

    document.getElementById("categoria").value = evento.categoria;

    document.getElementById("ciudad").value = evento.ciudad;

    document.getElementById("fecha").value = evento.fecha;

    document.getElementById("hora").value = evento.hora;

    document.getElementById("precio").value = evento.precio;

    document.getElementById("imagen").value = evento.imagen;

    document.getElementById("descripcion").value = evento.descripcion;

    document.getElementById("modalEvento").classList.remove("oculto");

}

/*=========================================
            BUSCADOR
=========================================*/

const buscador = document.getElementById("buscarAdmin");

if (buscador) {

    buscador.addEventListener("keyup", () => {

        const texto = buscador.value.toLowerCase();

        const eventos = obtenerEventos();

        const resultado = eventos.filter(evento =>

            evento.nombre.toLowerCase().includes(texto) ||

            evento.categoria.toLowerCase().includes(texto) ||

            evento.ciudad.toLowerCase().includes(texto)

        );

        const tabla = document.getElementById("listaEventos");

        tabla.innerHTML = "";

        resultado.forEach(evento => {

            tabla.innerHTML += crearFilaEvento(evento);

        });

    });

}

/*=========================================
        CERRAR SESIÓN
=========================================*/

const salir = document.getElementById("cerrarSesion");

if (salir) {

    salir.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}