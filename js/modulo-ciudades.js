// =========================================================================
// EXAMEN 3: MÓDULO DINÁMICO DE CIUDADES (CRUD)
// Integración cruzada entre Almacenamiento, Admin y Filtros del Index
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // --- LOGICA DE ALMACENAMIENTO DE CIUDADES EN LOCALSTORAGE ---
    function obtenerCiudadesStorage() {
        const guardadas = localStorage.getItem('eventpass_ciudades_dinamicas');
        // Si no existen ciudades base, inicializar con una lista por defecto para no romper la experiencia inicial
        if (!guardadas) {
            const iniciales = [
                { id: 1, codigo: 'CUC', nombre: 'Cúcuta' },
                { id: 2, codigo: 'BOG', nombre: 'Bogotá' },
                { id: 3, codigo: 'MED', nombre: 'Medellín' },
                { id: 4, codigo: 'BUC', nombre: 'Bucaramanga' }
            ];
            localStorage.setItem('eventpass_ciudades_dinamicas', JSON.stringify(iniciales));
            return iniciales;
        }
        return JSON.parse(guardadas);
    }

    function guardarCiudadesStorage(lista) {
        localStorage.setItem('eventpass_ciudades_dinamicas', JSON.stringify(lista));
        // Disparar recarga de selectores dinámicos en la app
        actualizarTodosLosSelectsCiudades();
    }

    // --- FUNCIÓN ASÍNCRONA PARA INYECTAR LAS CIUDADES EN TODOS LOS SELECTS DEL DOM ---
    function actualizarTodosLosSelectsCiudades() {
        const ciudades = obtenerCiudadesStorage();
        
        // Elemento Filtro en la cartelera de clientes (index.html)
        const filtroCiudadCliente = document.getElementById('filtroCiudad');
        // Elemento Select en el Formulario del administrador (admin.html)
        const selectCiudadAdmin = document.getElementById('ciudad') || document.querySelector('#formEvento select[name="ciudad"]');

        // Poblar filtro del index
        if (filtroCiudadCliente) {
            const valorActual = filtroCiudadCliente.value;
            filtroCiudadCliente.innerHTML = `<option value="">Todas las ciudades</option>`;
            ciudades.forEach(ciu => {
                filtroCiudadCliente.innerHTML += `<option value="${ciu.nombre}">${ciu.nombre}</option>`;
            });
            filtroCiudadCliente.value = valorActual;
        }

        // Poblar select de creación de eventos en Admin
        if (selectCiudadAdmin) {
            selectCiudadAdmin.innerHTML = `<option value="">Seleccione una ciudad...</option>`;
            if (ciudades.length === 0) {
                selectCiudadAdmin.innerHTML = `<option value="">⚠️ Registre ciudades primero</option>`;
            } else {
                ciudades.forEach(ciu => {
                    selectCiudadAdmin.innerHTML += `<option value="${ciu.nombre}">${ciu.nombre} (${ciu.codigo})</option>`;
                });
            }
        }
    }

    // Ejecutar carga inicial automática de los selectores dinámicos
    actualizarTodosLosSelectsCiudades();

    // =========================================================================
    // RENDERIZADO DEL CRUD COMPLETO EN EL PANEL ADMINISTRATIVO
    // =========================================================================
    const esAdmin = document.getElementById('listaEventos') || window.location.pathname.includes('admin.html');
    if (!esAdmin) return;

    // Inyectar Estilos para el Sub-Modal de Ciudades
    const estilosCiudades = document.createElement('style');
    estilosCiudades.innerHTML = `
        .btn-accion-ciu { padding: 6px 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: 500; font-family: 'Poppins'; }
        .btn-edit-ciu { background: #eab308; color: black; margin-right: 8px; }
        .btn-del-ciu { background: #ef4444; color: white; }
        .modal-ciudad-formulario {
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5,9,22,0.9); backdrop-filter: blur(8px);
            display: flex; justify-content: center; align-items: center; z-index: 3000;
        }
        .modal-ciudad-formulario.oculto { display: none !important; }
    `;
    document.head.appendChild(estilosCiudades);

    // Agregar enlace de Ciudades en el menú superior izquierdo
    const navMenu = document.querySelector('.menu');
    if (navMenu) {
        const enlaceCiudades = document.createElement('a');
        enlaceCiudades.href = '#moduloCiudadesCRUD';
        enlaceCiudades.textContent = 'Ciudades';
        navMenu.appendChild(enlaceCiudades);
    }

    // Crear la vista de administración de ciudades debajo de la sección de eventos
    const mainContainer = document.querySelector('main') || document.querySelector('.main') || document.body;
    const seccionCiudades = document.createElement('section');
    seccionCiudades.id = 'moduloCiudadesCRUD';
    seccionCiudades.className = 'seccion';
    seccionCiudades.style.margin = '50px auto';
    seccionCiudades.style.width = '90%';
    seccionCiudades.innerHTML = `
        <div class="tituloSeccion" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; flex-wrap:wrap; gap:15px;">
            <div>
                <h2><i class="fa-solid fa-city"></i> Gestión de Ciudades</h2>
                <p>Administra las sedes operativas donde ejecutas conciertos y festivales.</p>
            </div>
            <button class="btnGenerar" id="btnAgregarCiudadDinamica" style="background:var(--cyan); font-weight:600; padding:12px 20px; border:none; border-radius:10px; cursor:pointer;"><i class="fa-solid fa-plus"></i> Nueva Ciudad</button>
        </div>

        <div class="panelTabla">
            <table>
                <thead>
                    <tr>
                        <th>ID Registro</th>
                        <th>Código (Acrónimo)</th>
                        <th>Nombre de la Ciudad</th>
                        <th style="text-align: center;">Acciones Operativas</th>
                    </tr>
                </thead>
                <tbody id="tablaCiudadesCuerpo"></tbody>
            </table>
        </div>

        <div class="modal-ciudad-formulario oculto" id="modalCiudadesCRUD">
            <div class="modal-buzon-content" style="max-width: 420px; background:#0b1629; padding: 30px; border-radius:20px; border: 1px solid var(--border); position:relative;">
                <button class="btn-buzon-cerrar" id="btnCerrarModalCiudad" style="position:absolute; top:15px; right:15px; background:none; border:none; color:white; font-size:22px; cursor:pointer;">&times;</button>
                <h3 id="tituloModalCiudad" style="margin-bottom: 15px;">Agregar Ciudad</h3>
                <form id="formCiudadesCRUD" class="form-buzon">
                    <input type="text" id="ciuCodigo" placeholder="Código (Ej: BOG, CUC, MED)" maxlength="5" style="text-transform: uppercase;">
                    <input type="text" id="ciuNombre" placeholder="Nombre completo de la ciudad">
                    <button type="submit" class="btn-buzon-enviar" id="btnGuardarCiudadForm" style="background:var(--cyan); color:black; font-weight:600;">Guardar Datos</button>
                </form>
            </div>
        </div>
    `;
    mainContainer.appendChild(seccionCiudades);

    // Selectores del DOM para el CRUD
    const tablaCuerpo = document.getElementById('tablaCiudadesCuerpo');
    const modalCiudad = document.getElementById('modalCiudadesCRUD');
    const btnNuevaCiudad = document.getElementById('btnAgregarCiudadDinamica');
    const btnCerrarModal = document.getElementById('btnCerrarModalCiudad');
    const formCiudad = document.getElementById('formCiudadesCRUD');
    const txtTituloModal = document.getElementById('tituloModalCiudad');

    let idCiudadEditando = null;

    // Pintar los datos del CRUD en la tabla
    function renderTablaCiudades() {
        const ciudades = obtenerCiudadesStorage();
        tablaCuerpo.innerHTML = '';

        if (ciudades.length === 0) {
            tablaCuerpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--gray); padding:20px;">No hay ciudades operativas registradas. El registro de eventos quedará deshabilitado.</td></tr>`;
            return;
        }

        ciudades.forEach(ciu => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>#${ciu.id}</td>
                <td style="font-weight:700; color:var(--cyan);">${ciu.codigo}</td>
                <td style="color:white; font-weight:500;">${ciu.nombre}</td>
                <td style="text-align: center;">
                    <button class="btn-accion-ciu btn-edit-ciu" data-id="${ciu.id}"><i class="fa-solid fa-pen-to-square"></i> Editar</button>
                    <button class="btn-accion-ciu btn-del-ciu" data-id="${ciu.id}"><i class="fa-solid fa-trash-can"></i> Eliminar</button>
                </td>
            `;
            tablaCuerpo.appendChild(tr);
        });
    }

    // Eventos para abrir modal
    btnNuevaCiudad.addEventListener('click', () => {
        idCiudadEditando = null;
        formCiudad.reset();
        txtTituloModal.textContent = "Agregar Nueva Ciudad";
        modalCiudad.classList.remove('oculto');
    });

    btnCerrarModal.addEventListener('click', () => modalCiudad.classList.add('oculto'));

    // Guardar / Editar Ciudad
    formCiudad.addEventListener('submit', (e) => {
        e.preventDefault();
        const codigo = document.getElementById('ciuCodigo').value.trim().toUpperCase();
        const nombre = document.getElementById('ciuNombre').value.trim();

        // Validaciones requeridas
        if (!codigo || !nombre) {
            alert('⚠️ El código y el nombre de la ciudad son completamente obligatorios.');
            return;
        }

        let ciudades = obtenerCiudadesStorage();

        if (idCiudadEditando === null) {
            // Guardar nueva ciudad
            const nuevaCiu = {
                id: Date.now(),
                codigo: codigo,
                nombre: nombre
            };
            ciudades.push(nuevaCiu);
        } else {
            // Guardar edición
            ciudades = ciudades.map(ciu => ciu.id === idCiudadEditando ? { ...ciu, codigo, nombre } : ciu);
        }

        guardarCiudadesStorage(ciudades);
        renderTablaCiudades();
        modalCiudad.classList.add('oculto');
    });

    // Delegar clicks de Editar y Eliminar dentro de la tabla
    tablaCuerpo.addEventListener('click', (e) => {
        const boton = e.target.closest('button');
        if (!boton) return;

        const id = parseInt(boton.dataset.id);
        let ciudades = obtenerCiudadesStorage();

        if (boton.classList.contains('btn-edit-ciu')) {
            const objetivo = ciudades.find(ciu => ciu.id === id);
            if (objetivo) {
                idCiudadEditando = id;
                document.getElementById('ciuCodigo').value = objetivo.codigo;
                document.getElementById('ciuNombre').value = objetivo.nombre;
                txtTituloModal.textContent = "Modificar Ciudad";
                modalCiudad.classList.remove('oculto');
            }
        }

        if (boton.classList.contains('btn-del-ciu')) {
            if (confirm('¿Estás seguro de que deseas eliminar esta sede de ciudad? Esto afectará los listados de eventos.')) {
                ciudades = ciudades.filter(ciu => ciu.id !== id);
                guardarCiudadesStorage(ciudades);
                renderTablaCiudades();
            }
        }
    });

    // Renderizado inicial del CRUD
    renderTablaCiudades();
});