import { conexion } from "./conexion.js";

export default class Reclamos {   

    obtenerTodos = async (idUsuarioTipo, id) => {
        try {
            let sql = `SELECT * FROM reclamos `;
            
            if (idUsuarioTipo === 2) {
                sql += `WHERE idReclamoTipo = ?`;
            }

            if (idUsuarioTipo === 3) {
                sql += `WHERE idUsuarioCreador = ?`;
            }

            const [resultado] = await conexion.query(sql, [id]);
            return resultado;
        } catch (error) {
            console.error('Error en obtenerTodos:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };
    
    obtenerIdReclamoTipo = async (idUsuario) => {
        try {
            const sql = `SELECT o.idReclamoTipo FROM oficinas AS o 
                        INNER JOIN usuarios_oficinas AS uo ON o.idOficina = uo.idOficina 
                        WHERE uo.idUsuario = ?;`;
            const [resultado] = await conexion.query(sql, [idUsuario])

            if (resultado.length === 0) {
                return null
            }
            return resultado[0].idReclamoTipo
        } catch (error) {
            console.error('Error en obtenerIdReclamoTipo:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    }

    obtenerPorId = async (idReclamo, idUsuarioTipo, id) => {
        try {
            let sql = `SELECT * FROM reclamos WHERE idReclamo = ? `;
            
            if (idUsuarioTipo === 2) {
                sql += `AND idReclamoTipo = ?`;
            }
            
            if (idUsuarioTipo === 3) {
                sql += `AND idUsuarioCreador = ?`;
            }
            
            const [resultado] = await conexion.query(sql, [idReclamo, id]);
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
            const sql = `INSERT INTO reclamos (asunto, descripcion, fechaCreado, idReclamoEstado, idReclamoTipo, idUsuarioCreador)
                        VALUES(?, ?, NOW(), 1, ?, ?)`;
            const [resultado] = await conexion.query(sql, [datos.asunto, datos.descripcion, datos.idReclamoTipo, datos.idUsuarioCreador]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo agregar el reclamo' 
                };
            } 

            return `Se agregó correctamente el reclamo: ${resultado.insertId}`;
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    modificar = async (idReclamo, datos) => {
        try {
            const sql = `UPDATE reclamos SET ? WHERE idReclamo = ?`;
            const [resultado] = await conexion.query(sql, [datos, idReclamo]);

            if (resultado.affectedRows === 0) {
                return { 
                    estado: 500, 
                    mensaje: 'No se pudo modificar el reclamo' 
                };
            } 

            return `Se modificó correctamente el reclamo: ${idReclamo}`;
        } catch (error) {
            console.error('Error en agregar:', error);
            return { 
                estado: 500, 
                mensaje: `Error en el servidor ${error}` 
            };
        }
    };

    buscarDatosReportePdf = async () => {        
        const sql = 'CALL `datosPDF`()';

        const [result] = await conexion.query(sql);
        console.log(result)

        const datosReporte = {
            reclamosTotales : result[0][0].reclamosTotales,
            reclamosNoFinalizados : result[0][0].reclamosNoFinalizados,
            reclamosFinalizados : result[0][0].reclamosFinalizados,
            descripcionTipoRreclamoFrecuente : result[0][0].descripcionTipoRreclamoFrecuente,
            cantidadTipoRreclamoFrecuente : result[0][0].cantidadTipoRreclamoFrecuente
        }

        return datosReporte;
    }

    buscarDatosReporteCsv = async () => {
        const sql = `SELECT r.idReclamo as 'reclamo', rt.descripcion as 'tipo', re.descripcion AS 'estado',
                    DATE_FORMAT(r.fechaCreado, '%Y-%m-%d %H:%i:%s') AS 'fechaCreado', CONCAT(u.nombre, ' ', u.apellido) AS 'cliente'
                    FROM reclamos AS r 
                    INNER JOIN reclamos_tipo AS rt ON rt.idReclamoTipo = r.idReclamoTipo 
                    INNER JOIN reclamos_estado AS re ON re.idReclamoEstado = r.idReclamoEstado 
                    INNER JOIN usuarios AS u ON u.idUsuario = r.idUsuarioCreador 
                    WHERE r.idReclamoEstado <> 4;`;

        const [result] = await conexion.query(sql);
        return result;
    }

}