// Importamos el servicio que maneja el almacenamiento del navegador
import { StorageService } from './storage.js';

// Creamos y exportamos el objeto que se encargará de "sembrar" los datos base
export const DataSeed = {
    // ====================
    // FUNCIÓN ASÍNCRONA: init()
    // ====================
    // Lleva el prefijo 'async' porque hace una petición a un archivo externo que toma tiempo en cargar.
    async init() {
        // Validación de seguridad: Si al pedir los eventos nos regresa una lista vacía (largo igual a 0)...
        if (StorageService.getEventos().length === 0) {
            try {
                // Hacemos una petición en segundo plano para leer el archivo de configuración JSON de los eventos
                const respuesta = await fetch('json/eventos.json');
                
                // Si el archivo no existe o la ruta está mal escrita, disparamos un error que saltará al bloque 'catch'
                if (!respuesta.ok) throw new Error('No se pudo leer el archivo de eventos iniciales.');
                
                // Transformamos el texto plano del archivo JSON en un arreglo de objetos JavaScript real
                const eventosIniciales = await respuesta.json();
                
                // Guardamos todos los eventos iniciales en el LocalStorage a través de nuestro servicio
                StorageService.saveEventos(eventosIniciales);
                console.log('🚀 100 eventos cargados dinámicamente desde el JSON al LocalStorage.');
            } catch (error) {
                // Si la red falla, el archivo se borra o hay un error de sintaxis, se captura aquí sin congelar la app
                console.error('❌ Error al inicializar los datos semilla:', error);
            }
        }
    }
};
