import { conexion } from "./conexion.js";

export default class Oficinas {
    
    obtenerTodos = async () => {
        try {
            const sql = `SELECT o.idOficina, o.nombre, rt.descripcion 
            FROM oficinas AS o 
            INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo = o.idReclamoTipo 
            WHERE o.activo = 1`
            const [resultado] = await conexion.query(sql)

            return resultado
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    obtenerPorId = async (idOficina) => {
        try {
            const sql = `SELECT o.idOficina, o.nombre, rt.descripcion 
            FROM oficinas AS o 
            INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo = o.idReclamoTipo 
            WHERE o.idOficina = ? AND o.activo = 1;`;
            const [resultado] = await conexion.query(sql, [idOficina]);

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
            const sql = `INSERT INTO oficinas (nombre, idReclamoTipo, activo) VALUES (?,?,1);`;
            const [resultado] = await conexion.query(sql, [datos.nombre, datos.idReclamoTipo]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo agregar la oficina' 
                };
            } 

            return `Se agregó correctamente la oficina: ${resultado.insertId}`
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    modificar = async (idOficina, datos) => {
        try {
            const sql = `UPDATE oficinas SET ? WHERE idOficina = ?`;
            const [resultado] = await conexion.query(sql, [datos, idOficina]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo modificar la oficina' 
                };
            }

            return `Se modificó correctamente la oficina: ${idOficina}`
        } catch (error) {
            console.error('Error en modificar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
}