import Oficinas from '../database/oficinas.js';
import ReclamosTiposService from './reclamosTiposService.js';
import UsuariosService from './usuariosService.js';
import UsuariosOficinas from '../database/usuariosOficinas.js';
import InformeService from './informesService.js';

import dotenv from 'dotenv';

dotenv.config()

export default class OficinasService {
    constructor() {
        this.oficinas = new Oficinas()
        this.reclamosTipos = new ReclamosTiposService()
        this.usuarios = new UsuariosService()
        this.usuariosOficinas = new UsuariosOficinas()
        this.informes = new InformeService()
    }

    obtenerTodos = async () => {
        const resultado = await this.oficinas.obtenerTodos();
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'Error en el servidor' 
            };
        }
        return resultado;
    };
    
    obtenerPorId = async (id) => {
        const resultado = await this.oficinas.obtenerPorId(id);
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
        // Verificar el ID de reclamoTipo
        await this.reclamosTipos.obtenerPorId(datos.idReclamoTipo);

        const resultado = await this.oficinas.agregar(datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar la oficina' 
            };
        }
        return resultado;
    };
    
    modificar = async (idOficina, datos) => {
        // Verificar que el ID pasado por parametros exista
        await this.obtenerPorId(idOficina);

        // Verificar el ID de reclamoTipo
        if (datos.idReclamoTipo) {
            await this.reclamosTipos.obtenerPorId(datos.idReclamoTipo);
        }

        const resultado = await this.oficinas.modificar(idOficina, datos);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo modificar la oficina' 
            };
        }
        return resultado;
    };

    agregarEmpleados = async (idOficina, listaIdEmpleados) => {
        const listaEmpleadosAgregar = [];
        const listaEmpleadosModificar = [];

        // verificar idOficina
        await this.obtenerPorId(idOficina);

        // verificar el id de los empleados
        for (const idEmpleado of listaIdEmpleados) {
            await this.usuarios.obtenerPorId(idEmpleado)
        };
        
        for (const idEmpleado of listaIdEmpleados) {
            const estaEnUsuariosOficinas = await this.usuariosOficinas.obtenerPorIdUsuario(idEmpleado);
            if (!estaEnUsuariosOficinas) {
                listaEmpleadosAgregar.push(idEmpleado)
            } else {
                listaEmpleadosModificar.push(idEmpleado)
            };
        };

        const resultado = await this.usuariosOficinas.agregarEmpleados(listaEmpleadosAgregar, listaEmpleadosModificar, idOficina)
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo agregar los empleados' 
            };
        };
        return resultado;
    };

    quitarEmpleados = async (idOficina, listaIdEmpleados) =>{
        const errores = [];

        // verificar idOficina
        await this.obtenerPorId(idOficina);

        // verificar el id de los empleados
        for (const id of listaIdEmpleados) {
            await this.usuarios.obtenerPorId(id);
        };
        

        for (const idEmpleado of listaIdEmpleados) {
            const resultado = await this.usuariosOficinas.obtenerPorIdUsuario(idEmpleado);
            
            if (!resultado || resultado.activo === 0) {
                errores.push(`El empleado ${idEmpleado} no está asignado a una oficina`);
            } else if (resultado.idOficina !== idOficina) {
                errores.push(`El empleado ${idEmpleado} no está asignado a la oficina ${idOficina}`);
            }
        };
        
        if (errores.length) {
            throw {
                estado: 400, 
                mensaje: errores
            };
        };

        const resultado = await this.usuariosOficinas.quitarEmpleados(idOficina, listaIdEmpleados);
        if (!resultado || resultado.estado) {
            throw { 
                estado: resultado.estado || 500, 
                mensaje: resultado.mensaje || 'No se pudo quitar los empleados' 
            };
        }
        return resultado;
    };

    obtenerInforme = async () => {
        try {
            const resultado = await this.usuariosOficinas.obtenerEstadisticas();
            const pdf = await this.informes.informeOficinasPdf(resultado)
            
            return {
                buffer: pdf,
                headers: {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition': 'inline; filename="reportes.pdf"'
                }
            };
        } catch (error) {
            console.log(error)
        }
    }
}