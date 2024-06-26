package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Puesto;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.ArrayList;
import java.util.List;

public class ControllerPuesto {

    public Puesto insertarPuesto(Puesto p) {
        String query = "CALL insertarPuesto (?)";

        try {
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
            return p;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public Puesto eliminarPuesto(Puesto p) {
        String query = "CALL eliminarPuesto (?)";

        try {

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
            return p;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    public List<Puesto> getAll() {
        String query = "SELECT * FROM puesto";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            PreparedStatement pstmt = conn.prepareStatement(query);

            ResultSet rs = pstmt.executeQuery();
            List<Puesto> puestos = new ArrayList<>();
            while (rs.next()) {
                Puesto p = new Puesto();
                p.setIdPuesto(rs.getInt("id_puesto"));
                p.setNombrePuesto(rs.getString("nombre_puesto"));

                puestos.add(p);
            }
            return puestos;
        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }
}
