// Importamos los módulos de almacenamiento y el semillero de datos iniciales
import { StorageService } from './storage.js';
import { DataSeed } from './data-seed.js'; 

// Escuchamos la carga del HTML de manera asíncrona para poder usar peticiones de red 'await'
document.addEventListener('DOMContentLoaded', async () => {
    
    // Garantizamos que si entran directo al panel por URL, los 100 eventos base se carguen al LocalStorage de inmediato
    await DataSeed.init();

    // ====================
    // CAPTURA DE COMPONENTES DEL DOM
    // ====================
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

    // VARIABLE LLAVE CONTROL: Si vale null estamos creando un evento. Si guarda un texto, estamos editando ese código.
    let editandoCodigo = null;

    // ====================
    // FUNCIÓN: cargarDepartamentosAdmin()
    // ====================
    // Conecta con una API de internet real para traer los departamentos oficiales de Colombia al formulario
    async function cargarDepartamentosAdmin() {
        if (!selectCiudadAdmin) return; // Control de seguridad: Si el select no está en pantalla, cancela la ejecución
        try {
            const respuesta = await fetch('https://api-colombia.com/api/v1/Department');
            if (!respuesta.ok) throw new Error('Error en Admin API'); // Si el servidor externo falla, salta al catch

            const departamentos = await respuesta.json(); // Convierte los datos recibidos a arreglos de JS
            
            // Ordena alfabéticamente de la A a la Z usando localeCompare para respetar tildes y caracteres especiales
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
            // RESPALDO DE SEGURIDAD (FALLBACK): Si el internet falla, inyecta estas opciones por defecto para que la app siga operativa
            selectCiudadAdmin.innerHTML = `
                <option value="Cundinamarca">Cundinamarca</option>
                <option value="Antioquia">Antioquia</option>
                <option value="Atlántico">Atlántico</option>
            `;
        }
    }

    // ====================
    // FUNCIÓN: actualizarDashboard()
    // ====================
    // Realiza los cálculos matemáticos automáticos para actualizar las 4 tarjetas de estadísticas superiores
    function actualizarDashboard() {
        const eventos = StorageService.getEventos(); // Lee los eventos vigentes
        const compras = StorageService.getCompras(); // Lee el historial completo de ventas

        // Extrae categorías únicas filtrando textos vacíos y eliminando duplicados usando 'new Set()'
        const categoriesUnicas = [...new Set(eventos.map(ev => ev.categoria))].filter(c => c !== "");
        let totalEntradas = 0;
        let totalIngresos = 0;

        // Recorremos cada compra y sumamos los productos adquiridos por los clientes
        compras.forEach(c => {
            c.productos.forEach(p => totalEntradas += p.cantidad); // Suma las unidades físicas vendidas
            totalIngresos += c.total; // Acumula el dinero total recaudado
        });

        // Pintamos los resultados numéricos directamente en las tarjetas analíticas de la interfaz
        if (totalEventosTxt) totalEventosTxt.textContent = eventos.length;
        if (totalCategoriasTxt) totalCategoriasTxt.textContent = categoriesUnicas.length;
        if (totalEntradasTxt) totalEntradasTxt.textContent = totalEntradas;
        if (ingresosTxt) ingresosTxt.textContent = `$${totalIngresos.toLocaleString('es-CO')}`;
    }

    // ====================
    // FUNCIÓN: renderTablaAdmin()
    // ====================
    // Dibuja en pantalla la lista de todos los eventos con sus botones para Modificar o Eliminar
    function renderTablaAdmin() {
        if (!listaEventos) return;
        const eventos = StorageService.getEventos();
        const busqueda = buscarAdmin ? buscarAdmin.value.toLowerCase() : "";

        listaEventos.innerHTML = ''; // Limpiamos las filas viejas del HTML antes de redibujar

        // Filtramos en tiempo real comparando por nombre o por código único del show
        const filtrados = eventos.filter(ev =>
            ev.nombre.toLowerCase().includes(busqueda) ||
            ev.codigo.toLowerCase().includes(busqueda)
        );

        // Generamos dinámicamente las filas <tr> correspondientes con interpolación de strings
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
                    <!-- Guardamos el código del evento dentro del atributo 'data-codigo' para saber exactamente cuál editar o borrar -->
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

        actualizarDashboard(); // Recalcula las métricas del panel cada vez que la tabla sufre cambios
    }

    // ====================
    // EVENTO: PROCESAR FORMULARIO (SUBMIT)
    // ====================
    if (formEvento) {
        formEvento.addEventListener('submit', (e) => {
            e.preventDefault(); // Detiene el refresco automático de la página

            // Empaquetamos toda la información ingresada por el administrador en un objeto estructurado
            const datosEvento = {
                codigo: document.getElementById('codigo').value,
                nombre: document.getElementById('nombre').value,
                categoria: document.getElementById('categoria').value,
                ciudad: document.getElementById('ciudad').value,
                fecha: document.getElementById('fecha').value,
                hora: document.getElementById('hora').value,
                precio: Number(document.getElementById('precio').value) || 0, // Validamos conversión numérica limpia
                imagen: document.getElementById('imagen').value || 'assets/img/evento1.jpg', // Imagen de respaldo por defecto
                descripcion: document.getElementById('descripcion').value
            };

            let eventos = StorageService.getEventos();

            // DETERMINACIÓN DE FLUJO: ¿Estamos guardando una edición o un evento totalmente nuevo?
            if (editandoCodigo) {
                // MODO EDICIÓN: Recorre la lista; si encuentra el código modificado reemplaza el objeto viejo por 'datosEvento'
                eventos = eventos.map(ev => ev.codigo === editandoCodigo ? datosEvento : ev);
                StorageService.saveEventos(eventos);
                editandoCodigo = null; // Reinicia la variable de control a su estado por defecto
                document.getElementById('codigo').disabled = false; // Desbloquea el campo del código
            } else {
                // MODO CREACIÓN: Valida con .some() que el código nuevo no esté repetido en el sistema
                if (eventos.some(ev => ev.codigo === datosEvento.codigo)) return alert('Código duplicado.');
                eventos.push(datosEvento); // Agrega el objeto al final del arreglo
                StorageService.saveEventos(eventos);
            }

            formEvento.reset(); // Limpia todas las cajas de texto del formulario automáticamente
            modalEvento.classList.add('oculto'); // Oculta la ventana modal del formulario
            
            const tituloModal = modalEvento.querySelector('h2');
            if (tituloModal) tituloModal.textContent = 'Nuevo Evento'; // Reestablece el título original

            renderTablaAdmin(); // Redibuja de inmediato la tabla para reflejar los cambios
        });
    }

    // ====================
    // EVENTO DELEGADO: CLIC EN ACCIONES DE LA TABLA
    // ====================
    if (listaEventos) {
        listaEventos.addEventListener('click', (e) => {
            // DETECTAR EL BOTÓN ELIMINAR: .closest() busca el botón padre aunque el usuario pulse exactamente encima del ícono
            const btnEliminar = e.target.closest('.btnEliminar');
            if (btnEliminar) {
                const codigo = btnEliminar.getAttribute('data-codigo');
                if (codigo && confirm(`¿Eliminar evento ${codigo}?`)) {
                    let eventos = StorageService.getEventos();
                    // Filtra la lista excluyendo permanentemente el evento seleccionado
                    eventos = eventos.filter(ev => ev.codigo !== codigo);
                    StorageService.saveEventos(eventos);
                    renderTablaAdmin(); // Refresca los cambios en la pantalla
                }
                return; // Corta el flujo para evitar que evalúe la condición de editar accidentalmente
            }

            // DETECTAR EL BOTÓN EDITAR
            const btnEditar = e.target.closest('.btnEditar');
            if (btnEditar) {
                const codigo = btnEditar.getAttribute('data-codigo');
                const eventos = StorageService.getEventos();
                // Busca el evento exacto que coincida con el código de la fila usando .find()
                const eventoAEditar = eventos.find(ev => ev.codigo === codigo);

                if (eventoAEditar) {
                    editandoCodigo = codigo; // Bloquea la bandera de control guardando el código bajo edición

                    // Rellena exhaustivamente cada una de las cajas del formulario con los valores actuales del show
                    document.getElementById('codigo').value = eventoAEditar.codigo;
                    document.getElementById('codigo').disabled = true; // REGLA CRÍTICA: No permitimos alterar el código identificador
                    document.getElementById('nombre').value = eventoAEditar.nombre;
                    document.getElementById('categoria').value = eventoAEditar.categoria;
                    document.getElementById('ciudad').value = eventoAEditar.ciudad;
                    document.getElementById('fecha').value = eventoAEditar.fecha;
                    document.getElementById('hora').value = eventoAEditar.hora || '';
                    document.getElementById('precio').value = eventoAEditar.precio;
                    document.getElementById('imagen').value = eventoAEditar.imagen || '';
                    document.getElementById('descripcion').value = eventoAEditar.descripcion || '';

                    const tituloModal = modalEvento.querySelector('h2');
                    if (tituloModal) tituloModal.textContent = 'Editar Evento'; // Cambia el aspecto estético del encabezado

                    modalEvento.classList.remove('oculto'); // Muestra la ventana en pantalla
                }
            }
        });
    }

    // ====================
    // CONTROL DE VENTANAS MODALES (ABRIR / CERRAR)
    // ====================
    if (btnNuevoEvento) {
        btnNuevoEvento.addEventListener('click', () => {
            editandoCodigo = null; // Nos aseguramos de estar limpios en modo creación
            formEvento.reset();
            document.getElementById('codigo').disabled = false; // El código debe ser editable si es nuevo
            
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
    
    // Escucha la escritura en la barra buscadora para activar el filtrado instantáneo
    if (buscarAdmin) buscarAdmin.addEventListener('input', renderTablaAdmin);

    // Inicialización de arranque secuencial del sistema de control administrativo
    await cargarDepartamentosAdmin();
    renderTablaAdmin();
});
