
package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Asistencia;
import com.spartan_life.software.model.Empleado;
import java.sql.Connection;


public class ControllerAsistencia {
    
public Asistencia insertarAsistencia(Asistencia a) {
      Empleado e = a.getEmpleado();
    System.out.println("Hola desde controller: " + a.getInicioSemana());
    System.out.println("Hola desde controller: " + a.getFinSemana());
    System.out.println("Hola desde controller: " + e.getIdEmpleado());
    String query = "CALL registrarAsistencia(?, ?, ?, ?)";
    
    try {
        ConexionMysql conexionMysql = new ConexionMysql();
        Connection conn = conexionMysql.open();
        CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
        
      
        
        
        cstmt.setInt(1, e.getIdEmpleado());
        cstmt.setString(2, a.getInicioSemana());
        cstmt.setString(3, a.getFinSemana());
        cstmt.setInt(4, a.getDiasAsistidos());
        
        System.out.println("Hola desde controller2: " + e.getIdEmpleado());
        cstmt.execute();
        
        cstmt.close();
        conn.close();
        conexionMysql.close();
        return a;
    } catch (Exception ex) {
        ex.printStackTrace();
        return null;
    }
}

}
