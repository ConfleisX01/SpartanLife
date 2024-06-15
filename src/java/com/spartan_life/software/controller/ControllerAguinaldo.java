package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Aguinaldo;
import com.spartan_life.software.model.Empleado;
import java.sql.Connection;

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
}
