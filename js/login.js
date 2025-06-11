  /******************************Eviar datos para login***********************************************/ 

  function iniciarSesion()
  {
    const usuario = document.getElementById("correoL").value;
    const contraseña = document.getElementById("contraseñaL").value;

    if (!usuario || !contraseña) {
        mostrarMensaje("Por favor llena todos los campos.", 'warning');
        return;
      }

    fetch('php/api.php?action=iniciarSesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contraseña})
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            var user = {id: data.id, correo: data.correo, rol: data.rol}
            localStorage.setItem("usuario", JSON.stringify(user));
            mostrarMensaje(data.message, 'success'); // Mensaje de éxito
            if(data.rol!=1 && data.rol!=7){
              window.location.href= "dashboard_normal.html";
              //document.getElementById("puesto_usuario").textContent ="Coordinador Cobranza STAF";
            }
            if(data.rol==7){
              window.location.href= "dashboard_tecnico.html";
              //document.getElementById("puesto_usuario").textContent ="Coordinador Cobranza STAF";
            }
            if(data.rol==1){
              window.location.href= "dashboard_admin.html";
              //document.getElementById("puesto_usuario").value="Administrador";
            }
            else{
              window.location.href= data.redirect;
            }
        } else {
            mostrarMensaje(data.message, 'danger'); // Mensaje de error
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }


  document.addEventListener('DOMContentLoaded', () => {

    const form = document.getElementById("loginForm");

    form.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault(); // evita que se recargue la página
        iniciarSesion(); // tu función para login
      }
    });



  });



    /**********Mostrar mensaje personalizado de exito o error*******/
    function mostrarMensaje(mensaje, tipo) {
        const mensajeDiv = document.getElementById('mensaje');
        mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
      
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          mensajeDiv.innerHTML = '';
        }, 5000);
      } 

