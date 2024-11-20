### Programacion III
# Trabajo Práctico Integrador

### Integrantes:
- Alvarez Yamil
- Barsi Franco
- Martinez Avalos Barbara
- Milesi Agustin
- Moran Syra
- Rodriguez Cabrera Sofia

## Inicialización de la Aplicación 
Primero agregar dentro de la carpeta de la API un archivo `.env` con los datos correspondientes.

Ejemplo de archivo:
```
PUERTO=3000
DB_HOST=localhost
DB_USER=root
DB_NAME=tp_prog
JWT_SECRET=textosecretoDECIFRADO
JWT_EXPIRATION=1h
CORREO=tucorreo@gmail.com
CLAVE=tuclave
```

Finalmente para iniciar la aplicación, ejecuta el comando: 
`npm run dev`

## Tecnologías y Librerías Utilizadas

La aplicación utiliza las siguientes tecnologías y librerías:

- **bcryptjs**: ^2.4.3
- **cookie-parser**: ^1.4.6
- **csv-writer**: ^1.6.0
- **dotenv**: ^16.4.5
- **express**: ^4.21.1 (incluye `express-mysql-session` y `express-session`)
- **handlebars**: ^4.7.8
- **install**: ^0.13.0
- **joi**: ^17.13.3
- **jsonwebtoken**: ^9.0.2
- **mysql2**: ^3.11.3
- **nodemailer**: ^6.9.15
- **passport**: ^0.7.0 (incluye `passport-jwt` y `passport-local`)
- **puppeteer**: ^23.6.1


## Endpoints

### Autenticación

- **POST /auth/login**
  - Descripción: Iniciar sesión.
  - Cuerpo de la solicitud:
    - `correoElectronico` (requerido): Correo electrónico del usuario.
    - `contrasenia` (requerido): Contraseña del usuario.

### Usuarios

- **POST /api/usuarios/registro**
  - Descripción: Registrar un nuevo usuario.
  - Cuerpo de la solicitud:
    - `nombre` (requerido): Nombre del usuario.
    - `apellido` (requerido): Apellido del usuario.
    - `correoElectronico` (requerido): Correo electrónico del usuario.
    - `contrasenia` (requerido): Contraseña del usuario.

- **PATCH /api/usuarios/actualizar-perfil**
  - Descripción: Actualizar el perfil del usuario que tiene la sesión iniciada.
  - Cuerpo de la solicitud:
    - `nombre` (opcional): Nombre del usuario.
    - `apellido` (opcional): Apellido del usuario.
    - `correoElectronico` (opcional): Correo electrónico del usuario.
    - `contrasenia` (opcional): Contraseña del usuario.

### Oficinas

- **GET /api/oficinas**
  - Descripción: Obtener todas las oficinas.

- **GET /api/oficinas/informe**
  - Descripción: Obtener el informe de cantidad de usuarios por oficina.

- **GET /api/oficinas/:idOficina**
  - Descripción: Obtener una oficina por su ID.
  - Parámetros:
    - `idOficina` (requerido): ID de la oficina.

