import ReclamosEstadosService from "../services/reclamosEstadosService.js";
import validar from "../utils/validacion.js";
import dotenv from 'dotenv';

dotenv.config()

export default class ReclamosEstadosController {
    constructor() {
        this.service = new ReclamosEstadosService()
    }

    obtenerTodos = async (req, res) => {
        try {
            const estadosObtenidos = await this.service.obtenerTodos()
            return res.status(200).json(estadosObtenidos);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    };
    
    obtenerPorId = async (req, res) => {
        try {
            const id = req.params.idReclamoEstado;
            validar(id, 'id');

            const estadoObtenido = await this.service.obtenerPorId(id);
            return res.status(200).json(estadoObtenido);
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
            
            const nuevoEstado = await this.service.agregar(datos);
            return res.status(200).json(nuevoEstado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    modificar = async (req, res) => {
        try {
            const id = req.params.idReclamoEstado;
            validar(id, 'id');

            const datos = req.body;
            validar(datos.descripcion, 'descripcion');
            
            const estadoModificado = await this.service.modificar(id, datos);
            return res.status(200).json(estadoModificado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }

}