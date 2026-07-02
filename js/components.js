class EventoCard extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        const codigo = this.getAttribute('codigo');
        const nombre = this.getAttribute('nombre');
        const categoria = this.getAttribute('categoria');
        const ciudad = this.getAttribute('ciudad');
        const fecha = this.getAttribute('fecha');
        const precio = Number(this.getAttribute('precio'));
        const imagen = this.getAttribute('imagen');

        // Estructura HTML idéntica a tus tarjetas del index_3.html
        this.innerHTML = `
            <article class="evento" data-codigo="${codigo}">
                <img src="${imagen}" alt="${nombre}">
                <div class="contenidoEvento">
                    <span class="categoriaEvento">${categoria}</span>
                    <h3>${nombre}</h3>
                    <p><i class="fa-solid fa-location-dot"></i> ${ciudad}</p>
                    <p><i class="fa-solid fa-calendar"></i> ${fecha}</p>
                    <div class="precio">
                        <h2>$${precio.toLocaleString('es-CO')}</h2>
                        <button class="btnAgregarCarrito">Comprar</button>
                    </div>
                </div>
            </article>
        `;

        // Configurar el evento del botón Comprar
        this.querySelector('.btnAgregarCarrito').addEventListener('click', () => {
            const eventoCarrito = new CustomEvent('agregar-carrito', {
                detail: { codigo, nombre, precio, imagen },
                bubbles: true,
                composed: true
            });
            this.dispatchEvent(eventoCarrito);
        });
    }
}

// Registrar el componente en el navegador
customElements.define('evento-card', EventoCard);