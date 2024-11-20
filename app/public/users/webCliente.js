
document.getElementById('reclamoCliente-form').addEventListener("submit", async (e) => {
    console.log( e.target.tipo)
    // console.log(e.target.tipo.selectedIndex + 1)
    e.preventDefault()
    try {
        const response = await fetch("http://localhost:3000/api/cliente/reclamo", {
            method: 'POST',
            headers:  {'Content-Type' : 'application/json'} ,
            body: JSON.stringify({
                tipo: e.target.tipo.value,
                asunto: e.target.asunto.value,
                descripcion: e.target.descripcion.value,
                activo: 1
            })
        })
        if (!response.ok) {
            console.log('Errooor')
        } else {
            obtenerReclamo()
        }
        
    } catch (error) {
        console.log(`El error es: ${error}`)
    }
})

document.getElementById('cerrarSesion').addEventListener("click", () => {
    document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    alert("Cookie eliminada");
    console.log("se apretó cerrar sesion")
    document.location.href = '/';
})

const obtenerReclamo = async () => {
    const response = await fetch("http://localhost:3000/api/cliente/reclamo")
    if (!response.ok) {
        console.log('Errooor')
    } else {
        const data = await response.json()
        // console.log(data.resultado2)
        const select = document.querySelector('#tipo')
        const tbody = document.querySelector('#tabla_datos')
        const tipos = []
        tbody.innerHTML = ''
        select.innerHTML = ''
        data.resultado2.forEach((dato) => {
            // console.log(dato.descripcion)
            if (!tipos.includes(dato.descripcion)) {
                tipos.push(dato.descripcion)
    
                const option = document.createElement('option')
                option.value = dato.descripcion
                option.textContent = dato.descripcion
                select.appendChild(option)
            } else {
                console.log('el elemento se repite')
            }
        })

        data.resultado.forEach((dato) => {
            const tr = document.createElement('tr')
            const tdAsunto = document.createElement('td')
            const tdDescripcion = document.createElement('td')
            const tdFechaCreado = document.createElement('td')
            const tdCancelar = document.createElement('td')
            const btnCancelar = document.createElement('button')
            
            tdAsunto.textContent = dato.asunto
            tdDescripcion.textContent = dato.descripcion
            tdFechaCreado.textContent = dato.fechaCreado
            btnCancelar.textContent = 'Cancelar'
            
            btnCancelar.addEventListener('click', async () => {
                await cancelarReclamo(dato.idReclamoEstado, tr)
            })

            tdCancelar.appendChild(btnCancelar)
            tr.appendChild(tdAsunto)
            tr.appendChild(tdDescripcion)
            tr.appendChild(tdFechaCreado)
            tr.appendChild(btnCancelar)
            tbody.appendChild(tr);
        })
    }
}
const cancelarReclamo = async (idReclamoEstado, reclamo) => {
    try {
        const response = await fetch(`http://localhost:3000/api/cliente/reclamo/${idReclamoEstado}`, {
            method: 'PATCH',
            headers:  {'Content-Type' : 'application/json'} ,
            body: JSON.stringify({
                descripcion: 'Cancelado',
                activo: 0
            })
            })
        if (!response) {
            console.log('Error al cancelar el reclamo')
        } else {
            alert(`Reclamo ${idReclamoEstado} cancelado correctamente`)
            
            reclamo.innerHTML = ''
        }
    } catch (error) {
        console.log('Error al cancelar el reclamo: ', error)
    }
    
}


obtenerReclamo()

document.getElementById("actualizar-perfil").addEventListener("submit", async (e) => {
    e.preventDefault()
    console.log('esta enviando los datos')
    try {
        const response = await fetch("http://localhost:3000/api/cliente/perfil/actualizar", {
            method: 'PATCH',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify({
                nombre: e.target.nombre.value,
                apellido: e.target.apellido.value,
                correoElectronico: e.target.correoElectronico.value,
                contraseña: e.target.contraseña.value
            })
        })
        if (!response.ok) {
            console.log('Errooor')
        } else {
            document.cookie = "jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            alert("Cookie eliminada");
            document.location.href = '/api/';
        }
    } catch (error) {
        console.log(`El error es: ${error}`)
    }
})

function opcionesTipoReclamo() {
    document.getElementById('tipo')
}