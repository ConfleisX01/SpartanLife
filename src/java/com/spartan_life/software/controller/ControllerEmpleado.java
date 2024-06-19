package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.Persona;
import com.spartan_life.software.model.Puesto;
import com.spartan_life.software.model.Sucursal;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.sql.Statement;

public class ControllerEmpleado {

    public Empleado insertEmpleado(Empleado e) {

        String query = "CALL insertarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            // preparamos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // objetos que vamos a utilizar
            Persona persona = e.getPersona();
            Sucursal sucursal = e.getSucursal();
            Puesto puesto = e.getPuesto();

            // parametros de entrada
            cstmt.setString(1, persona.getNombre());
            cstmt.setString(2, persona.getApellidoPaterno());
            cstmt.setString(3, persona.getApellidoMaterno());
            cstmt.setString(4, persona.getFechaNacimiento());
            cstmt.setString(5, persona.getRfc());
            cstmt.setString(6, persona.getCurp());
            cstmt.setString(7, persona.getNss());
            cstmt.setInt(8, sucursal.getIdSucursal());
            cstmt.setInt(9, puesto.getIdPuesto());
            cstmt.setFloat(10, e.getSalarioDia());
            cstmt.setFloat(11, e.getPagoExtra());
            cstmt.setString(12, e.getFoto());

            cstmt.execute();

            cstmt.close();
            conn.close();
            conexionMysql.close();
            return e;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    public Empleado modificarEmpleado(Empleado e) {
        String query = "CALL modificarEmpleado(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        try {

            // preparamos la bada
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);

            // objetos que vamos a utilizar
            Persona persona = e.getPersona();
            Sucursal sucursal = e.getSucursal();
            Puesto puesto = e.getPuesto();

            //parametros de entrada
            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setInt(2, persona.getIdPersona());
            cstmt.setString(3, persona.getNombre());
            cstmt.setString(4, persona.getApellidoPaterno());
            cstmt.setString(5, persona.getApellidoMaterno());
            cstmt.setString(6, persona.getFechaNacimiento());
            cstmt.setString(7, persona.getRfc());
            cstmt.setString(8, persona.getCurp());
            cstmt.setString(9, persona.getNss());
            cstmt.setInt(10, sucursal.getIdSucursal());
            cstmt.setInt(11, puesto.getIdPuesto());
            cstmt.setFloat(12, e.getSalarioDia());
            cstmt.setFloat(13, e.getPagoExtra());
            cstmt.setString(14, e.getFoto());
            
            // ejecutar el procedimiento
            cstmt.execute();
            cstmt.close();
            conn.close();
            conexionMysql.close();

            return e;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    
    public Empleado eliminarEmpleado(Empleado e){
        String query =  "CALL eliminarEmpleado(?, ?)";
             try {
            ConexionMysql connMySQL = new ConexionMysql();
            Connection conn = connMySQL.open();
            CallableStatement cstmt = (CallableStatement) conn.prepareCall(query);
            
            Persona persona = e.getPersona();
            cstmt.setInt(1, e.getIdEmpleado());
            cstmt.setInt(2, persona.getIdPersona());
            
               // Ejecutar el procedimiento almacenado
            cstmt.execute();

            // Cerrar recursos
            cstmt.close();
            conn.close();
            connMySQL.close();
            return e;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
    
public List<Empleado> getAllEdad(int idPersona) throws SQLException {
    // Llamada al procedimiento almacenado para actualizar la edad de una persona específica
    String callSql = "CALL actualizarEdad(?);";
    
    // Nos conectamos a la base de datos:
    ConexionMysql connMySQL = new ConexionMysql();
    // Abrimos la conexión con la base de datos:
    Connection conn = connMySQL.open();
    // Ejecutamos la llamada al procedimiento almacenado para actualizar la edad
    try (CallableStatement callStmt = (CallableStatement) conn.prepareCall(callSql)) {
        // Especificamos el ID de la persona a actualizar
        callStmt.setInt(1, idPersona);
        callStmt.execute();
    }

    // Consulta a la vista para obtener los empleados actualizados
    String sql = "SELECT * FROM vista_empleados_con_antiguedad;";
    // Ejecutaremos la consulta:
    try (PreparedStatement pstmt = conn.prepareStatement(sql);
         ResultSet rs = pstmt.executeQuery()) {
        List<Empleado> empleados = new ArrayList<>();
        while (rs.next()) {
            empleados.add(fill(rs));
        }
        return empleados;
    } finally {
        // Cerramos los recursos:
        connMySQL.close();
    }
}

private Empleado fill(ResultSet rs) throws SQLException {
    Empleado empleado = new Empleado();
    Persona persona = new Persona();
    Sucursal sucursal = new Sucursal();
    Puesto puesto = new Puesto();

    // Datos de la persona
    persona.setNombre(rs.getString("nombre"));
    persona.setApellidoPaterno(rs.getString("apellido_paterno"));
    persona.setApellidoMaterno(rs.getString("apellido_materno"));
    persona.setFechaNacimiento(rs.getString("fecha_nacimiento"));
    persona.setEdad(rs.getInt("edad"));
    persona.setRfc(rs.getString("rfc"));
    persona.setCurp(rs.getString("curp"));
    persona.setNss(rs.getString("nss"));

    // Datos de la sucursal
    sucursal.setIdSucursal(rs.getInt("id_sucursal"));
    sucursal.setNombreSucursal(rs.getString("nombre_sucursal"));
    
    // datos del puesto
    puesto.setIdPuesto(rs.getInt("id_puesto"));
    puesto.setNombrePuesto(rs.getString("nombre_puesto"));
    
    // Datos del empleado
    empleado.setIdEmpleado(rs.getInt("id_empleado"));
    empleado.setSalarioDia(rs.getFloat("salario_dia"));
    empleado.setFoto(rs.getString("foto"));
    empleado.setAntiguedad(rs.getString("antiguedad"));

    // Asignar objetos a empleado
    empleado.setPersona(persona);
    empleado.setSucursal(sucursal);
    empleado.setPuesto(puesto);

    return empleado;
}

  public List<Empleado> getAll() throws SQLException {
        String sql = "SELECT * FROM vista_empleados_con_antiguedad;";
        // nos vamos a conectar a la Base de Datos:
        ConexionMysql connMySQL = new ConexionMysql();
        // Abrimos la conexion con la Base de Datos:
        Connection conn = connMySQL.open();
        // ejecutaremos la consulta:
        PreparedStatement pstmt = conn.prepareStatement(sql);
        // guardaremos los resultados de la consulta:
        ResultSet rs = pstmt.executeQuery();
        List<Empleado> empleados = new ArrayList<>();
        while (rs.next()) {
            empleados.add(fill(rs));
        }
        System.out.println(empleados);
        rs.close();
        pstmt.close();
        connMySQL.close();
        return empleados;
    }

}