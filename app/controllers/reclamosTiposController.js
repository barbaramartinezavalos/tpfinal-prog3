import ReclamosTiposService from "../services/reclamosTiposService.js";
import validar from "../utils/validacion.js";
import dotenv from 'dotenv';

dotenv.config()

export default class ReclamosTiposController {
    constructor() {
        this.service = new ReclamosTiposService()
    }

    obtenerTodos = async (req, res) => {
        try {
            const tiposObtenidos = await this.service.obtenerTodos()
            return res.status(200).json(tiposObtenidos);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    obtenerPorId = async (req, res) => {
        try {
            const id = req.params.idReclamoTipo;
            validar(id, 'id');

            const tipoObtenido = await this.service.obtenerPorId(id);
            return res.status(200).json(tipoObtenido);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }

    agregar = async (req, res) => {
        try {
            const datos = req.body;
            validar(datos.descripcion, 'descripcion');
            
            const nuevoTipo = await this.service.agregar(datos);
            return res.status(200).json(nuevoTipo);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    modificar = async (req, res) => {
        try {
            const id = req.params.idReclamoTipo;
            validar(id, 'id');

            const datos = req.body;
            validar(datos.descripcion, 'descripcion');
            
            const tipoModificado = await this.service.modificar(id, datos);
            return res.status(200).json(tipoModificado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }

}