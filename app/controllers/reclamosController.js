import ReclamosService from "../services/reclamosService.js";
import validar from "../utils/validacion.js"
import dotenv from 'dotenv';


dotenv.config()

export default class ReclamosController {
    constructor() {
        this.service = new ReclamosService()
    }

    obtenerTodos = async (req, res) => { 
        try {
            const { idUsuario, idUsuarioTipo } = req.user

            const reclamosObtenidos = await this.service.obtenerTodos(idUsuario, idUsuarioTipo);
            return res.status(200).json(reclamosObtenidos);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    };
    
    obtenerPorId = async (req, res) => {
        try {
            const { idUsuario, idUsuarioTipo } = req.user
            const idReclamo = req.params.idReclamo;
            validar(idReclamo, 'id');

            const reclamo = await this.service.obtenerPorId(idReclamo, idUsuario, idUsuarioTipo);
            return res.status(200).json(reclamo);
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
            validar(datos, 'reclamo');

            const { idUsuario } = req.user
            datos.idUsuarioCreador = idUsuario
            
            const nuevoReclamo = await this.service.agregar(datos);
            return res.status(200).json(nuevoReclamo);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }

    atenderReclamo = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo;
            validar(idReclamo, 'id');

            const datos = {
                idReclamoEstado: req.body.idReclamoEstado
            }
            validar(datos.idReclamoEstado, 'id');

            const { idUsuario } = req.user

            const reclamoAtendido = await this.service.atenderReclamo(idReclamo, datos, idUsuario);
            return res.status(200).json(reclamoAtendido);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    };

    cancelarReclamo = async (req, res) => {
        try {
            const idReclamo = req.params.idReclamo;
            validar(idReclamo, 'id');

            const { idUsuario } = req.user

            const reclamoAtendido = await this.service.cancelarReclamo(idReclamo, idUsuario);
            return res.status(200).json(reclamoAtendido);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    };
    
    informe = async (req, res) => {
        const formatosPermitidos = ['pdf', 'csv']
        try{
            const formato = req.query.formato.toLowerCase();
            
            if(!formato || !formatosPermitidos.includes(formato)){
                return res.status(400).send({
                    estado:"Falla",
                    mensaje: "Formato inválido para el informe."    
                })
            }
            const {buffer, path, headers} = await this.service.generarInforme(formato);

            res.set(headers)

            if (formato === 'pdf') {
                res.status(200).end(buffer);
            } else if (formato === 'csv') {
                res.status(200).download(path, (err) => {
                    if (err) {
                        return res.status(500).send({
                            estado:"Falla",
                            mensaje: " No se pudo generar el informe."    
                        })
                    }
                })
            }
        }catch(error){
            console.log(error)
            res.status(500).send({
                estado:"Falla", mensaje: "Error interno en servidor."
            });
        } 
    }
};