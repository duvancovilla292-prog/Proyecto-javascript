import { StorageService } from './storage.js';

export const DataSeed = {
    async init() {
        // Comprobar si el localStorage de eventos está vacío
        if (StorageService.getEventos().length === 0) {
            try {
                // Hacer la petición HTTP relativa al archivo JSON
                const respuesta = await fetch('json/eventos.json');
                if (!respuesta.ok) throw new Error('No se pudo leer el archivo de eventos iniciales.');
                
                const eventosIniciales = await respuesta.json();
                
                // Guardar los 100 eventos base en el LocalStorage
                StorageService.saveEventos(eventosIniciales);
                console.log('🚀 100 eventos cargados dinámicamente desde el JSON al LocalStorage.');
            } catch (error) {
                console.error('❌ Error al inicializar los datos semilla:', error);
            }
        }
    }
};
