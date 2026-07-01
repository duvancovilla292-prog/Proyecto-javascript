/*=========================================
            MAIN.JS
=========================================*/

document.addEventListener("DOMContentLoaded", () => {

    pintarCategorias();

    pintarEventos();

    iniciarBuscador();

    iniciarCompra();

});

/*=========================================
            BUSCADOR
=========================================*/

function iniciarBuscador(){

    const buscador=document.getElementById("buscarEvento");

    if(!buscador) return;

    buscador.addEventListener("keyup",()=>{

        const texto=buscador.value.toLowerCase();

        const eventos=obtenerEventos();

        const filtrados=eventos.filter(evento=>

            evento.nombre.toLowerCase().includes(texto) ||

            evento.categoria.toLowerCase().includes(texto) ||

            evento.ciudad.toLowerCase().includes(texto)

        );

        const contenedor=document.getElementById("contenedorEventos");

        contenedor.innerHTML="";

        filtrados.forEach(evento=>{

            contenedor.innerHTML+=crearCardEvento(evento);

        });

    });

}

/*=========================================
            COMPRAR
=========================================*/

function iniciarCompra(){

    document.addEventListener("click",(e)=>{

        if(!e.target.matches(".btnPrincipal")) return;

        if(!e.target.dataset.id) return;

        const id=Number(e.target.dataset.id);

        comprarEntrada(id);

    });

}

/*=========================================
        REGISTRAR VENTA
=========================================*/

function comprarEntrada(id){

    const evento=buscarEventoPorId(id);

    if(!evento) return;

    if(evento.vendidos>=evento.entradas){

        mostrarMensaje(

            "No hay entradas disponibles",

            "#DC2626"

        );

        return;

    }

    evento.vendidos++;

    actualizarEvento(evento);

    const ventas=obtenerVentas();

    const venta={

        id:generarId(ventas),

        usuario:"Cliente",

        evento:evento.nombre,

        cantidad:1,

        total:evento.precio,

        fecha:new Date().toLocaleDateString()

    };

    agregarVenta(venta);

    mostrarMensaje(

        "Compra realizada correctamente"

    );

}

/*=========================================
        BOTÓN HERO
=========================================*/

const botonHero=document.querySelector(".hero button");

if(botonHero){

    botonHero.addEventListener("click",()=>{

        document.getElementById("eventos")

        .scrollIntoView({

            behavior:"smooth"

        });

    });

}

/*=========================================
        NEWSLETTER
=========================================*/

const botonNewsletter=document.querySelector(".suscripcion button");

if(botonNewsletter){

    botonNewsletter.addEventListener("click",()=>{

        const correo=document.querySelector(".suscripcion input");

        if(correo.value===""){

            mostrarMensaje(

                "Ingrese un correo",

                "#DC2626"

            );

            return;

        }

        mostrarMensaje(

            "Gracias por suscribirte"

        );

        correo.value="";

    });

}