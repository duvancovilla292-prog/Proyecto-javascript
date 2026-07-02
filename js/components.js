class EventoCard extends HTMLElement {
    connectedCallback() {
        const codigo = this.getAttribute('codigo') || '';
        const nombre = this.getAttribute('nombre') || '';
        const categoria = this.getAttribute('categoria') || '';
        const ciudad = this.getAttribute('ciudad') || '';
        const fecha = this.getAttribute('fecha') || '';
        const precio = Number(this.getAttribute('precio')) || 0;
        const imagen = this.getAttribute('imagen') || 'assets/img/evento1.jpg';

        this.innerHTML = `
            <article class="evento">
                <img src="${imagen}" alt="${nombre}">
                <div class="contenidoEvento">
                    <span class="categoriaEvento">${categoria}</span>
                    <h3>${nombre}</h3>
                    <p><i class="fa-solid fa-location-dot"></i> ${ciudad}</p>
                    <p><i class="fa-solid fa-calendar"></i> ${fecha}</p>
                    <div class="precio">
                        <h2>$${precio.toLocaleString('es-CO')}</h2>
                        <button class="btnAgregar" data-codigo="${codigo}">Comprar</button>
                    </div>
                </div>
            </article>
        `;

        // Lógica de escucha interna para añadir al carrito
        this.querySelector('.btnAgregar').addEventListener('click', () => {
            this.dispatchEvent(new CustomEvent('agregar-carrito', {
                bubbles: true,
                detail: { codigo, nombre, precio, imagen }
            }));
        });
    }
}

customElements.define('evento-card', EventoCard);