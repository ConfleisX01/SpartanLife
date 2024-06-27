package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.SolicitudVacaciones;
import java.sql.Connection;

public class ControllerVacacion {

    public SolicitudVacaciones insertSolicitud(SolicitudVacaciones sv) {
        String query = "CALL solicitarVacaciones(?, ?, ?, ?)";
        
        System.out.println(sv.toString());
        
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
    

}
