/*=========================================
        DATOS INICIALES DEL PROYECTO
=========================================*/

//===============================
// CATEGORÍAS
//===============================

const categoriasSeed = [

    {
        id: 1,
        nombre: "Conciertos",
        icono: "fa-solid fa-music"
    },

    {
        id: 2,
        nombre: "Festivales",
        icono: "fa-solid fa-champagne-glasses"
    },

    {
        id: 3,
        nombre: "Teatro",
        icono: "fa-solid fa-masks-theater"
    },

    {
        id: 4,
        nombre: "Deportes",
        icono: "fa-solid fa-futbol"
    },

    {
        id: 5,
        nombre: "Cine",
        icono: "fa-solid fa-film"
    }

];

//===============================
// EVENTOS
//===============================

const eventosSeed = [

    {
        id: 1,
        codigo: "EV001",
        nombre: "Rock Fest 2026",
        categoria: "Conciertos",
        ciudad: "Bogotá",
        fecha: "2026-08-12",
        hora: "20:00",
        precio: 120000,
        imagen: "assets/evento1.jpg",
        descripcion: "El festival de rock más esperado del año.",
        entradas: 500,
        vendidos: 120
    },

    {
        id: 2,
        codigo: "EV002",
        nombre: "Festival Electrónico",
        categoria: "Festivales",
        ciudad: "Medellín",
        fecha: "2026-09-18",
        hora: "19:00",
        precio: 180000,
        imagen: "assets/evento2.jpg",
        descripcion: "Los mejores DJ nacionales e internacionales.",
        entradas: 800,
        vendidos: 320
    },

    {
        id: 3,
        codigo: "EV003",
        nombre: "Obra de Teatro",
        categoria: "Teatro",
        ciudad: "Barranquilla",
        fecha: "2026-07-20",
        hora: "18:30",
        precio: 70000,
        imagen: "assets/evento3.jpg",
        descripcion: "Una experiencia teatral para toda la familia.",
        entradas: 250,
        vendidos: 60
    },

    {
        id: 4,
        codigo: "EV004",
        nombre: "Final Copa Colombia",
        categoria: "Deportes",
        ciudad: "Bucaramanga",
        fecha: "2026-10-05",
        hora: "16:00",
        precio: 95000,
        imagen: "assets/evento4.jpg",
        descripcion: "Vive la emoción del fútbol en vivo.",
        entradas: 1000,
        vendidos: 500
    }

];

//===============================
// USUARIOS
//===============================

const usuariosSeed = [

    {
        id: 1,
        nombre: "Administrador",
        correo: "admin@vibratickets.com",
        password: "123456",
        rol: "admin"
    },

    {
        id: 2,
        nombre: "Juan Pérez",
        correo: "juan@gmail.com",
        password: "123456",
        rol: "cliente"
    }

];

//===============================
// VENTAS
//===============================

const ventasSeed = [];

//===============================
// CARGAR EN LOCALSTORAGE
//===============================

if (!localStorage.getItem("categorias")) {

    localStorage.setItem(
        "categorias",
        JSON.stringify(categoriasSeed)
    );

}

if (!localStorage.getItem("eventos")) {

    localStorage.setItem(
        "eventos",
        JSON.stringify(eventosSeed)
    );

}

if (!localStorage.getItem("usuarios")) {

    localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosSeed)
    );

}

if (!localStorage.getItem("ventas")) {

    localStorage.setItem(
        "ventas",
        JSON.stringify(ventasSeed)
    );

}