import ReclamosTipos from '../database/reclamosTipos.js';
import dotenv from 'dotenv';

dotenv.config()

export default class ReclamosTiposService {
    constructor() {
        this.reclamosTipos = new ReclamosTipos()
    }

    obtenerTodos = async () => {
        const resultado = await this.reclamosTipos.obtenerTodos();
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'Error en el servidor' 
            };
        }
        return resultado;
    };
    
    obtenerPorId = async (idReclamoTipo) => {
        const resultado = await this.reclamosTipos.obtenerPorId(idReclamoTipo);
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
    };
    
    agregar = async (datos) => {
        const resultado = await this.reclamosTipos.agregar(datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar el reclamoTipo' 
            };
        }
        return resultado;
    };
    
    modificar = async (idReclamoTipo, datos) => {
        await this.obtenerPorId(idReclamoTipo)
        const resultado = await this.reclamosTipos.modificar(idReclamoTipo, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo modificar el reclamoTipo' 
            };
        }
        return resultado;
    };

}