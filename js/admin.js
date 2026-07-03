import { StorageService } from './storage.js';
import { DataSeed } from './data-seed.js'; // Asegúrate de importar DataSeed en admin.js también

document.addEventListener('DOMContentLoaded', async () => {
    // Si entran directo al admin por URL sin pasar por el index, esto previene tablas vacías
    await DataSeed.init();

    const listaEventos = document.getElementById('listaEventos');
    const buscarAdmin = document.getElementById('buscarAdmin');
    const formEvento = document.getElementById('formEvento');
    const selectCiudadAdmin = document.getElementById('ciudad');

    const modalEvento = document.getElementById('modalEvento');
    const btnNuevoEvento = document.getElementById('nuevoEvento');
    const btnCerrarModal = document.getElementById('cerrarModal');

    const totalEventosTxt = document.getElementById('totalEventos');
    const totalCategoriasTxt = document.getElementById('totalCategorias');
    const totalEntradasTxt = document.getElementById('totalEntradas');
    const ingresosTxt = document.getElementById('ingresos');

    // Variable de control para el modo edición
    let editandoCodigo = null;

    // --- CARGAR DEPARTAMENTOS EN EL SELECT DE CREACIÓN ---
    async function cargarDepartamentosAdmin() {
        if (!selectCiudadAdmin) return;
        try {
            const respuesta = await fetch('https://api-colombia.com/api/v1/Department');
            if (!respuesta.ok) throw new Error('Error en Admin API');

            const departamentos = await respuesta.json();
            departamentos.sort((a, b) => a.name.localeCompare(b.name));

            selectCiudadAdmin.innerHTML = '<option value="" disabled selected>Selecciona un Departamento</option>';
            departamentos.forEach(dep => {
                const option = document.createElement('option');
                option.value = dep.name;
                option.textContent = dep.name;
                selectCiudadAdmin.appendChild(option);
            });
        } catch (error) {
            console.error(error);
            selectCiudadAdmin.innerHTML = `
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Atlántico">Atlántico</option>
            `;
        }
    }

    function actualizarDashboard() {
        const eventos = StorageService.getEventos();
        const compras = StorageService.getCompras();

        const categoriasUnicas = [...new Set(eventos.map(ev => ev.categoria))].filter(c => c !== "");
        let totalEntradas = 0;
        let totalIngresos = 0;

        compras.forEach(c => {
            c.productos.forEach(p => totalEntradas += p.cantidad);
            totalIngresos += c.total;
        });

        if (totalEventosTxt) totalEventosTxt.textContent = eventos.length;
        if (totalCategoriasTxt) totalCategoriasTxt.textContent = categoriasUnicas.length;
        if (totalEntradasTxt) totalEntradasTxt.textContent = totalEntradas;
        if (ingresosTxt) ingresosTxt.textContent = `$${totalIngresos.toLocaleString('es-CO')}`;
    }

    function renderTablaAdmin() {
        if (!listaEventos) return;
        const eventos = StorageService.getEventos();
        const busqueda = buscarAdmin ? buscarAdmin.value.toLowerCase() : "";

        listaEventos.innerHTML = '';

        const filtrados = eventos.filter(ev =>
            ev.nombre.toLowerCase().includes(busqueda) ||
            ev.codigo.toLowerCase().includes(busqueda)
        );

        filtrados.forEach(ev => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><strong>${ev.codigo}</strong></td>
                <td>${ev.nombre}</td>
                <td>${ev.categoria}</td>
                <td>${ev.ciudad}</td>
                <td>${ev.fecha}</td>
                <td><strong>$${Number(ev.precio).toLocaleString('es-CO')}</strong></td>
                <td>
                    <button class="btnEditar" data-codigo="${ev.codigo}" style="background:none; border:none; color:#3498db; cursor:pointer; margin-right: 10px;">
                        <i class="fa-solid fa-pen-to-square" data-codigo="${ev.codigo}"></i>
                    </button>
                    <button class="btnEliminar" data-codigo="${ev.codigo}" style="background:none; border:none; color:red; cursor:pointer;">
                        <i class="fa-solid fa-trash" data-codigo="${ev.codigo}"></i>
                    </button>
                </td>
            `;
            listaEventos.appendChild(tr);
        });

        actualizarDashboard();
    }

    if (formEvento) {
        formEvento.addEventListener('submit', (e) => {
            e.preventDefault();

            const datosEvento = {
                codigo: document.getElementById('codigo').value,
                nombre: document.getElementById('nombre').value,
                categoria: document.getElementById('categoria').value,
                ciudad: document.getElementById('ciudad').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                precio: Number(document.getElementById('precio').value) || 0,
                imagen: document.getElementById('imagen').value || 'assets/img/evento1.jpg',
                descripcion: document.getElementById('descripcion').value
            };

            let eventos = StorageService.getEventos();

            if (editandoCodigo) {
                // Modo Edición
                eventos = eventos.map(ev => ev.codigo === editandoCodigo ? datosEvento : ev);
                StorageService.saveEventos(eventos);
                editandoCodigo = null;
                document.getElementById('codigo').disabled = false;
            } else {
                // Modo Creación
                if (eventos.some(ev => ev.codigo === datosEvento.codigo)) return alert('Código duplicado.');
                eventos.push(datosEvento);
                StorageService.saveEventos(eventos);
            }

            formEvento.reset();
            modalEvento.classList.add('oculto');
            
            // Reestablecer título del modal en caso de haberlo cambiado
            const tituloModal = modalEvento.querySelector('h2');
            if (tituloModal) tituloModal.textContent = 'Nuevo Evento';

            renderTablaAdmin();
        });
    }

    if (listaEventos) {
        listaEventos.addEventListener('click', (e) => {
            // Manejar click en Eliminar
            const btnEliminar = e.target.closest('.btnEliminar');
            if (btnEliminar) {
                const codigo = btnEliminar.getAttribute('data-codigo');
                if (codigo && confirm(`¿Eliminar evento ${codigo}?`)) {
                    let eventos = StorageService.getEventos();
                    eventos = eventos.filter(ev => ev.codigo !== codigo);
                    StorageService.saveEventos(eventos);
                    renderTablaAdmin();
                }
                return;
            }

            // Manejar click en Editar
            const btnEditar = e.target.closest('.btnEditar');
            if (btnEditar) {
                const codigo = btnEditar.getAttribute('data-codigo');
                const eventos = StorageService.getEventos();
                const eventoAEditar = eventos.find(ev => ev.codigo === codigo);

                if (eventoAEditar) {
                    editandoCodigo = codigo;

                    // Rellenar el formulario
                    document.getElementById('codigo').value = eventoAEditar.codigo;
                    document.getElementById('codigo').disabled = true; // No permitir cambiar código
                    document.getElementById('nombre').value = eventoAEditar.nombre;
                    document.getElementById('categoria').value = eventoAEditar.categoria;
                    document.getElementById('ciudad').value = eventoAEditar.ciudad;
                    document.getElementById('fecha').value = eventoAEditar.fecha;
                    document.getElementById('hora').value = eventoAEditar.hora || '';
                    document.getElementById('precio').value = eventoAEditar.precio;
                    document.getElementById('imagen').value = eventoAEditar.imagen || '';
                    document.getElementById('descripcion').value = eventoAEditar.descripcion || '';

                    const tituloModal = modalEvento.querySelector('h2');
                    if (tituloModal) tituloModal.textContent = 'Editar Evento';

                    modalEvento.classList.remove('oculto');
                }
            }
        });
    }

    if (btnNuevoEvento) {
        btnNuevoEvento.addEventListener('click', () => {
            editandoCodigo = null;
            formEvento.reset();
            document.getElementById('codigo').disabled = false;
            
            const tituloModal = modalEvento.querySelector('h2');
            if (tituloModal) tituloModal.textContent = 'Nuevo Evento';
            
            modalEvento.classList.remove('oculto');
        });
    }
    
    if (btnCerrarModal) {
        btnCerrarModal.addEventListener('click', () => {
            formEvento.reset();
            document.getElementById('codigo').disabled = false;
            modalEvento.classList.add('oculto');
        });
    }
    
    if (buscarAdmin) buscarAdmin.addEventListener('input', renderTablaAdmin);

    await cargarDepartamentosAdmin();
    renderTablaAdmin();
});