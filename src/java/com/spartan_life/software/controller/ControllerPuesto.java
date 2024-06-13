
package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Puesto;
import java.sql.Connection;


public class ControllerPuesto {
    
    public Puesto insertarPuesto (Puesto p) {
        String query = "CALL insertarPuesto (?)";
        
        try{
            // preparamos la bada
                 ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
            
            cstmt.setString(1, p.getNombrePuesto());
            cstmt.execute();
            
            // ceramos todo
            cstmt.close();
            conn.close();
            conexionMysql.close();
            return  p;
        }
        catch(Exception e){
            e.printStackTrace();
            return null;
        }
    }
    
    public Puesto eliminarPuesto (Puesto p) {
        String query = "CALL eliminarPuesto (?)";
        
        try{
            
            //preparamos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement csmt = (CallableStatement) conn.prepareCall(query);
            
            csmt.setString(1, p.getNombrePuesto());
            
            // ejecutamos
            csmt.execute();
            
            // cerramos la bada
            csmt.close();
            conn.close();
            conexionMysql.close();
            return  p;
        }catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
    
}
