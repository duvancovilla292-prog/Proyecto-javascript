// Definimos la clase de nuestro componente heredando las propiedades de un elemento HTML común
class EventoCard extends HTMLElement {
    // El constructor inicializa el componente en memoria
    constructor() {
        super(); // Llama obligatoriamente a la configuración del padre (HTMLElement)
    }

    // ====================
    // CICLO DE VIDA: connectedCallback()
    // ====================
    // Esta función se ejecuta sola cuando la etiqueta se dibuja de forma real en la pantalla.
    connectedCallback() {
        // Extraemos los datos guardados dentro de los atributos de la propia etiqueta HTML
        const codigo = this.getAttribute('codigo');
        const nombre = this.getAttribute('nombre');
        const categoria = this.getAttribute('categoria');
        const ciudad = this.getAttribute('ciudad');
        const fecha = this.getAttribute('fecha');
        const hora = this.getAttribute('hora');
        const descripcion = this.getAttribute('descripcion');
        const precio = Number(this.getAttribute('precio')); // Convertimos el texto del precio a un número real
        const imagen = this.getAttribute('imagen');

        // Construimos e inyectamos la estructura HTML interna de la tarjeta usando comillas invertidas ``
        this.innerHTML = `
            <article class="evento" data-codigo="${codigo}">
                <img src="${imagen}" alt="${nombre}">
                <div class="contenidoEvento">
                    <span class="categoriaEvento">${categoria}</span>
                    <h3>${nombre}</h3>
                    <p><i class="fa-solid fa-location-dot"></i> ${ciudad}</p>
                    <p><i class="fa-solid fa-calendar"></i> ${fecha} a las ${hora} </p>
                    <p>${descripcion}</p>
                    <div class="precio">
                        <h2>$${precio.toLocaleString('es-CO')}</h2> <!-- Da formato de dinero colombiano automáticamente -->
                        <button class="btnAgregarCarrito">Añadir al carrito</button>
                    </div>
                </div>
            </article>
        `;

        // ====================
        // MANEJO DEL EVENTO DE COMPRA
        // ====================
        // Buscamos el botón interno que acabamos de crear dentro de esta tarjeta
        this.querySelector('.btnAgregarCarrito').addEventListener('click', () => {
            // Creamos un evento personalizado personalizado para avisar a otros archivos de la compra
            const eventoCarrito = new CustomEvent('agregar-carrito', {
                detail: { codigo, nombre, precio, imagen }, // Datos importantes que viajan pegados al evento
                bubbles: true,    // Permite que el evento suba por el árbol HTML como una burbuja hasta llegar al documento global
                composed: true   // Permite que el evento atraviese estructuras complejas de componentes web
            });
            // Lanzamos el evento al espacio global para que 'main.js' lo escuche
            this.dispatchEvent(eventoCarrito);
        });
    }
}

// Registramos de forma oficial la nueva etiqueta en el navegador vinculándola con la clase de arriba
customElements.define('evento-card', EventoCard);
