// 1. Objeto con las credenciales del usuario por defecto (No va a cambiar)
const USUARIO_CREDENTIALS = {
    nombre: "Ciel",
    correo: "ciel@eventpass.com",
    clave: "admin1234"
};

// 2. Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {
    
    // Captura de elementos del DOM basados en el HTML
    const formLogin = document.getElementById("formLogin");
    const inputUsuario = document.getElementById("usuario");
    const inputPassword = document.getElementById("password");
    const mensajeLogin = document.getElementById("mensajeLogin");
    const btnMostrarPassword = document.getElementById("mostrarPassword");

    // ==========================================
    // CONTROL DEL FORMULARIO (LOGIN)
    // ==========================================
    formLogin.addEventListener("submit", (e) => {
        // Evitar que la página se recargue al enviar el formulario
        e.preventDefault();

        const usuarioIngresado = inputUsuario.value.trim();
        const passwordIngresada = inputPassword.value;

        // Validar si coincide con el nombre o con el correo, y que la clave sea correcta
        if ((usuarioIngresado === USUARIO_CREDENTIALS.nombre || usuarioIngresado === USUARIO_CREDENTIALS.correo) && 
            passwordIngresada === USUARIO_CREDENTIALS.clave) {
            
            // Mensaje de éxito
            mensajeLogin.style.color = "#2ecc71"; // Verde éxito
            mensajeLogin.innerHTML = `<p><i class="fa-solid fa-circle-check"></i> ¡Acceso concedido! Redireccionando...</p>`;

            // Deshabilitar el botón para evitar múltiples clics
            const btnSubmit = formLogin.querySelector(".btnLogin");
            if (btnSubmit) btnSubmit.disabled = true;

            // Redireccionar a la vista de administración después de 1.5 segundos
            setTimeout(() => {
                window.location.href = "../admin.html";
            }, 1500);

        } else {
            // Mensaje de error si fallan las credenciales
            mensajeLogin.style.color = "#e74c3c"; // Rojo error
            mensajeLogin.innerHTML = `<p><i class="fa-solid fa-circle-exclamation"></i> Usuario o contraseña incorrectos.</p>`;
            
            // Limpiar el campo de contraseña por seguridad
            inputPassword.value = "";
            inputPassword.focus();
        }
    });

    // ==========================================
    // MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================
    if (btnMostrarPassword) {
        btnMostrarPassword.addEventListener("click", () => {
            const icono = btnMostrarPassword.querySelector("i");
            
            if (inputPassword.type === "password") {
                inputPassword.type = "text";
                // Cambiar el icono al ojo cerrado
                icono.classList.remove("fa-eye");
                icono.classList.add("fa-eye-slash");
            } else {
                inputPassword.type = "password";
                // Cambiar el icono al ojo abierto
                icono.classList.remove("fa-eye-slash");
                icono.classList.add("fa-eye");
            }
        });
    }
});
