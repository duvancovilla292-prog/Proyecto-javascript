// =========================================================================
// EXAMEN 2: REPORTES DE VENTAS MENSUALES
// Integración exclusiva en el Panel Administrativo (admin.html)
// =========================================================================

import { StorageService } from './storage.js';

document.addEventListener('DOMContentLoaded', () => {
    // Si no estamos en la página del admin, detener la ejecución
    if (!document.getElementById('listaEventos') && !window.location.pathname.includes('admin.html')) return;

    // 1. Inyectar estilos para el formulario de reportes y totales
    const estilosReportes = document.createElement('style');
    estilosReportes.innerHTML = `
        .contenedor-filtros-reporte {
            background: var(--card);
            border: 1px solid var(--border);
            padding: 25px;
            border-radius: var(--radius);
            margin-bottom: 25px;
            display: flex; gap: 20px; align-items: flex-end; flex-wrap: wrap;
        }
        .control-filto-reporte {
            display: flex; flex-direction: column; gap: 8px; flex: 1; min-width: 150px;
        }
        .control-filto-reporte label { font-size: 14px; font-weight: 500; color: var(--gray); }
        .control-filto-reporte select {
            width: 100%; padding: 12px; border: none; border-radius: 10px;
            background: #18233E; color: white; font-size: 15px; outline: none;
        }
        .btn-generar-reporte {
            background: var(--primary); color: white; border: none; padding: 12px 30px;
            border-radius: 10px; font-weight: 600; font-size: 15px; cursor: pointer; transition: .3s;
            height: 48px;
        }
        .btn-generar-reporte:hover { background: #6d28d9; transform: translateY(-2px); }
        .total-general-reporte {
            margin-top: 20px; padding: 20px; background: rgba(6, 182, 212, 0.1);
            border: 1px solid var(--cyan); border-radius: 12px; display: flex;
            justify-content: space-between; align-items: center;
        }
        .total-general-reporte h3 { color: white; font-size: 18px; margin: 0; }
        .total-general-reporte span { color: var(--cyan); font-size: 24px; font-weight: 800; }
    `;
    document.head.appendChild(estilosReportes);

    // 2. Insertar opción de navegación en el Header del administrador
    const navMenu = document.querySelector('.menu');
    if (navMenu) {
        const enlaceReporte = document.createElement('a');
        enlaceReporte.href = '#seccionReportEMensual';
        enlaceReporte.textContent = 'Reporte Mensual';
        navMenu.appendChild(enlaceReporte);
    }

    // 3. Crear e inyectar el módulo completo de reporte en el HTML del panel
    const mainContainer = document.querySelector('main') || document.querySelector('.main') || document.body;
    const moduloReportesHtml = document.createElement('section');
    moduloReportesHtml.id = 'seccionReportEMensual';
    moduloReportesHtml.className = 'seccion';
    moduloReportesHtml.style.margin = '40px auto';
    moduloReportesHtml.style.width = '90%';
    
    // Calcular dinámicamente los años del select (Año actual y anteriores)
    const anioActual = new Date().getFullYear();
    
    moduloReportesHtml.innerHTML = `
        <div class="tituloSeccion" style="margin-bottom:20px;">
            <h2><i class="fa-solid fa-chart-line"></i> Reporte de Ventas Mensuales</h2>
            <p>Selecciona un mes y año para auditar las entradas vendidas y totalizar los ingresos consolidados.</p>
        </div>

        <div class="contenedor-filtros-reporte">
            <div class="control-filto-reporte">
                <label for="repAnio">Año Fiscal</label>
                <select id="repAnio">
                    <option value="${anioActual}">${anioActual}</option>
                    <option value="${anioActual - 1}">${anioActual - 1}</option>
                </select>
            </div>
            <div class="control-filto-reporte">
                <label for="repMes">Mes del Reporte</label>
                <select id="repMes">
                    <option value="0">Enero</option>
                    <option value="1">Febrero</option>
                    <option value="2">Marzo</option>
                    <option value="3">Abril</option>
                    <option value="4">Mayo</option>
                    <option value="5">Junio</option>
                    <option value="6">Julio</option>
                    <option value="7">Agosto</option>
                    <option value="8">Septiembre</option>
                    <option value="9">Octubre</option>
                    <option value="10">Noviembre</option>
                    <option value="11">Diciembre</option>
                </select>
            </div>
            <button class="btn-generar-reporte" id="btnCalcularReporte"><i class="fa-solid fa-gears"></i> Procesar Filtro</button>
        </div>

        <div class="panelTabla">
            <table>
                <thead>
                    <tr>
                        <th>Código Evento</th>
                        <th>Nombre del Evento</th>
                        <th style="text-align: center;">Entradas Vendidas</th>
                        <th style="text-align: right;">Ingresos Totales</th>
                    </tr>
                </thead>
                <tbody id="tablaReporteCuerpo">
                    <tr>
                        <td colspan="4" style="text-align:center; color:var(--gray);">Selecciona los parámetros de arriba y haz clic en Procesar Filtro.</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="contenedorTotalGeneral"></div>
    `;
    mainContainer.appendChild(moduloReportesHtml);

    // 4. Lógica de procesamiento y cálculo de datos agrupados
    const btnCalcular = document.getElementById('btnCalcularReporte');
    const selectAnio = document.getElementById('repAnio');
    const selectMes = document.getElementById('repMes');
    const tablaCuerpo = document.getElementById('tablaReporteCuerpo');
    const contenedorTotal = document.getElementById('contenedorTotalGeneral');

    // Inicializar el select en el mes actual por comodidad del administrador
    selectMes.value = new Date().getMonth();

    function generarReporte() {
        const anioSeleccionado = parseInt(selectAnio.value);
        const mesSeleccionado = parseInt(selectMes.value);

        // Obtener historial de compras almacenadas en el Storage por tu sistema original
        const todasLasCompras = StorageService.getCompras();
        
        // Paso lógico 1 y 2: Filtrar compras que correspondan al mes y año elegidos
        const comprasFiltradas = todasLasCompras.filter(compra => {
            // Nota: Tus fechas se guardan como texto formateado local o ISO string. Convertimos con éxito:
            const partesFecha = compra.fecha.split('/'); 
            let fechaCompra;
            if (partesFecha.length === 3) {
                // Formato local dd/mm/aaaa
                fechaCompra = new Date(partesFecha[2], partesFecha[1] - 1, partesFecha[0]);
            } else {
                // Formato nativo ISO
                fechaCompra = new Date(compra.fecha);
            }
            return fechaCompra.getFullYear() === anioSeleccionado && fechaCompra.getMonth() === mesSeleccionado;
        });

        if (comprasFiltradas.length === 0) {
            tablaCuerpo.innerHTML = `<tr><td colspan="4" style="text-align:center; color:var(--secondary); font-weight:500; padding:30px;"><i class="fa-solid fa-circle-info"></i> No se encontraron registros de ventas ni tickets para el período seleccionado.</td></tr>`;
            contenedorTotal.innerHTML = '';
            return;
        }

        // Paso lógico 3 y 4: Recorrer los items y agrupar por código de evento utilizando un mapa de acumulación
        const acumuladoEventos = {};
        let granTotalMensual = 0;

        comprasFiltradas.forEach(compra => {
            // Si tu objeto original guarda las entradas en 'productos' o 'items'
            const tiquetes = compra.productos || compra.items || [];
            tiquetes.forEach(ticket => {
                const codigo = ticket.codigo || ticket.codigoEvento;
                const nombre = ticket.nombre || ticket.nombreEvento;
                const cantidad = parseInt(ticket.cantidad || 1);
                const precio = parseFloat(ticket.precio || 0);
                const subtotal = cantidad * precio;

                if (!acumuladoEventos[codigo]) {
                    acumuladoEventos[codigo] = {
                        codigo: codigo,
                        nombre: nombre,
                        cantidadTotal: 0,
                        valorTotal: 0
                    };
                }

                acumuladoEventos[codigo].cantidadTotal += cantidad;
                acumuladoEventos[codigo].valorTotal += subtotal;
                granTotalMensual += subtotal;
            });
        });

        // Paso lógico 5: Pintar el reporte acumulado en la tabla HTML
        tablaCuerpo.innerHTML = '';
        Object.values(acumuladoEventos).forEach(evt => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td style="color:var(--cyan); font-weight:600;">${evt.codigo}</td>
                <td style="color:white; font-weight:500;">${evt.nombre}</td>
                <td style="text-align: center; font-weight:600;">${evt.cantidadTotal} pcs</td>
                <td style="text-align: right; color:#10b981; font-weight:600;">$${evt.valorTotal.toLocaleString('es-CO')}</td>
            `;
            tablaCuerpo.appendChild(tr);
        });

        // Paso lógico 6: Inyectar la totalización general consolidada
        contenedorTotal.innerHTML = `
            <div class="total-general-reporte">
                <h3><i class="fa-solid fa-cash-register"></i> Recaudación Total Consolidad del Mes:</h3>
                <span>$${granTotalMensual.toLocaleString('es-CO')} COP</span>
            </div>
        `;
    }

    // Escuchar el click del botón procesar
    btnCalcular.addEventListener('click', generarReporte);
});