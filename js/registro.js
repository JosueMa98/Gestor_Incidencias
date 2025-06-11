function mostrarRoles() 
{
  fetch('php/api.php?action=obtenerRoles') //asignar la ruta para pedir los datos, action=roles para indicar en el back que funcion sera la ejecutada
    .then(response => {        //primer promesa de respuesta
      if (!response.ok) {     //validar si la respuesta no es correcta
        throw new Error('Error al obtener los roles');
      }
      return response.json();  // convierte la respuesta del back a un formato js para usar los datos
    })    //fin primer promesa

    .then(data => {       //segunda respuesta ya con el procesamiento de los datos     

      
      const select = document.getElementById('rolUsuarios');
      select.innerHTML = '<option value="">-- Selecciona un rol --</option>';
  
      if (data.length === 0) {
        const option = document.createElement('option');
        option.textContent = 'No hay roles disponibles';
        option.disabled = true;
        select.appendChild(option);
        return;
      }
  
      data.forEach(rol => {
        const option = document.createElement('option');
        option.value = rol.id;
        option.textContent = rol.nombre;
        select.appendChild(option);
      });
    })    //fin segunda promesa

    .catch(error => {
      console.error('Error:', error);
    });
}
/**********************************************************************************/ 


  document.addEventListener('DOMContentLoaded', function() {
    mostrarRoles(); // O cualquier otra función
  });


  /*********************************************************************************************/
  function enviarRegistroUsuario() {
    const correoInput = document.getElementById('correoR');
    const contraseñaInput = document.getElementById('contraseñaR');
    const rolInput = document.getElementById('rolUsuarios');
    let form = document.getElementById("registroForm");
  
    
    const correo = correoInput.value;
    const password = contraseñaInput.value;
    const rol = rolInput.value;

    
  
    if (!correo || !password || !rol) {
      mostrarMensaje("Por favor llena todos los campos.", 'warning');
      return;
    }

  
    fetch('php/api.php?action=registrarUsuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, password, rol })
      })
      .then(response => response.json())
      .then(data => {
        if (data.success) {
            mostrarMensaje("Usuario registrado exitosamente", 'success'); // Mensaje de éxito
            form.reset();
        } else {
            mostrarMensaje(data.message, 'danger'); // Mensaje de error
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  /**********Mostrar mensaje personalizado de exito o error*******/
  function mostrarMensaje(mensaje, tipo) {
    const mensajeDiv = document.getElementById('mensaje');
    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;
  
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      mensajeDiv.innerHTML = '';
    }, 5000);
  } 
  