import OficinasService from "../services/oficinasService.js";
import validar from "../utils/validacion.js";
import dotenv from 'dotenv';

dotenv.config()

export default class OficinasController {
    constructor() {
        this.service = new OficinasService()
    }

    obtenerTodos = async (req, res) => {
        try {
            const oficinasObtenidas = await this.service.obtenerTodos();
            return res.status(200).json(oficinasObtenidas);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    obtenerPorId = async (req, res) => {
        try {
            console.log(req.params)
            const id = req.params.idOficina;
            validar(id, 'id');

            const oficinaObtenida = await this.service.obtenerPorId(id);
            return res.status(200).json(oficinaObtenida);
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
            validar(datos, 'oficinaRequerida');
            
            const nuevaOficina = await this.service.agregar(datos);
            return res.status(200).json(nuevaOficina);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    modificar = async (req, res) => {
        try {
            const id = req.params.idOficina;
            validar(id, 'id');
            
            const datos = req.body;
            validar(datos, 'oficinaOpcional');
            
            const oficinaModificada = await this.service.modificar(id, datos);
            return res.status(200).json(oficinaModificada);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    // agregar empleados
    agregarEmpleados = async (req, res) => {
        try {
            const idOficina = req.body.idOficina;
            validar(idOficina, 'id');

            const listaIdEmpleados = req.body.listaIdEmpleados;
            for (const idUsuario of listaIdEmpleados) {
                validar(idUsuario, 'id');
            }

            const resultado = await this.service.agregarEmpleados(idOficina, listaIdEmpleados);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
        
    }

    // quitar empleados
    quitarEmpleados = async (req, res) => {
        try {
            const idOficina = req.body.idOficina;
            validar(idOficina, 'id');

            const listaIdEmpleados = req.body.listaIdEmpleados;
            for (const idUsuario of listaIdEmpleados) {
                validar(idUsuario, 'id');
            }

            const resultado = await this.service.quitarEmpleados(idOficina, listaIdEmpleados);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }

    obtenerInforme = async (req, res) => {
        try {
            const {buffer, path, headers} = await this.service.obtenerInforme();
            res.set(headers)
            res.status(200).end(buffer);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
}