// Importamos la persistencia de datos y el cargador de eventos iniciales
import { StorageService } from './storage.js';
import { DataSeed } from './data-seed.js';

// Iniciamos la lógica asegurándonos de que el navegador procesó todo el árbol HTML de la tienda
document.addEventListener('DOMContentLoaded', async () => {
    // Esperamos a que los datos base estén listos en el LocalStorage
    await DataSeed.init(); 

    // ====================
    // CAPTURA DE COMPONENTES: FILTRADO Y PARRILLA
    // ====================
    const contenedorEventos = document.getElementById('contenedorEventos');
    const buscarEvento = document.getElementById('buscarEvento');
    const filtroCiudad = document.getElementById('filtroCiudad');
    const filtroCategoria = document.getElementById('filtroCategoria');

    // ====================
    // CAPTURA DE COMPONENTES: MODALES Y COMPRA
    // ====================
    const modalCarrito = document.getElementById('modalCarrito');
    const modalCompra = document.getElementById('modalCompra');
    const abrirCarrito = document.getElementById('abrirCarrito');
    const cerrarCarrito = document.getElementById('cerrarCarrito');
    const cerrarCompra = document.getElementById('cerrarCompra');
    const listaCarrito = document.getElementById('listaCarrito');
    const totalCompra = document.getElementById('totalCompra');
    const contadorCarrito = document.getElementById('contadorCarrito');
    const btnComprar = document.getElementById('btnComprar');
    const formCompra = document.getElementById('formCompra');

    // ====================
    // FUNCIÓN: cargarDepartamentos()
    // ====================
    // Carga las ciudades/regiones en los filtros de la tienda consumiendo el servicio de internet
    async function cargarDepartamentos() {
        if (!filtroCiudad) return;
        try {
            const respuesta = await fetch('https://api-colombia.com/api/v1/Department');
            if (!respuesta.ok) throw new Error('Error al obtener los departamentos');
            
            const departamentos = await respuesta.json();
            
            filtroCiudad.innerHTML = '<option value="">Todas las regiones (Colombia)</option>';
            departamentos.sort((a, b) => a.name.localeCompare(b.name)); // Orden alfabético seguro

            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.name; 
                option.textContent = dep.name;
                filtroCiudad.appendChild(option);
            });
        } catch (error) {
            console.error('Hubo un problema con la API de Colombia:', error);
            // RESPALDO EN CASO DE CAÍDA DEL SERVIDOR DE LA API: Lista cableada en duro para salvar la navegación
            filtroCiudad.innerHTML = `
                <option value="">Todas las regiones</option>
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Atlántico">Atlántico</option>
            `;
        }
    }

    // ====================
    // FUNCIÓN: mostrarEventos()
    // ====================
    // Se activa cada vez que escribes en el buscador o cambias los selectores para filtrar los shows en pantalla
    function mostrarEventos() {
        if (!contenedorEventos) return;
        const eventos = StorageService.getEventos(); // Lee los eventos almacenados
        const busqueda = buscarEvento.value.toLowerCase();
        const ciudad = filtroCiudad.value;
        const categoria = filtroCategoria.value;

        contenedorEventos.innerHTML = ''; // Limpiamos la grilla de tarjetas viejas

        // Filtramos aplicando triple regla de coincidencia concurrente
        const filtrados = eventos.filter(ev => {
            const coincideTexto = ev.nombre.toLowerCase().includes(busqueda);
            const coincideCiudad = ciudad === "" || ev.ciudad === ciudad;
            const coincideCategoria = categoria === "" || ev.categoria.toLowerCase() === categoria.toLowerCase();
            return coincideTexto && coincideCiudad && coincideCategoria; // Deben cumplirse las 3 obligatoriamente
        });

        // Si los filtros dejan la lista en cero, imprimimos un mensaje amigable de no encontrado
        if (filtrados.length === 0) {
            contenedorEventos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">No se encontraron eventos para los filtros seleccionados.</p>`;
            return;
        }

        // Instanciamos el componente personalizado '<evento-card>' configurando sus atributos
        filtrados.forEach(ev => {
            const card = document.createElement('evento-card');
            card.setAttribute('codigo', ev.codigo || '');
            card.setAttribute('nombre', ev.nombre || '');
            card.setAttribute('categoria', ev.categoria || '');
            card.setAttribute('ciudad', ev.ciudad || '');
            card.setAttribute('fecha', ev.fecha || '');
            card.setAttribute('precio', ev.precio || '');
            card.setAttribute('imagen', ev.imagen || '');
            card.setAttribute('hora', ev.hora || '');
            card.setAttribute('descripcion', ev.descripcion || '');
            contenedorEventos.appendChild(card); // Añadimos la tarjeta construida a la grilla visible de la tienda
        });
    }

    // ====================
    // FUNCIÓN: renderCarrito()
    // ====================
    // Dibuja la lista pequeña de productos seleccionados dentro de la ventana lateral flotante del carrito
    function renderCarrito() {
        const carrito = StorageService.getCarrito();
        if (!listaCarrito) return;

        listaCarrito.innerHTML = ''; // Reseteamos la vista interna
        let acumulado = 0;
        let totalUnidades = 0;

        // Recorremos la cesta de compras para ir sumando montos e inyectando las filas en el HTML
        carrito.forEach(item => {
            totalUnidades += item.cantidad; // Suma unidades de boletas totales
            acumulado += item.precio * item.cantidad; // Multiplica precio unitario por cantidad comprada

            const div = document.createElement('div');
            div.className = 'itemCarrito';
            div.style = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;";
            div.innerHTML = `
                <div class="info">
                    <h4>${item.nombre}</h4>
                    <p>${item.cantidad} x $${item.precio.toLocaleString('es-CO')}</p>
                </div>
                <!-- Guardamos el código en data-codigo para poder saber cuál borrar si presionan la papelera -->
                <button class="btnEliminarItem" data-codigo="${item.codigo}" style="background:transparent; border:none; color:red; cursor:pointer;">
                    <i class="fa-solid fa-trash-can" data-codigo="${item.codigo}"></i>
                </button>
            `;
            listaCarrito.appendChild(div);
        });

        // Actualizamos los números de la burbuja roja flotante de la cabecera y el total general en dinero
        if (contadorCarrito) contadorCarrito.textContent = totalUnidades;
        if (totalCompra) totalCompra.textContent = `$${acumulado.toLocaleString('es-CO')}`;
    }

    // ====================
    // ESCUCHADOR GLOBAL: DETECTAR ADICIÓN AL CARRITO
    // ====================
    // Captura el evento personalizado lanzado por el botón de la tarjeta del componente 'components.js'
    document.addEventListener('agregar-carrito', (e) => {
        const { codigo, nombre, precio, imagen } = e.detail; // Extraemos los datos importantes que viajan pegados al evento
        let carrito = StorageService.getCarrito();// Recuperamos la bolsa de compras actual desde el LocalStorage
        const existe = carrito.find(item => item.codigo === codigo); // Verificamos si ya estaba metido en la bolsa

        if (existe) {
            existe.cantidad++; // Si ya existía, simplemente le sumamos una unidad extra
        } else {
            carrito.push({ codigo, nombre, precio, imagen, cantidad: 1 }); // Si es nuevo, lo registramos con cantidad 1
        }

        StorageService.saveCarrito(carrito); // Sincronizamos con el LocalStorage
        renderCarrito(); // Refrescamos la interfaz del carrito lateral
    });

    // ====================
    // EVENTO: REMOVER UN ÍTEM DESDE EL CARRITO
    // ====================
    if (listaCarrito) {
        listaCarrito.addEventListener('click', (e) => {
            const codigo = e.target.getAttribute('data-codigo'); // Atrapamos el código del botón de la papelera pulsado
            if (codigo) {
                let carrito = StorageService.getCarrito();
                carrito = carrito.filter(item => item.codigo !== codigo); // Filtra y expulsa el producto seleccionado de la bolsa
                StorageService.saveCarrito(carrito);
                renderCarrito();
            }
        });
    }

    // Controladores de apertura y cierre de pantallas modales alternando clases CSS '.oculto'
    if (abrirCarrito) abrirCarrito.addEventListener('click', () => { renderCarrito(); modalCarrito.classList.remove('oculto'); });
    if (cerrarCarrito) cerrarCarrito.addEventListener('click', () => modalCarrito.classList.add('oculto'));
    if (cerrarCompra) cerrarCompra.addEventListener('click', () => modalCompra.classList.add('oculto'));

    // ====================
    // EVENTO: COMPROBACIÓN DE TRANSACCIÓN (BOTÓN COMPRAR)
    // ====================
    if (btnComprar) {
        btnComprar.addEventListener('click', () => {
            const carrito = StorageService.getCarrito();
            if (carrito.length === 0) return alert('El carrito está vacío.'); // Bloqueo de seguridad: Evita facturar listas vacías
            modalCarrito.classList.add('oculto'); // Oculta la bolsa
            modalCompra.classList.remove('oculto'); // Abre el formulario final de facturación con datos del cliente
        });
    }

    // ====================
    // EVENTO: PROCESAR PAGO Y GENERAR TICKET (SUBMIT FACTURA)
    // ====================
    if (formCompra) {
        formCompra.addEventListener('submit', (e) => {
            e.preventDefault(); // Cancela la recarga automática del sitio
            const carrito = StorageService.getCarrito();// Recuperamos la bolsa de compras actual desde el LocalStorage

            // Construimos la estructura final de la factura de venta
            const nuevaCompra = {
                // Fabricamos un código aleatorio simulado uniendo el prefijo TK con un entero entre 10000 y 99000
                codigoTicket: "TK-" + Math.floor(Math.random() * 90000 + 10000),
                fecha: new Date().toLocaleDateString(), // Captura la fecha real del computador en formato legible
                cliente: {
                    nombre: document.getElementById('nombreCliente').value,
                    correo: document.getElementById('correo').value
                },
                productos: carrito,
                // .reduce() calcula la sumatoria limpia multiplicando el precio de cada ítem por su cantidad comprada
                total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0) //en esata línea se calcula el total de la compra sumando el precio de cada producto multiplicado por su cantidad
            };

            StorageService.saveCompra(nuevaCompra); // Almacenamos la venta en el histórico (Servirá para el panel de Admin)
            StorageService.saveCarrito([]); // Limpieza absoluta: Vaciamos la bolsa del cliente
            renderCarrito(); // Refrescamos el dibujo del carrito dejándolo en cero
            formCompra.reset(); // Reseteamos los campos de texto del formulario de compra
            modalCompra.classList.add('oculto'); // Escondemos la interfaz del formulario

            alert(`🎉 Compra exitosa. Ticket: ${nuevaCompra.codigoTicket} con un total de ${nuevaCompra.total} `); // Entregamos el comprobante visual al usuario
        });
    }

    // Activamos el filtrado reactivo instantáneo asociando el evento de cambio a los tres inputs superiores
    if (buscarEvento) buscarEvento.addEventListener('input', mostrarEventos);
    if (filtroCiudad) filtroCiudad.addEventListener('change', mostrarEventos);
    if (filtroCategoria) filtroCategoria.addEventListener('change', mostrarEventos);

    // Arranque coordinado del portal de cara al usuario final
    await cargarDepartamentos();
    mostrarEventos();
    renderCarrito();
});
