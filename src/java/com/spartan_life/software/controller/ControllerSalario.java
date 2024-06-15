package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.HoraExtra;
import com.spartan_life.software.model.RegistroPago;
import java.sql.Connection;

public class ControllerSalario {

    public RegistroPago calcularSalario(RegistroPago rp) {
        String peticion = "CALL calcularSalario (?, ?)";

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
        String peticion = "CALL modificarSalario (?, ?)";

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
}
