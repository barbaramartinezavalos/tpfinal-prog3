import Usuarios from "../database/usuario.js";
import { email } from "../v1/urlPages/url.js";
import nodemailer from 'nodemailer';
import handlebars from "handlebars";
import dotenv from 'dotenv';
import bcryptjs from "bcryptjs" 

dotenv.config()

export default class UsuariosService {
    constructor() {
        this.usuarios = new Usuarios()
    }

    obtenerTodos = async (idUsuarioTipo = 0) => {
        const resultado = await this.usuarios.obtenerTodos(idUsuarioTipo);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'Error en el servidor' 
            };
        }
        return resultado;
    }

    obtenerPorId = async (idUsuario, idUsuarioTipo = 0) => {
        const resultado = await this.usuarios.obtenerPorId(idUsuario, idUsuarioTipo)
        if (!resultado) {
            throw { 
                estado: 404, 
                mensaje: 'ID no encontrado' 
            };
        } else if (resultado.estado) {
            throw { 
                estado: resultado.estado, 
                mensaje: resultado.mensaje 
            };
        }
        return resultado;
    }
    
    agregar = async (datos) => {
        // verificar si el email esta en uso
        await this.verificarEmail(datos.correoElectronico)

        // hashear contraseña
        const salt = await bcryptjs.genSalt(5);
        const constraseñaHasheada = await bcryptjs.hash(datos.contrasenia, salt);
        datos.contrasenia = constraseñaHasheada;

        const resultado = await this.usuarios.agregar(datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar el usuario' 
            };
        }
        return resultado;
    };

    modificar = async (idUsuario, datos) => {
        // verificar si el email esta en uso
        await this.verificarEmail(datos.correoElectronico);
        
        // hashear contraseña si es necesario
        if (datos.contrasenia) {
            const salt = await bcryptjs.genSalt(5);
            const constraseniaHasheada = await bcryptjs.hash(datos.contrasenia, salt);
            datos.contrasenia = constraseniaHasheada;
        };

        const resultado = await this.usuarios.modificar(idUsuario, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo modificar el usuario' 
            };
        }
        return resultado;
    };

    verificarEmail = async (correoElectronico) => {
        const resultado = await this.usuarios.obtenerPorEmail(correoElectronico);
        if (resultado && resultado.estado) {
            throw { 
                estado: resultado.estado, 
                mensaje: resultado.mensaje 
            };
        } else if (resultado) {
            throw { 
                estado: 400, 
                mensaje: `El email está en uso` 
            };
        }
    }
}