- **POST /api/oficinas/**
  - Descripción: Crear una nueva oficina.
  - Cuerpo de la solicitud:
    - `nombre` (requerido): Nombre de la oficina.
    - `idReclamoTipo` (requerido): ID del tipo de reclamo que atiende la oficina.

- **PATCH /api/oficinas/:idOficina**
  - Descripción: Actualizar una oficina por su ID.
  - Parámetros:
    - `idOficina` (requerido): ID de la oficina.
  - Cuerpo de la solicitud:
    - `nombre` (opcional): Nombre de la oficina.
    - `idReclamoTipo` (opcional): ID del tipo de reclamo que atiende la oficina.

- **POST /api/oficinas/agregar-empleados**
  - Descripción: Agregar empleados a una oficina.
  - Cuerpo de la solicitud:
    - `idOficina` (requerido): ID de la oficina.
    - `listaIdEmpleados` (requerido): Lista de IDs de empleados.

- **POST /api/oficinas/quitar-empleados**
  - Descripción: Quitar empleados de una oficina.
  - Cuerpo de la solicitud:
    - `idOficina` (requerido): ID de la oficina.
    - `listaIdEmpleados` (requerido): Lista de IDs de empleados.

### Reclamos

- **GET /api/reclamos**
  - Descripción: Obtener todos los reclamos.

- **GET /api/reclamos/informe**
  - Descripción: Obtener el informe de reclamos segun formato.
  - Parámetros:
    - `formato` (requerido): Formato del informe. Valores permitidos: `csv`, `pdf`

- **GET /api/reclamos/:idReclamo**
  - Descripción: Obtener un reclamo por su ID.
  - Parámetros:
    - `idReclamo` (requerido): ID del reclamo.

- **POST /api/reclamos/**
  - Descripción: Crear un nuevo reclamo.
  - Cuerpo de la solicitud:
    - `asunto` (requerido): Asunto del reclamo.
    - `descripcion` (requerido): Descripción del reclamo.
    - `idReclamoTipo` (requerido): ID del tipo de reclamo.

- **POST /api/reclamos/atencion**
  - Descripción: Atender un reclamo.
  - Parámetros:
    - `idReclamo` (requerido): ID del reclamo.
  - Cuerpo de la solicitud:
    - `idReclamoTipo` (requerido): ID del tipo de reclamo.

- **POST /api/reclamos/cancelacion**
  - Descripción: Cancelar un reclamo.
  - Parámetros:
    - `idReclamo` (requerido): ID del reclamo.

### Tipos de Reclamos

- **GET /api/reclamosTipos**
  - Descripción: Obtener todos los tipos de reclamos.

- **GET /api/reclamosTipos/:idReclamoTipo**
  - Descripción: Obtener un tipo de reclamo por su ID.
  - Parámetros:
    - `idReclamoTipo` (requerido): ID del tipo de reclamo.

- **POST /api/reclamosTipos/**
  - Descripción: Crear un nuevo tipo de reclamo.
  - Cuerpo de la solicitud:
    - `descripcion` (requerido): Descripción del tipo de reclamo.

- **PATCH /api/reclamosTipos/:idReclamoTipo**
  - Descripción: Actualizar un tipo de reclamo por su ID.
  - Parámetros:
    - `idReclamoTipo` (requerido): ID del tipo de reclamo.
  - Cuerpo de la solicitud:
    - `descripcion` (requerido): Descripción del tipo de reclamo.

### Estados de Reclamos

- **GET /api/reclamosEstados**
  - Descripción: Obtener todos los estados de reclamos.

- **GET /api/reclamosEstados/:idReclamoEstado**
  - Descripción: Obtener un estado de reclamo por su ID.
  - Parámetros:
    - `idReclamoEstado` (requerido): ID del estado de reclamo.

- **POST /api/reclamosEstados/**
  - Descripción: Crear un nuevo estado de reclamo.
  - Cuerpo de la solicitud:
    - `descripcion` (requerido): Descripción del estado de reclamo.

- **PATCH /api/reclamosEstados/:idReclamoEstado**
  - Descripción: Actualizar un estado de reclamo por su ID.
  - Parámetros:
    - `idReclamoEstado` (requerido): ID del estado de reclamo.
  - Cuerpo de la solicitud:
    - `descripcion` (requerido): Descripción del estado de reclamo.

### Empleados

- **GET /api/empleados**
  - Descripción: Obtener todos los empleados.

- **GET /api/empleados/:idUsuario**
  - Descripción: Obtener un empleado por su ID.
  - Parámetros:
    - `idUsuario` (requerido): ID del empleado.

- **POST /api/empleados/**
  - Descripción: Crear un nuevo empleado.
  - Cuerpo de la solicitud:
    - `nombre` (requerido): Nombre del empleado.
    - `apellido` (requerido): Apellido del empleado.
    - `correoElectronico` (requerido): Correo electrónico del empleado.
    - `contrasenia` (requerido): Contraseña del empleado.

