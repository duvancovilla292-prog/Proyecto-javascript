// ====================
// CREDENCIALES FIJAS DE ADMINISTRACIÓN
// ====================
// Guardamos en un objeto los datos válidos para ingresar. Admite los nombres del equipo y pseudónimos como Ciel
const USUARIO_CREDENTIALS = {
    nombre1: "admin",
    nombre2: "Brayan",
    nombre: "Ciel",
    correo: "admin@mail.com",
    clave: "123456"
};

// Nos aseguramos de que el HTML esté completamente cargado en el navegador antes de activar el JS
document.addEventListener("DOMContentLoaded", () => {
    
    // Capturamos y guardamos en variables todos los elementos del HTML que vamos a manipular
    const formLogin = document.getElementById("formLogin");
    const inputUsuario = document.getElementById("usuario");
    const inputPassword = document.getElementById("password");
    const mensajeLogin = document.getElementById("mensajeLogin");
    const btnMostrarPassword = document.getElementById("mostrarPassword");

    // ==========================================
    // SECCIÓN: PROCESAMIENTO DEL LOGUEO (SUBMIT)
    // ==========================================
    formLogin.addEventListener("submit", (e) => {
        // ¡Súper Importante!: Frena el comportamiento automático del navegador para evitar que la página se refresque.
        e.preventDefault();

        // Obtenemos los valores de los inputs. .trim() borra espacios accidentales que el usuario deje al inicio o al final
        const usuarioIngresado = inputUsuario.value.trim();
        const passwordIngresada = inputPassword.value;

        // Validación condicional profunda (Revisa si coincide con cualquiera de los usuarios permitidos Y si la clave es la correcta)
        if ((usuarioIngresado === USUARIO_CREDENTIALS.nombre || usuarioIngresado === USUARIO_CREDENTIALS.correo || usuarioIngresado === USUARIO_CREDENTIALS.nombre1 || usuarioIngresado === USUARIO_CREDENTIALS.nombre2) && 
            passwordIngresada === USUARIO_CREDENTIALS.clave) {
            
            // CASO ÉXITO: Cambiamos el color de la caja a verde e inyectamos el mensaje con formato HTML
            mensajeLogin.style.color = "#2ecc71"; 
            mensajeLogin.innerHTML = `<p><i class="fa-solid fa-circle-check"></i> ¡Acceso concedido! Redireccionando...</p>`;

            // Buscamos el botón de inicio de sesión y lo congelamos (.disabled) para que el usuario no pueda hacer doble clic
            const btnSubmit = formLogin.querySelector(".btnLogin");
            if (btnSubmit) btnSubmit.disabled = true;

            // Esperamos un pequeño lapso de 1.5 segundos (1500 milisegundos) antes de mandar al usuario al panel de administración
            setTimeout(() => {
                window.location.href = "../admin.html"; // Redirección forzada de pantalla
            }, 1500);

        } else {
            // CASO ERROR: Pintamos la respuesta en color rojo e informamos del fallo en la pantalla
            mensajeLogin.style.color = "#e74c3c"; 
            mensajeLogin.innerHTML = `<p><i class="fa-solid fa-circle-exclamation"></i> Usuario o contraseña incorrectos.</p>`;
            
            // Limpieza de seguridad: Borramos la contraseña inválida y ponemos el cursor automáticamente en ese campo (.focus)
            inputPassword.value = "";
            inputPassword.focus();
        }
    });

    // ==========================================
    // SECCIÓN: MOSTRAR / OCULTAR CONTRASEÑA
    // ==========================================
    // Si el botón del ojo existe en la estructura HTML actual...
    if (btnMostrarPassword) {
        btnMostrarPassword.addEventListener("click", () => {
            const icono = btnMostrarPassword.querySelector("i"); // Atrapamos la etiqueta de ícono FontAwesome
            
            // Si el input está oculto como tipo 'password'...
            if (inputPassword.type === "password") {
                inputPassword.type = "text"; // Lo transformamos a tipo texto plano para que los caracteres sean legibles
                // Intercambiamos las clases CSS para modificar el dibujo del ojo por uno tachado
                icono.classList.remove("fa-eye");
                icono.classList.add("fa-eye-slash");
            } else {
                // Si el input ya era visible, lo volvemos a encriptar ocultando los caracteres
                inputPassword.type = "password";
                // Devolvemos el ícono original del ojo abierto
                icono.classList.remove("fa-eye-slash");
                icono.classList.add("fa-eye");
            }
        });
    }
});
