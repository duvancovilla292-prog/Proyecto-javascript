import { StorageService } from './storage.js';

const EVENTOS_SEMILLA = [
    {
        codigo: "EV-001",
        nombre: "Coldplay Music Tour",
        categoria: "Conciertos",
        ciudad: "Cundinamarca", // Bogotá pertenece a este departamento en la API principal
        fecha: "2026-10-18",
        hora: "20:00",
        precio: 350000,
        imagen: "assets/img/evento1.jpg",
        descripcion: "Disfruta del tour mundial más esperado del año en el Estadio El Campín."
    },
    {
        codigo: "EV-002",
        nombre: "Festival Colors",
        categoria: "Festivales",
        ciudad: "Antioquia",
        fecha: "2026-11-10",
        hora: "16:00",
        precio: 180000,
        imagen: "assets/img/evento2.jpg",
        descripcion: "El festival de colores y música electrónica más grande del país."
    },
    {
        codigo: "EV-003",
        nombre: "Final Liga Colombiana",
        categoria: "Deportes",
        ciudad: "Atlántico",
        fecha: "2026-12-05",
        hora: "18:30",
        precio: 210000,
        imagen: "assets/img/evento3.jpg",
        descripcion: "La gran definición por la estrella del fútbol profesional colombiano."
    }
];

export const DataSeed = {
    init() {
        if (StorageService.getEventos().length === 0) {
            StorageService.saveEventos(EVENTOS_SEMILLA);
        }
    }
};