package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.HoraExtra;
import com.spartan_life.software.model.RegistroPago;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class ControllerSalario {

    public RegistroPago calcularSalario(RegistroPago rp) {
        String peticion = "CALL calcularSalario (?, ?, ?)";

        try {

            // abrimos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection connection = conexionMysql.open();
            CallableStatement dato = (CallableStatement) connection.prepareCall(peticion);

            // objetos que se utilizaran 
            Empleado empleado = rp.getEmpleado();
            HoraExtra horaExtra = rp.getHoraExtra();

            dato.setInt(1, empleado.getIdEmpleado());
            dato.setInt(2, horaExtra.getCantidadHora());
            dato.setInt(3, rp.getHoraTrabajada());

            dato.execute();

            dato.close();
            connection.close();
            conexionMysql.close();
            return rp;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public RegistroPago modificarSalario(RegistroPago rp) {
        String peticion = "CALL modificarSalario (?, ?, ?)";

        try {

            // abrimos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection connection = conexionMysql.open();
            CallableStatement dato = (CallableStatement) connection.prepareCall(peticion);

            // objetos que se utilizaran 
            Empleado empleado = rp.getEmpleado();
            HoraExtra horaExtra = rp.getHoraExtra();
            

            dato.setInt(1, empleado.getIdEmpleado());
            dato.setInt(2, horaExtra.getCantidadHora());
            dato.setInt(3, rp.getHoraTrabajada());
            
            dato.execute();

            dato.close();
            connection.close();
            conexionMysql.close();
            return rp;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private RegistroPago fill(ResultSet rs) throws SQLException {
        RegistroPago registroPago = new RegistroPago();

        registroPago.setTotal(rs.getFloat("total_salarios"));

        return registroPago;
    }

    public List<RegistroPago> getAllTotal() throws SQLException {
        String sql = "SELECT * FROM suma_salarios";

        ConexionMysql conexionMysql = new ConexionMysql();
        Connection connection = conexionMysql.open();
        PreparedStatement pstmt = connection.prepareStatement(sql);

        ResultSet rs = pstmt.executeQuery();

        List<RegistroPago> total = new ArrayList<>();
        while (rs.next()) {
            total.add(fill(rs));
        }

        rs.close();
        pstmt.close();
        conexionMysql.close();

        return total;
    }

    private RegistroPago fillUltimosPagos(ResultSet rs) throws SQLException {
    RegistroPago registroPago = new RegistroPago();
     Empleado empleado = new Empleado();
    HoraExtra he = new HoraExtra();
    registroPago.setIdPago(rs.getInt("id_pago"));
    empleado.setIdEmpleado(rs.getInt("id_empleado"));
    he.setIdHoraExtra(rs.getInt("id_hora_extra"));
    registroPago.setFechaPago(rs.getString("fecha_pago"));
    registroPago.setCantidadPago(rs.getFloat("cantidad_pago"));
    registroPago.setDiaTrabajado(rs.getInt("dia_trabajado"));
    registroPago.setHoraTrabajada(rs.getInt("hora_trabajada"));
    registroPago.setSalarioDia(rs.getFloat("salario_dia"));
    registroPago.setSalarioExtra(rs.getFloat("salario_extra"));

    return registroPago;
}


    public List<RegistroPago> getAllUltimosPagos(int idEmpleado) throws SQLException {
        String sql = "SELECT * FROM ultimo_registro_pago WHERE id_empleado = ?;";

        ConexionMysql conexionMysql = new ConexionMysql();
        Connection connection = conexionMysql.open();
        PreparedStatement pstmt = connection.prepareStatement(sql);
        pstmt.setInt(1, idEmpleado);

        ResultSet rs = pstmt.executeQuery();

        List<RegistroPago> ultimosPagos = new ArrayList<>();
        while (rs.next()) {
            ultimosPagos.add(fillUltimosPagos(rs));
        }

        rs.close();
        pstmt.close();
        conexionMysql.close();

        return ultimosPagos;
    }

}
