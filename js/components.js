/*=========================================
        COMPONENTS.JS
    Componentes reutilizables
=========================================*/

/*=========================================
        TARJETA DE EVENTO
=========================================*/

function crearCardEvento(evento) {

    return `

        <article class="evento">

            <img src="${evento.imagen}" alt="${evento.nombre}">

            <div class="eventoInfo">

                <h3>${evento.nombre}</h3>

                <p>
                    <i class="fa-solid fa-location-dot"></i>
                    ${evento.ciudad}
                </p>

                <p>
                    <i class="fa-solid fa-calendar"></i>
                    ${evento.fecha}
                </p>

                <div class="eventoFooter">

                    <span class="precio">
                        $${evento.precio.toLocaleString("es-CO")}
                    </span>

                    <button
                        class="btnPrincipal"
                        data-id="${evento.id}">
                        Comprar
                    </button>

                </div>

            </div>

        </article>

    `;

}

/*=========================================
        TARJETA CATEGORÍA
=========================================*/

function crearCategoria(categoria){

    return `

        <article class="categoria">

            <i class="${categoria.icono}"></i>

            <h3>${categoria.nombre}</h3>

        </article>

    `;

}

/*=========================================
        FILA TABLA ADMIN
=========================================*/

function crearFilaEvento(evento){

    return `

        <tr>

            <td>${evento.codigo}</td>

            <td>${evento.nombre}</td>

            <td>${evento.categoria}</td>

            <td>${evento.ciudad}</td>

            <td>${evento.fecha}</td>

            <td>

                $${evento.precio.toLocaleString("es-CO")}

            </td>

            <td>

                <div class="accionesTabla">

                    <button
                        class="btnEditar"
                        data-id="${evento.id}">

                        <i class="fa-solid fa-pen"></i>

                    </button>

                    <button
                        class="btnEliminar"
                        data-id="${evento.id}">

                        <i class="fa-solid fa-trash"></i>

                    </button>

                </div>

            </td>

        </tr>

    `;

}

/*=========================================
        RENDER EVENTOS
=========================================*/

function pintarEventos(){

    const contenedor =
        document.getElementById("contenedorEventos");

    if(!contenedor) return;

    const eventos = obtenerEventos();

    contenedor.innerHTML = "";

    eventos.forEach(evento=>{

        contenedor.innerHTML +=
            crearCardEvento(evento);

    });

}

/*=========================================
        RENDER CATEGORIAS
=========================================*/

function pintarCategorias(){

    const contenedor =
        document.getElementById("listaCategorias");

    if(!contenedor) return;

    const categorias = obtenerCategorias();

    contenedor.innerHTML = "";

    categorias.forEach(categoria=>{

        contenedor.innerHTML +=
            crearCategoria(categoria);

    });

}

/*=========================================
        RENDER TABLA ADMIN
=========================================*/

function pintarTablaEventos(){

    const tabla =
        document.getElementById("listaEventos");

    if(!tabla) return;

    const eventos = obtenerEventos();

    tabla.innerHTML = "";

    eventos.forEach(evento=>{

        tabla.innerHTML +=
            crearFilaEvento(evento);

    });

}

/*=========================================
        ACTUALIZAR CARDS ADMIN
=========================================*/

function actualizarDashboard(){

    const eventos=document.getElementById("totalEventos");

    const categorias=document.getElementById("totalCategorias");

    const ventas=document.getElementById("totalEntradas");

    const ingresos=document.getElementById("ingresos");

    if(eventos){

        eventos.textContent=
            totalEventos();

    }

    if(categorias){

        categorias.textContent=
            totalCategorias();

    }

    if(ventas){

        ventas.textContent=
            totalVentas();

    }

    if(ingresos){

        ingresos.textContent=
            "$"+ingresosTotales().toLocaleString("es-CO");

    }

}

/*=========================================
        MENSAJE TEMPORAL
=========================================*/

function mostrarMensaje(texto,color="#10B981"){

    const mensaje=document.createElement("div");

    mensaje.textContent=texto;

    mensaje.style.position="fixed";

    mensaje.style.top="20px";

    mensaje.style.right="20px";

    mensaje.style.padding="15px 25px";

    mensaje.style.background=color;

    mensaje.style.color="white";

    mensaje.style.borderRadius="10px";

    mensaje.style.zIndex="9999";

    mensaje.style.boxShadow="0 10px 25px rgba(0,0,0,.3)";

    document.body.appendChild(mensaje);

    setTimeout(()=>{

        mensaje.remove();

    },2500);

}