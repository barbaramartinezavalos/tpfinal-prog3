import { conexion } from "./conexion.js";

export default class ReclamosEstados {
    
    obtenerTodos = async () => {
        try {
            const sql = 'SELECT idReclamoEstado, descripcion FROM reclamos_estado WHERE activo = 1';
            const [resultado] = await conexion.query(sql);

            return resultado;
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    obtenerPorId = async (idReclamoEstado) => {
        try {
            const sql = 'SELECT descripcion FROM reclamos_estado WHERE idReclamoEstado = ? AND activo = 1';
            const [resultado] = await conexion.query(sql, [idReclamoEstado]);

            if (resultado.length === 0) {
                return null;
            }

            return resultado[0];
        } catch (error) {
            console.error('Error en obtenerPorId:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    agregar = async (datos) => {
        try {
            const sql = 'INSERT INTO reclamos_estado (descripcion, activo) VALUES (?,1)';
            const [resultado] = await conexion.query(sql, [datos.descripcion]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo agregar el reclamoEstado' 
                };
            } 

            return `Se agregó correctamente el reclamoEstado: ${resultado.insertId}`
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    modificar = async (idReclamoEstado, datos) => {
        try {
            const sql = 'UPDATE reclamos_estado SET ? WHERE idReclamoEstado = ?';
            const [resultado] = await conexion.query(sql, [datos, idReclamoEstado]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo modificar el reclamoEstado' 
                };
            }

            return `Se modificó correctamente el reclamoEstado: ${idReclamoEstado}`
        } catch (error) {
            console.error('Error en modificar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
}