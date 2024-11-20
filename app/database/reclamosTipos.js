import { conexion } from "./conexion.js";

export default class ReclamosTipos {
    
    obtenerTodos = async () => {
        try {
            const sql = `SELECT idReclamoTipo, descripcion FROM reclamos_tipo WHERE activo = 1`
            const [resultado] = await conexion.query(sql)

            return resultado;
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    obtenerPorId = async (idReclamoTipo) => {
        try {
            const sql = `SELECT idReclamoTipo, descripcion FROM reclamos_tipo WHERE idReclamoTipo = ? AND activo = 1`;
            const [resultado] = await conexion.query(sql, [idReclamoTipo]);

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
            const sql = `INSERT INTO reclamos_tipo (descripcion, activo) VALUES (?,1);`;
            const [resultado] = await conexion.query(sql, [datos.descripcion]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo agregar el reclamoTipo' 
                };
            } 

            return `Se agregó correctamente el reclamoTipo: ${resultado.insertId}`
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    modificar = async (idReclamoTipo, datos) => {
        try {
            const sql = `UPDATE reclamos_tipo SET ? WHERE idReclamoTipo = ?`;
            const [resultado] = await conexion.query(sql, [datos, idReclamoTipo]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo modificar el reclamoTipo' 
                };
            }

            return `Se modificó correctamente el reclamoTipo: ${idReclamoTipo}`
        } catch (error) {
            console.error('Error en modificar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
}