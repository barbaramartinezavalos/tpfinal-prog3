import Reclamos from '../database/reclamos.js';
import dotenv from 'dotenv';
import UsuariosService from './usuariosService.js';
import InformeService from './informesService.js';
import ReclamosTiposService from './reclamosTiposService.js';
import ReclamosEstadosService from "./reclamosEstadosService.js";
import NotificacionesService from './notificacionesService.js';

dotenv.config()

export default class ReclamosService {
    constructor() {
        this.reclamos = new Reclamos()
        this.usuarios = new UsuariosService()
        this.informes = new InformeService()
        this.reclamosTipos = new ReclamosTiposService()
        this.reclamosEstados = new ReclamosEstadosService()
        this.notificaciones = new NotificacionesService()
    }

    obtenerTodos = async (idUsuario, idUsuarioTipo) => {
        let id = idUsuario
        if (idUsuarioTipo === 2) {
            id = await this.reclamos.obtenerIdReclamoTipo(idUsuario);
        }
        
        const resultado = await this.reclamos.obtenerTodos(idUsuarioTipo, id);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'Error en el servidor' 
            };
        }

        return resultado
    }
    
    obtenerPorId = async (idReclamo, idUsuario, idUsuarioTipo) => {
        let id = idUsuario
        if (idUsuarioTipo === 2) {
            id = await this.reclamos.obtenerIdReclamoTipo(idUsuario);
        }

        const resultado = await this.reclamos.obtenerPorId(idReclamo, idUsuarioTipo, id);
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
        await this.reclamosTipos.obtenerPorId(datos.idReclamoTipo);

        const resultado = await this.reclamos.agregar(datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar el reclamo' 
            };
        }
        return resultado;
    }

    atenderReclamo = async (idReclamo, datos, idUsuario) => {
        // verificar ID del reclamo, y si puede ser atendido
        const reclamo = await this.obtenerPorId(idReclamo, idUsuario, 2)

        if (reclamo.idReclamoEstado === 3 || reclamo.idReclamoEstado === 4) {
            throw {
                estado: 400,
                mensaje: 'No se puede atender el reclamo'
            }
        } 

        // verificar ID del reclamoEstado, en el caso que el nuevo estado sea 'Finalizado' se agregan los datos correspondientes
        const reclamoEstado = await this.reclamosEstados.obtenerPorId(datos.idReclamoEstado)
        if (reclamoEstado.descripcion === 'Finalizado') {
            datos.idUsuarioFinalizador = idUsuario
            datos.fechaFinalizado = new Date().toISOString()
        }
        
        const resultado = await this.reclamos.modificar(idReclamo, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: 'No se pudo atender el reclamo' 
            };
        }
        const usuario = await this.usuarios.obtenerPorId(reclamo.idUsuarioCreador, 3)
        const datosCorreo = {
            nombre: usuario.usuario,
            reclamo: reclamo.asunto,
            estado: reclamoEstado.descripcion,
            correoElectronico: usuario.correoElectronico
        }
        await this.notificaciones.enviarCorreo(datosCorreo)
        return resultado;
    }

    cancelarReclamo = async (idReclamo, idUsuario) =>  {
        // verificar ID del reclamo, y si puede ser cancelado
        const reclamo = await this.obtenerPorId(idReclamo, idUsuario, 3)
        if (reclamo.idReclamoEstado !== 1) {
            throw {
                estado: 400,
                mensaje: 'No se puede cancelar el reclamo'
            }
        }
        const datos = {
            idReclamoEstado: 3
        }

        const resultado = await this.reclamos.modificar(idReclamo, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: 'No se pudo cancelar el reclamo' 
            };
        }
        return resultado;
    }

    reportePdf = async () => {
        const datosReporte = await this.reclamos.buscarDatosReportePdf();

        if (!datosReporte || datosReporte.length === 0) {
            return { estado: false, mensaje: 'Sin datos para el reporte'};
        }

        const pdf = await this.informes.informeReclamosPdf(datosReporte);
        
        return {
            buffer: pdf,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline; filename="reporte.pdf"'
            }
        };
    }

    reporteCsv = async () => {
        const datosReporte = await this.reclamos.buscarDatosReporteCsv();

        if (!datosReporte || datosReporte.length === 0) {
            return {estado: false, mensaje: 'Sin datos para el reporte'};
        }

        const csv =  await this.informes.informeReclamosCsv(datosReporte);
        return {
            path: csv,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': 'attachment; filename="reporte.csv"'
            }
        };
    }

    generarInforme = async (formato) => {
        if (formato === 'pdf') {
            return await this.reportePdf();

        }else if (formato === 'csv'){
            
            return await this.reporteCsv();

        }
    }
}