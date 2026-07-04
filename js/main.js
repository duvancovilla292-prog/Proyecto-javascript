import { StorageService } from './storage.js';
import { DataSeed } from './data-seed.js';

document.addEventListener('DOMContentLoaded', async () => {
    await DataSeed.init(); 

    // Referencias DOM - Interfaz General
    const contenedorEventos = document.getElementById('contenedorEventos');
    const buscarEvento = document.getElementById('buscarEvento');
    const filtroCiudad = document.getElementById('filtroCiudad');
    const filtroCategoria = document.getElementById('filtroCategoria');

    // Referencias DOM - Modales y Carrito
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

    // --- CARGAR DEPARTAMENTOS DESDE LA API ---
    async function cargarDepartamentos() {
        if (!filtroCiudad) return;
        try {
            const respuesta = await fetch('https://api-colombia.com/api/v1/Department');
            if (!respuesta.ok) throw new Error('Error al obtener los departamentos');
            
            const departamentos = await respuesta.json();
            
            filtroCiudad.innerHTML = '<option value="">Todas las regiones (Colombia)</option>';
            
            departamentos.sort((a, b) => a.name.localeCompare(b.name));

            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.name; 
                option.textContent = dep.name;
                filtroCiudad.appendChild(option);
            });
        } catch (error) {
            console.error('Hubo un problema con la API de Colombia:', error);
            // Fallback en caso de que la API falle para no romper la app
            filtroCiudad.innerHTML = `
                <option value="">Todas las regiones</option>
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Atlántico">Atlántico</option>
            `;
        }
    }

    // --- RENDERIZAR EVENTOS ---
    function mostrarEventos() {
        if (!contenedorEventos) return;
        const eventos = StorageService.getEventos();
        const busqueda = buscarEvento.value.toLowerCase();
        const ciudad = filtroCiudad.value;
        const categoria = filtroCategoria.value;

        contenedorEventos.innerHTML = '';

        const filtrados = eventos.filter(ev => {
            const coincideTexto = ev.nombre.toLowerCase().includes(busqueda);
            const coincideCiudad = ciudad === "" || ev.ciudad === ciudad;
            const coincideCategoria = categoria === "" || ev.categoria.toLowerCase() === categoria.toLowerCase();
            return coincideTexto && coincideCiudad && coincideCategoria;
        });

        if (filtrados.length === 0) {
            contenedorEventos.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #888; padding: 20px;">No se encontraron eventos para los filtros seleccionados.</p>`;
            return;
        }

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
            contenedorEventos.appendChild(card);
        });
    }

    // --- LOGICA DEL CARRITO ---
    function renderCarrito() {
        const carrito = StorageService.getCarrito();
        if (!listaCarrito) return;

        listaCarrito.innerHTML = '';
        let acumulado = 0;
        let totalUnidades = 0;

        carrito.forEach(item => {
            totalUnidades += item.cantidad;
            acumulado += item.precio * item.cantidad;

            const div = document.createElement('div');
            div.className = 'itemCarrito';
            div.style = "display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #eee;";
            div.innerHTML = `
                <div class="info">
                    <h4>${item.nombre}</h4>
                    <p>${item.cantidad} x $${item.precio.toLocaleString('es-CO')}</p>
                </div>
                <button class="btnEliminarItem" data-codigo="${item.codigo}" style="background:transparent; border:none; color:red; cursor:pointer;">
                    <i class="fa-solid fa-trash-can" data-codigo="${item.codigo}"></i>
                </button>
            `;
            listaCarrito.appendChild(div);
        });

        if (contadorCarrito) contadorCarrito.textContent = totalUnidades;
        if (totalCompra) totalCompra.textContent = `$${acumulado.toLocaleString('es-CO')}`;
    }

    document.addEventListener('agregar-carrito', (e) => {
        const { codigo, nombre, precio, imagen } = e.detail;
        let carrito = StorageService.getCarrito();
        const existe = carrito.find(item => item.codigo === codigo);

        if (existe) {
            existe.cantidad++;
        } else {
            carrito.push({ codigo, nombre, precio, imagen, cantidad: 1 });
        }

        StorageService.saveCarrito(carrito);
        renderCarrito();
    });

    if (listaCarrito) {
        listaCarrito.addEventListener('click', (e) => {
            const codigo = e.target.getAttribute('data-codigo');
            if (codigo) {
                let carrito = StorageService.getCarrito();
                carrito = carrito.filter(item => item.codigo !== codigo);
                StorageService.saveCarrito(carrito);
                renderCarrito();
            }
        });
    }

    // Modales listeners
    if (abrirCarrito) abrirCarrito.addEventListener('click', () => { renderCarrito(); modalCarrito.classList.remove('oculto'); });
    if (cerrarCarrito) cerrarCarrito.addEventListener('click', () => modalCarrito.classList.add('oculto'));
    if (cerrarCompra) cerrarCompra.addEventListener('click', () => modalCompra.classList.add('oculto'));

    if (btnComprar) btnComprar.addEventListener('click', () => {
        const carrito = StorageService.getCarrito();
        if (carrito.length === 0) return alert('El carrito está vacío.');
        modalCarrito.classList.add('oculto');
        modalCompra.classList.remove('oculto');
    });

    if (formCompra) {
        formCompra.addEventListener('submit', (e) => {
            e.preventDefault();
            const carrito = StorageService.getCarrito();

            const nuevaCompra = {
                codigoTicket: "TK-" + Math.floor(Math.random() * 90000 + 10000),
                fecha: new Date().toLocaleDateString(),
                cliente: {
                    nombre: document.getElementById('nombreCliente').value,
                    correo: document.getElementById('correo').value
                },
                productos: carrito,
                total: carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0)
            };

            StorageService.saveCompra(nuevaCompra);
            StorageService.saveCarrito([]);
            renderCarrito();
            formCompra.reset();
            modalCompra.classList.add('oculto');

            alert(`🎉 Compra exitosa. Ticket: ${nuevaCompra.codigoTicket}`);
        });
    }

    // Filtros en tiempo real
    if (buscarEvento) buscarEvento.addEventListener('input', mostrarEventos);
    if (filtroCiudad) filtroCiudad.addEventListener('change', mostrarEventos);
    if (filtroCategoria) filtroCategoria.addEventListener('change', mostrarEventos);

    // Inicialización Secuencial usando await
    await cargarDepartamentos();
    mostrarEventos();
    renderCarrito();
});