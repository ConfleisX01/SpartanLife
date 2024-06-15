package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Sucursal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerSucursal {

    public Sucursal insertarSucursal(Sucursal s) {
        String query = "CALL insertarSucursal(?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            cstmt.setString(1, s.getNombreSucursal());
            cstmt.setString(2, s.getDireccion_sucursal());
            cstmt.execute();

            // Cerrar la conexión
            cstmt.close();
            conn.close();
            conexionMysql.close();
            return s;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Sucursal modificarSucursal(Sucursal s) {
        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();

            String query = "CALL modificarSucursal(?, ?, ?)";
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
            cstmt.setInt(1, s.getIdSucursal());
            cstmt.setString(2, s.getNombreSucursal());
            cstmt.setString(3, s.getDireccion_sucursal());
            cstmt.execute();

              cstmt.close();
            conn.close();
            conexionMysql.close();
            return s;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

   public Sucursal eliminarSucursal(Sucursal s) {
    try {
        ConexionMysql conexionMysql = new ConexionMysql();
        Connection conn = conexionMysql.open();

        String query = "CALL eliminarSucursal(?)";
        CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
        cstmt.setInt(1, s.getIdSucursal());
        cstmt.execute();

        // Cerrar la conexión
         cstmt.close();
            conn.close();
            conexionMysql.close();
            return s;
    } catch (Exception e) {
        e.printStackTrace();
        return null;
    }
}


  public List<Sucursal> getAllSucursales() throws SQLException{
    String sql = "SELECT * FROM sucursal";
    
    ConexionMysql connMySQL = new ConexionMysql();
    Connection conn = connMySQL.open();
    try (PreparedStatement pstmt = conn.prepareStatement(sql);
         ResultSet rs = pstmt.executeQuery()) {
        List<Sucursal> sucursales = new ArrayList<>();
        while (rs.next()) {
            sucursales.add(fill(rs));
        }
        return sucursales;
    } finally {
        connMySQL.close();
    }
  }

  private Sucursal fill(ResultSet rs) throws SQLException {
    Sucursal sucursal = new Sucursal();
    

    // Datos de la sucursal
    sucursal.setIdSucursal(rs.getInt("id_sucursal"));
    sucursal.setNombreSucursal(rs.getString("nombre_sucursal"));
    sucursal.setDireccion_sucursal(rs.getString("direccion_sucursal"));


    return sucursal;
}

  
}
