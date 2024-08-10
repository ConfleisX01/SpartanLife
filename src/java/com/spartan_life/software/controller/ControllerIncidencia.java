package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import java.sql.Connection;
import com.spartan_life.software.model.Incidencia;
import com.spartan_life.software.model.Persona;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerIncidencia {

    public Incidencia insertarIncidencia(Incidencia i) {
        String query = "CALL insertarIncidencia(? ,?, ?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // datos que vas a ocupar
            Empleado e = i.getEmpleado();
            
         

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setString(2, i.getGravedadIncidencia());
            cstmt.setString(3, i.getMotivoIncidencia());
            cstmt.setString(4, i.getSancionIncidencia());
       //     cstmt.setString(5, i.getExplicacionIncidencia());
            cstmt.setString(5, i.getInicioCatigo());
            cstmt.setString(6, i.getFinCastigo());

            // ejecutar
            cstmt.execute();

            // cerrar todo
            cstmt.close();
            conn.close();
            conexionMysql.close();
            
            System.out.println("");
            return i;
        } catch (Exception ex) {
            ex.printStackTrace();
            return i;
        }

    }
    
    // modificar
    public Incidencia modificarIncidencia(Incidencia i) {
        String query = "CALL modificarUltimaIncidencia(? ,?, ?, ?, ?,  ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // datos que vas a ocupar
            Empleado e = i.getEmpleado();

            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setString(2, i.getGravedadIncidencia());
            cstmt.setString(3, i.getMotivoIncidencia());
            cstmt.setString(4, i.getSancionIncidencia());
        //    cstmt.setString(5, i.getExplicacionIncidencia());
            cstmt.setString(5, i.getInicioCatigo());
            cstmt.setString(6, i.getFinCastigo());

            // ejecutar
            cstmt.execute();

            // cerrar todo
            cstmt.close();
            conn.close();
            conexionMysql.close();

            return i;
        } catch (Exception ex) {
            ex.printStackTrace();
            return i;
        }

    }
    
    public List<Incidencia> getAll(int idEmpleado) throws SQLException{
        String callGet = "SELECT * FROM vista_incidencias WHERE id_empleado = ?;";
        
        List<Incidencia> incidencias = new ArrayList<>();
        
        try{
        ConexionMysql conexionMysql = new ConexionMysql();
        Connection conn = conexionMysql.open();
        PreparedStatement pstmt = conn.prepareCall(callGet);
        
        pstmt.setInt(1, idEmpleado);
        ResultSet rs=   pstmt.executeQuery();
        
         while (rs.next()) {
            incidencias.add(fill(rs));
        }
        
        rs.close();
        pstmt.close();
        conn.close();
    } catch (Exception ex) {
        ex.printStackTrace();
    }
    
    return incidencias;
    }
    
    private Incidencia fill(ResultSet rs) throws SQLException{
        // objetos a aparecer
        Empleado empleado = new  Empleado();
        Persona persona = new Persona();
        Incidencia incidencia = new  Incidencia();
        
        // daros de la incidencia
        incidencia.setId_incidencia(rs.getInt("id_incidencia"));
        incidencia.setGravedadIncidencia(rs.getString("gravedad_incidencia"));
        incidencia.setMotivoIncidencia(rs.getString("motivo_incidencia"));
        incidencia.setSancionIncidencia(rs.getString("sancion_incidencia"));
     //   incidencia.setExplicacionIncidencia(rs.getString("explicacion_incidencia"));
        incidencia.setFechaIncidencia(rs.getString("fecha_incidencia"));
        incidencia.setInicioCatigo(rs.getString("fecha_inicioCastigo"));
        incidencia.setFinCastigo(rs.getString("fecha_finCastigo"));
        
        //datos del empleado
        empleado.setIdEmpleado(rs.getInt("id_empleado"));
        
        //datos de la persona
        persona.setNombre(rs.getString("nombre"));
        
        // toda la info en un solo objeto
        
        incidencia.setPersona(persona);
        incidencia.setEmpleado(empleado);
        
        return incidencia;
    }
    
    
}
