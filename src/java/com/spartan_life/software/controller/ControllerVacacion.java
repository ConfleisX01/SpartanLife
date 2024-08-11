package com.spartan_life.software.controller;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.Persona;
import com.spartan_life.software.model.SolicitudVacaciones;
import java.sql.Connection;
import java.util.ArrayList;
import java.util.List;

public class ControllerVacacion {

        public Empleado updateVacationsLimit(Empleado e) {
        String query = "CALL actualizarLimiteVacaciones(?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setInt(2, e.getLimiteVacaciones());

            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            return e;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    
    public Empleado updateRemainingVacations(Empleado e) {
        String query = "CALL actualizarCantidadVacaciones(?, ?)";
        
        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setInt(2, e.getVacacionesRestantes());

            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            return e;
        } catch(Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    
    public SolicitudVacaciones actualizarSolicitud(SolicitudVacaciones sv) {
        String query = "CALL actualizarSolicitudVacaciones(?, ?, ?)";
        
        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
            
            cstmt.setInt(1, sv.getIdVacaciones());
            cstmt.setString(2, sv.getEstatus());
            cstmt.setString(3, sv.getNombreAprobador());
            
            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            
            return sv;
        } catch(Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    
    public SolicitudVacaciones insertSolicitud(SolicitudVacaciones sv) {
        String query = "CALL crearSolicitudVacaciones(?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            Empleado e = sv.getEmpleado();

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setString(2, sv.getFechaInicio());
            cstmt.setString(3, sv.getFechaFin());
            cstmt.setInt(4, sv.getDiasSolicitados());
            cstmt.setString(5, sv.getNombreCreador());
            cstmt.setString(6, sv.getComentariosCreador());
            cstmt.setString(7, sv.getComentariosEmpleado());
            cstmt.setString(8, sv.getDocumentoSoporte());

            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            return sv;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public SolicitudVacaciones modificarSolicitud(SolicitudVacaciones sv) {
        String query = "CALL modificarVacaciones(?, ?, ?, ?)";
        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            cstmt.setInt(1, sv.getIdVacaciones());
            cstmt.setString(2, sv.getFechaInicio());
            cstmt.setString(3, sv.getFechaFin());
            cstmt.setString(4, sv.getEstatus());

            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            return sv;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public List<SolicitudVacaciones> getAllVacaciones() {
        List<SolicitudVacaciones> solicitudes = new ArrayList<>();
        String query = "SELECT * FROM view_solicitudes_empleados ORDER BY id_vacaciones desc";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            PreparedStatement pstm = conn.prepareCall(query);

            ResultSet rs = pstm.executeQuery();

            while (rs.next()) {
                SolicitudVacaciones sv = new SolicitudVacaciones();
                Empleado e = new Empleado();
                Persona p = new Persona();
                
                sv.setEmpleado(e);
                e.setPersona(p);

                p.setIdPersona(rs.getInt("id_persona"));
                p.setNss(rs.getString("nombre"));
                p.setApellidoPaterno(rs.getString("apellido_paterno"));
                p.setApellidoMaterno(rs.getString("apellido_materno"));
                e.setIdEmpleado(rs.getInt("id_empleado"));
                e.setAntiguedad(rs.getString("fecha_registro"));
                e.setFoto(rs.getString("foto"));
                e.setLimiteVacaciones(rs.getInt("limite_vacaciones"));
                e.setVacacionesRestantes(rs.getInt("vacaciones_restantes"));
                sv.setIdVacaciones(rs.getInt("id_vacaciones"));
                sv.setFechaSolicitud(rs.getString("fecha_solicitud"));
                sv.setNombreCreador(rs.getString("nombre_creador"));
                sv.setFechaInicio(rs.getString("fecha_inicio"));
                sv.setFechaFin(rs.getString("fecha_fin"));
                sv.setEstatus(rs.getString("estatus"));
                sv.setDiasSolicitados(rs.getInt("dias_solicitados"));
                sv.setNombreAprobador(rs.getString("nombre_aprobador"));
                sv.setComentariosCreador(rs.getString("comentarios_creador"));
                sv.setComentariosEmpleado(rs.getString("comentarios_empleado"));
                sv.setDocumentoSoporte(rs.getString("documento_soporte"));

                solicitudes.add(sv);
            }

            return solicitudes;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
