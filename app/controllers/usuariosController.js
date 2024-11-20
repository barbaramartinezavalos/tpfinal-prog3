import UsuariosServices from "../services/usuariosService.js";
import jsonWebToken from 'jsonwebtoken'
import dotenv from 'dotenv'
import validar from "../utils/validacion.js";

dotenv.config()

export default class UsuariosController {
    constructor() {
        this.service = new UsuariosServices()
    }

    registrar = async (req, res) => {
        try {
            const datos = req.body;
            validar(datos, 'usuarioRequerido');
            datos.idUsuarioTipo = 3
            
            const nuevoEmpleado = await this.service.agregar(datos);
            return res.status(200).json(nuevoEmpleado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
    
    actualizarPerfil = async (req, res) => {
        try {
            const { idUsuario } = req.user;

            const datos = req.body;
            validar(datos, 'usuarioOpcional');
            
            
            const empleadoModificado = await this.service.modificar(idUsuario, datos);
            return res.status(200).json(empleadoModificado);
        } catch (error) {
            return res.status(error.estado || 500).json({ 
                estado: error.estado || 500, 
                data: { error: error.mensaje } 
            });
        }
    }
}

