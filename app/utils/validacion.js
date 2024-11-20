import Joi from "joi"

// Esquemas de validacion
const esquemas = {
    // Esquema de ID
    id: Joi.number().integer().positive().required(),

    // Esquema de descripcion
    descripcion: Joi.string().required(),

    // Esquemas de usuario
    usuarioRequerido: Joi.object({
        nombre: Joi.string().required(),
        apellido: Joi.string().required(),
        correoElectronico: Joi.string().email().required(),
        contrasenia: Joi.string().required()
    }),
    usuarioOpcional: Joi.object({
        nombre: Joi.string(),
        apellido: Joi.string(),
        correoElectronico: Joi.string().email(),
        contrasenia: Joi.string()
    }),

    // Esquemas de oficina
    oficinaRequerida: Joi.object({
        nombre: Joi.string().required(),
        idReclamoTipo: Joi.number().integer().positive().required()
    }),
    oficinaOpcional: Joi.object({
        nombre: Joi.string(),
        idReclamoTipo: Joi.number().integer().positive()
    }),

    // Esquema de reclamo
    reclamo: Joi.object({
        asunto: Joi.string().required(),
        descripcion: Joi.string().allow(''),
        idReclamoTipo: Joi.number().integer().positive().required()
    })
}


// Funcion general para la validacion
const validar = (datos, tipo) => {
    const esquema = esquemas[tipo];
    const { error } = esquema.validate(datos);
    if (error) {
        throw { 
            estado: 400, 
            mensaje: error.message
        };
    }
}

export default validar