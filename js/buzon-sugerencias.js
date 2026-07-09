// =========================================================================
// EXAMEN 1: BUZÓN DE SUGERENCIAS
// Integración modular para vistas de Clientes (index.html) y Administrador (admin.html)
// =========================================================================

document.addEventListener('DOMContentLoaded', () => {
    
    // Inyección de Estilos CSS Coherentes con el Tema del Proyecto
    const estilosBuzon = document.createElement('style');
    estilosBuzon.innerHTML = `
        /* Botón Flotante Clientes */
        .btn-buzon-flotante {
            position: fixed;
            bottom: 25px;
            right: 25px;
            background: linear-gradient(135deg, var(--cyan), var(--primary));
            color: white;
            border: none;
            padding: 14px 22px;
            border-radius: 50px;
            font-family: 'Poppins', sans-serif;
            font-weight: 600;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 8px 25px rgba(6, 182, 212, 0.4);
            z-index: 999;
            display: flex;
            align-items: center;
            gap: 10px;
            transition: .3s ease;
        }
        .btn-buzon-flotante:hover {
            transform: translateY(-3px);
            box-shadow: 0 12px 30px rgba(124, 58, 237, 0.5);
        }
        /* Modal del Buzón */
        .modal-buzon {
            position: fixed;
            top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(5, 9, 22, 0.85);
            backdrop-filter: blur(10px);
            display: flex; justify-content: center; align-items: center;
            z-index: 2000; transition: opacity .3s ease;
        }
        .modal-buzon.oculto { display: none !important; }
        .modal-buzon-content {
            background: #0b1629;
            border: 1px solid var(--border);
            border-radius: var(--radius);
            width: 90%; max-width: 500px;
            padding: 35px; box-shadow: var(--shadow);
            position: relative; animation: aparecer .4s ease;
        }
        .modal-buzon h3 { font-size: 24px; margin-bottom: 10px; color: white; }
        .modal-buzon p { color: var(--gray); font-size: 14px; margin-bottom: 20px; }
        .form-buzon { display: flex; flex-direction: column; gap: 16px; }
        .form-buzon input, .form-buzon textarea {
            width: 100%; padding: 14px; border: 1px solid var(--border);
            border-radius: 12px; background: #111827; color: white;
            font-family: 'Poppins', sans-serif; outline: none; transition: .3s;
        }
        .form-buzon input:focus, .form-buzon textarea:focus { border-color: var(--cyan); }
        .form-buzon textarea { resize: none; min-height: 100px; }
        .btn-buzon-enviar {
            background: var(--primary); color: white; border: none; padding: 14px;
            border-radius: 12px; font-weight: 600; cursor: pointer; transition: .3s;
        }
        .btn-buzon-enviar:hover { background: #6d28d9; }
        .btn-buzon-cerrar {
            position: absolute; top: 20px; right: 20px; background: none;
            border: none; color: var(--gray); font-size: 20px; cursor: pointer;
        }
        /* Alertas */
        .alerta-buzon {
            padding: 12px; border-radius: 8px; text-align: center; font-size: 14px; font-weight: 500;
        }
        .alerta-exito { background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid #10b981; }
        .alerta-error { background: rgba(239, 68, 68, 0.15); color: #ef4444; border: 1px solid #ef4444; }
    `;
    document.head.appendChild(estilosBuzon);

    // DETERMINAR EN QUÉ VISTA ESTAMOS
    const esAdminView = document.getElementById('listaEventos') || document.getElementById('buscarAdmin') || window.location.pathname.includes('admin.html');

    if (!esAdminView) {
        // ==========================================
        // LÓGICA VISTA DE CLIENTES (INDEX)
        // ==========================================
        
        // 1. Crear el botón flotante e inyectarlo en el body
        const botonFlotante = document.createElement('button');
        botonFlotante.className = 'btn-buzon-flotante';
        botonFlotante.innerHTML = `<i class="fa-solid fa-comments"></i> Buzón de sugerencias`;
        document.body.appendChild(botonFlotante);

        // 2. Crear la estructura del modal del formulario e inyectarlo
        const modalHtml = document.createElement('div');
        modalHtml.className = 'modal-buzon oculto';
        modalHtml.id = 'modalBuzonCliente';
        modalHtml.innerHTML = `
            <div class="modal-buzon-content">
                <button class="btn-buzon-cerrar" id="cerrarBuzon">&times;</button>
                <h3>Buzón de Sugerencias</h3>
                <p>Tu opinión nos ayuda a mejorar la experiencia de tus conciertos.</p>
                <div id="mensajeBuzon" style="margin-bottom: 15px;"></div>
                <form class="form-buzon" id="formBuzonSugerencia">
                    <input type="text" id="buzonNombre" placeholder="Tu nombre completo">
                    <input type="email" id="buzonEmail" placeholder="Tu correo electrónico">
                    <textarea id="buzonMensaje" placeholder="Escribe aquí tu sugerencia o reclamo..."></textarea>
                    <button type="submit" class="btn-buzon-enviar">Enviar sugerencia</button>
                </form>
            </div>
        `;
        document.body.appendChild(modalHtml);

        // Selectores del DOM del módulo de clientes
        const modal = document.getElementById('modalBuzonCliente');
        const btnCerrar = document.getElementById('cerrarBuzon');
        const formulario = document.getElementById('formBuzonSugerencia');
        const mensajeContenedor = document.getElementById('mensajeBuzon');

        // Escuchar eventos de apertura y cierre
        botonFlotante.addEventListener('click', () => {
            mensajeContenedor.innerHTML = '';
            formulario.reset();
            modal.classList.remove('oculto');
        });
        btnCerrar.addEventListener('click', () => modal.classList.add('oculto'));

        // Guardar datos en LocalStorage
        formulario.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombre = document.getElementById('buzonNombre').value.trim();
            const email = document.getElementById('buzonEmail').value.trim();
            const mensaje = document.getElementById('buzonMensaje').value.trim();

            // Validaciones básicas solicitadas
            if (!nombre || !email || !mensaje) {
                mensajeContenedor.innerHTML = `<div class="alerta-buzon alerta-error"><i class="fa-solid fa-triangle-exclamation"></i> Todos los campos son obligatorios.</div>`;
                return;
            }

            // Obtener sugerencias anteriores
            const sugerenciasGuardadas = JSON.parse(localStorage.getItem('eventpass_sugerencias')) || [];
            
            // Crear el objeto con la estructura de datos sugerida
            const nuevaSugerencia = {
                id: Date.now(),
                nombre: nombre,
                email: email,
                mensaje: mensaje,
                fecha: new Date().toISOString()
            };

            sugerenciasGuardadas.push(nuevaSugerencia);
            localStorage.setItem('eventpass_sugerencias', JSON.stringify(sugerenciasGuardadas));

            // Mensaje de éxito
            mensajeContenedor.innerHTML = `<div class="alerta-buzon alerta-exito"><i class="fa-solid fa-circle-check"></i> ¡Sugerencia guardada correctamente! Gracias por apoyarnos.</div>`;
            formulario.reset();

            setTimeout(() => modal.classList.add('oculto'), 2000);
        });

    } else {
        // ==========================================
        // LÓGICA VISTA DE ADMINISTRADOR (ADMIN)
        // ==========================================
        
        // Agregar dinámicamente un enlace en el menú de navegación del Administrador
        const navMenu = document.querySelector('.menu');
        if (navMenu) {
            const enlaceBuzon = document.createElement('a');
            enlaceBuzon.href = '#moduloSugerencias';
            enlaceBuzon.innerHTML = `Sugerencias`;
            navMenu.appendChild(enlaceBuzon);
        }

        // Crear e inyectar el contenedor del módulo dentro del panel principal
        const mainContainer = document.querySelector('main') || document.querySelector('.main') || document.body;
        const seccionSugerencias = document.createElement('section');
        seccionSugerencias.id = 'moduloSugerencias';
        seccionSugerencias.style.margin = '40px auto';
        seccionSugerencias.style.width = '90%';
        seccionSugerencias.className = 'seccion';
        seccionSugerencias.innerHTML = `
            <div class="tituloSeccion" style="margin-bottom:20px;">
                <h2><i class="fa-solid fa-inbox"></i> Buzón de Sugerencias Recibidas</h2>
                <p>Monitorea y lee el feedback enviado por los clientes de la plataforma.</p>
            </div>
            <div class="panelTabla">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Cliente</th>
                            <th>Correo Electrónico</th>
                            <th>Sugerencia / Mensaje</th>
                        </tr>
                    </thead>
                    <tbody id="tablaSugerenciasAdmin">
                        <tr>
                            <td colspan="4" style="text-align:center; color:var(--gray);">No hay sugerencias registradas en el sistema.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
        mainContainer.appendChild(seccionSugerencias);

        // Función para pintar las sugerencias en la tabla
        function pintarSugerenciasAdmin() {
            const tabla = document.getElementById('tablaSugerenciasAdmin');
            if (!tabla) return;

            const sugerencias = JSON.parse(localStorage.getItem('eventpass_sugerencias')) || [];
            
            if (sugerencias.length === 0) {
                tabla.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--gray);">No hay sugerencias registradas en el sistema.</td></tr>`;
                return;
            }

            tabla.innerHTML = '';
            sugerencias.reverse().forEach(sug => {
                const tr = document.createElement('tr');
                const fechaLegible = new Date(sug.fecha).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' });
                tr.innerHTML = `
                    <td style="font-weight:600; color:var(--cyan);">${fechaLegible}</td>
                    <td style="color:white; font-weight:500;">${sug.nombre}</td>
                    <td><a href="mailto:${sug.email}" style="color:var(--gray); text-decoration:underline;">${sug.email}</a></td>
                    <td style="color:var(--text); max-width:400px; white-space:normal; line-height:1.5;">${sug.mensaje}</td>
                `;
                tabla.appendChild(tr);
            });
        }

        // Renderizar inmediatamente y escuchar cambios de hash o clicks en el menú
        pintarSugerenciasAdmin();
        window.addEventListener('hashchange', pintarSugerenciasAdmin);
        // Volver a pintar cada vez que se guarde algo en el storage desde otra pestaña
        window.addEventListener('storage', pintarSugerenciasAdmin);
    }
});