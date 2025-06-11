function mostrarMensajeEn(idDiv, mensaje, tipo = 'info') {
    let mensajeDiv = document.getElementById(idDiv);
    if (!mensajeDiv) return;

    mensajeDiv.innerHTML = `<div class="alert alert-${tipo}">${mensaje}</div>`;

    setTimeout(() => {
        mensajeDiv.innerHTML = '';
    }, 5000);
}