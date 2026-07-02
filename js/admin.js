import { StorageService } from './storage.js';

document.addEventListener('DOMContentLoaded', async () => {
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

            const nuevo = {
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

            const eventos = StorageService.getEventos();
            if (eventos.some(ev => ev.codigo === nuevo.codigo)) return alert('Código duplicado.');

            eventos.push(nuevo);
            StorageService.saveEventos(eventos);
            
            formEvento.reset();
            modalEvento.classList.add('oculto');
            renderTablaAdmin();
        });
    }

    if (listaEventos) {
        listaEventos.addEventListener('click', (e) => {
            const codigo = e.target.getAttribute('data-codigo');
            if (codigo && confirm(`¿Eliminar evento ${codigo}?`)) {
                let eventos = StorageService.getEventos();
                eventos = eventos.filter(ev => ev.codigo !== codigo);
                StorageService.saveEventos(eventos);
                renderTablaAdmin();
            }
        });
    }

    if (btnNuevoEvento) btnNuevoEvento.addEventListener('click', () => modalEvento.classList.remove('oculto'));
    if (btnCerrarModal) btnCerrarModal.addEventListener('click', () => modalEvento.classList.add('oculto'));
    if (buscarAdmin) buscarAdmin.addEventListener('input', renderTablaAdmin);

    await cargarDepartamentosAdmin();
    renderTablaAdmin();
});