package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import java.sql.Connection;
import com.spartan_life.software.model.Permiso;
import com.spartan_life.software.model.Persona;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerPermiso {

    public Permiso insertarPermiso(Permiso p) {
        String query = "CALL insertarPermiso(? ,?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // datos que vas a ocupar
            Empleado e = p.getEmpleado();

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setString(2, p.getMotivoPermiso());
            cstmt.setString(3, p.getExplicacionPermiso());
            cstmt.setString(4, p.getFechaInicio());
            cstmt.setString(5, p.getFechaFin());

            // ejecutar
            cstmt.execute();

            // cerrar todo
            cstmt.close();
            conn.close();
            conexionMysql.close();

            System.out.println("");
            return p;
        } catch (Exception ex) {
            ex.printStackTrace();
            return p;
        }

    }

    // modificar
    public Permiso modificarPermiso(Permiso p) {
        String query = "CALL modificarUltimoPermiso(? ,?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // datos que vas a ocupar
            Empleado e = p.getEmpleado();
            
            System.out.println("ID Empleado: " + e.getIdEmpleado());
        System.out.println("Motivo Permiso: " + p.getMotivoPermiso());
        System.out.println("Explicación Permiso: " + p.getExplicacionPermiso());
        System.out.println("Fecha Inicio: " + p.getFechaInicio());
        System.out.println("Fecha Fin: " + p.getFechaFin());

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setString(2, p.getMotivoPermiso());
            cstmt.setString(3, p.getExplicacionPermiso());
            cstmt.setString(4, p.getFechaInicio());
            //    cstmt.setString(5, i.getExplicacionIncidencia());
            cstmt.setString(5, p.getFechaFin());

            // ejecutar
            cstmt.execute();

            // cerrar todo
            cstmt.close();
            conn.close();
            conexionMysql.close();

            return p;
        } catch (Exception ex) {
            ex.printStackTrace();
            return p;
        }

    }

    public List<Permiso> getAll(int idEmpleado) throws SQLException {
        String callGet = "SELECT * FROM vista_permisos WHERE id_empleado = ?;";

        List<Permiso> permisos = new ArrayList<>();

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            PreparedStatement pstmt = conn.prepareCall(callGet);

            pstmt.setInt(1, idEmpleado);
            ResultSet rs = pstmt.executeQuery();

            while (rs.next()) {
                permisos.add(fill(rs));
            }

            rs.close();
            pstmt.close();
            conn.close();
        } catch (Exception ex) {
            ex.printStackTrace();
        }

        return permisos;
    }

    private Permiso fill(ResultSet rs) throws SQLException {
        // objetos a aparecer
        Empleado empleado = new Empleado();
        Persona persona = new Persona();
        Permiso permiso = new Permiso();

        // daros de la incidencia
        permiso.setId_permiso(rs.getInt("id_permiso"));
        permiso.setMotivoPermiso(rs.getString("motivo_permiso"));
        permiso.setExplicacionPermiso(rs.getString("explicacion_permiso"));
        //   incidencia.setExplicacionIncidencia(rs.getString("explicacion_incidencia"));
        permiso.setFechaPermiso(rs.getString("fecha_permiso"));
        permiso.setFechaInicio(rs.getString("fecha_inicio"));
        permiso.setFechaFin(rs.getString("fecha_fin"));

        //datos del empleado
        empleado.setIdEmpleado(rs.getInt("id_empleado"));

        //datos de la persona
        persona.setNombre(rs.getString("nombre"));

        // toda la info en un solo objeto
        permiso.setPersona(persona);
        permiso.setEmpleado(empleado);

        return permiso;
    }

}
