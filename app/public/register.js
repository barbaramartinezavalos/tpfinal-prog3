document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log('esta enviando los datos')
    try {
        const response = await fetch("http://localhost:3000/api/register", {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                nombre: e.target.nombre.value,
                apellido: e.target.apellido.value,
                correoElectronico: e.target.correoElectronico.value,
                contrasenia: e.target.contrasenia.value,
                descripcion: e.target.rol[rol.selectedIndex].value,
                imagen: 'imagen xd',
                activo: 1
            })
        })
        if (!response.ok) {
            console.log('Errooor')
        } else {
            const resultado = await response.json()
            window.location.href = resultado.redirect;
        }
    } catch (error) {
        console.log(`El error es: ${error}`)
    }
})