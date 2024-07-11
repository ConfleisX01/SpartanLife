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

    public SolicitudVacaciones insertSolicitud(SolicitudVacaciones sv) {
        String query = "CALL solicitarVacaciones(?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            Empleado e = sv.getEmpleado();

            cstmt.setInt(1, e.getIdEmpleado());
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
        String query = "SELECT * FROM vista_vacaciones";

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

                sv.setIdVacaciones(rs.getInt("id_vacaciones"));
                e.setIdEmpleado(rs.getInt("id_empleado"));
                p.setIdPersona(rs.getInt("id_persona"));
                p.setNombre(rs.getString("nombre"));
                sv.setFechaSolicitud(rs.getString("fecha_solicitud"));
                sv.setFechaInicio(rs.getString("fecha_inicio"));
                sv.setFechaFin(rs.getString("fecha_fin"));
                sv.setEstatus(rs.getString("estatus"));

                solicitudes.add(sv);
            }

            return solicitudes;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

}
