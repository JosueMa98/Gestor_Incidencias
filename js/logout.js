function cerrarSesion() {
    localStorage.removeItem("usuario"); // Borra solo el usuario
    // o usa localStorage.clear() si guardas más cosas
    window.location.href = "index.html"; // Redirige al login
  }