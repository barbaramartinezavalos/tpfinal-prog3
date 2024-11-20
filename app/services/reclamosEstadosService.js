import ReclamosEstados from '../database/reclamosEstados.js';

export default class ReclamosEstadosService {
    constructor() {
        this.reclamosEstados = new ReclamosEstados()
    }

    obtenerTodos = async () => {
        const resultado = await this.reclamosEstados.obtenerTodos();
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'Error en el servidor' 
            };
        }
        return resultado;
    };
    
    obtenerPorId = async (idReclamoEstado) => {
        const resultado = await this.reclamosEstados.obtenerPorId(idReclamoEstado);
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
        const resultado = await this.reclamosEstados.agregar(datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar el reclamoEstado' 
            };
        }
        return resultado;
    };
    
    modificar = async (idReclamoEstado, datos) => {
        await this.obtenerPorId(idReclamoEstado)
        const resultado = await this.reclamosEstados.modificar(idReclamoEstado, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo modificar el reclamoEstado' 
            };
        }
        return resultado;
    };
    

}