package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Aguinaldo;
import com.spartan_life.software.model.Empleado;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerAguinaldo {

    public Aguinaldo calcularAguinaldo(Aguinaldo a) {

        String peticion = "CALL calcularAguinaldo(?)";
        try {

            //abrimos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection connection = conexionMysql.open();
            CallableStatement dato = (CallableStatement) connection.prepareCall(peticion);

            // objetos que se utilizaran 
            Empleado empleado = a.getEmpleado();

            dato.setInt(1, empleado.getIdEmpleado());

            dato.execute();

            //cerramos todo :)
            dato.close();
            connection.close();
            conexionMysql.close();

            return a;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    // getAll de la suma de todos los aguinaldos
    private Aguinaldo fill(ResultSet rs) throws SQLException {
        Aguinaldo aguinaldo = new Aguinaldo();

        aguinaldo.setTotal(rs.getFloat("total_aguinaldos"));

        return aguinaldo;
    }

    public List<Aguinaldo> getAllTotal() throws SQLException {
        String sql = "SELECT * FROM suma_aguinaldos";

        ConexionMysql conexionMysql = new ConexionMysql();
        Connection connection = conexionMysql.open();
        PreparedStatement pstmt = connection.prepareStatement(sql);

        ResultSet rs = pstmt.executeQuery();

        List<Aguinaldo> total = new ArrayList<>();

        while (rs.next()) {
            total.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        conexionMysql.close();

        return total;
    }

    // getAll para aguinaldo de empleado
    private Aguinaldo fillUltimo(ResultSet rs) throws SQLException {
        Aguinaldo aguinaldo = new Aguinaldo();
        Empleado empleado = new Empleado();

        aguinaldo.setIdAguinaldo(rs.getInt("id_aguinaldo"));
        empleado.setIdEmpleado(rs.getInt("id_empleado"));
        aguinaldo.setCantidadAguinaldo(rs.getFloat("cantidad_aguinaldo"));
        aguinaldo.setFechaPago(rs.getString("fecha_pago"));

        return aguinaldo;

    }

    public List<Aguinaldo> getAllUltimo(int idEmpleado) throws SQLException {
        String sql = "SELECT * FROM ultimo_registro_aguinaldo WHERE id_empleado = ?;";
        
         ConexionMysql conexionMysql = new ConexionMysql();
        Connection connection = conexionMysql.open();
        PreparedStatement pstmt = connection.prepareStatement(sql);
        pstmt.setInt(1, idEmpleado);
        
        ResultSet rs = pstmt.executeQuery();
        
        List<Aguinaldo> ultimoPago = new ArrayList<>();
        
        while(rs.next()){
            ultimoPago.add(fillUltimo(rs));
            
        }
          rs.close();
        pstmt.close();
        conexionMysql.close();

        return ultimoPago;
    }
}
