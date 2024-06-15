package com.spartan_life.software.controller;

import com.mysql.cj.jdbc.CallableStatement;
import com.spartan_life.software.bd.ConexionMysql;
import com.spartan_life.software.model.Persona;
import com.spartan_life.software.model.Usuario;
import java.sql.Connection;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import javax.lang.model.util.Types;

public class ControllerUsuario {

    // contrase;a
    public String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder(2 * hash.length);
        for (int i = 0; i < hash.length; i++) {
            String hex = Integer.toHexString(0xff & hash[i]);
            if (hex.length() == 1) {
                hexString.append('0');
            }
            hexString.append(hex);
        }
        return hexString.toString();
    }

    // Método para calcular el hash SHA-256 de una cadena
    private String calcularHashSHA256(String contrasenia) throws NoSuchAlgorithmException {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hash = digest.digest(contrasenia.getBytes());
        return bytesToHex(hash);
    }

    public Usuario insertarUsuario(Usuario u) {
        String query = "CALL insertarUsuario(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement csmt = (CallableStatement) conn.prepareCall(query);

            // encriptar la contraseña del usuario con SHA-256
            String contraseniaEncriptada = calcularHashSHA256(u.getContrasenia());

//datos que se usaran
            Persona persona = u.getPersona();

            // datos de entrada
            csmt.setString(1, u.getNombreUsuario());
            csmt.setString(2, contraseniaEncriptada);
            csmt.setString(3, u.getRol());
            csmt.setString(4, persona.getNombre());
            csmt.setString(5, persona.getApellidoPaterno());
            csmt.setString(6, persona.getApellidoMaterno());
            csmt.setString(7, persona.getFechaNacimiento());
            csmt.setString(8, persona.getRfc());
            csmt.setString(9, persona.getCurp());
            csmt.setString(10, persona.getNss());

            //salida
            csmt.registerOutParameter(11, java.sql.Types.INTEGER);

            csmt.execute();
            // resultado de la peticion
            int resultado = csmt.getInt(11);

            if (resultado == -1) {
                System.out.println("Error: El usuario ya existe.");
                csmt.close();
                conn.close();
                conexionMysql.close();
                return null;

            } else if (resultado == 1) {
                System.out.println("Usuario creado exitosamente.");
                csmt.close();
                conn.close();
                conexionMysql.close();
                return u;
            } else {
                System.out.println("Error desconocido al crear el usuario.");
                csmt.close();
                conn.close();
                conexionMysql.close();
                return null;
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }
    }

    // metodo para iniciar sesión
    public Usuario loginUser(String nombreUsuario, String contrasenia) {
        // calcular el hash de la contraseña
        String contraseniaEncriptada = "";
        try {
            contraseniaEncriptada = calcularHashSHA256(contrasenia);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
            return null;
        }

        String querySelect = "SELECT * FROM usuario WHERE nombre_usuario = ? AND contrasenia = ?";
        Usuario u = new Usuario();

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            PreparedStatement pstmtSelect = conn.prepareStatement(querySelect);

            pstmtSelect.setString(1, nombreUsuario);
            pstmtSelect.setString(2, contraseniaEncriptada);

            ControllerUsuario cl = new ControllerUsuario();
            String timeStamp = new SimpleDateFormat("yyyy.MM.dd.HH.mm.ss").format(new java.util.Date());
            String tokenString = nombreUsuario + " : " + contrasenia + ""
                    + timeStamp;

            byte[] tokenBytes = tokenString.getBytes(java.nio.charset.StandardCharsets.UTF_8);

            ResultSet rs = pstmtSelect.executeQuery();

            String queryToken = "UPDATE usuario SET token = ? WHERE id_usuario = ?;";
            PreparedStatement cstmtToken = conn.prepareStatement(queryToken);

            if (rs.next()) {

                cstmtToken.setString(1, cl.bytesToHex(tokenBytes));
                cstmtToken.setString(2, rs.getString("id_usuario"));
                System.out.println("token actalizado: " + cl.bytesToHex(tokenBytes));
                System.out.println("id actalizado: " + rs.getInt("id_usuario"));
                u.setIdUusario(rs.getInt("id_usuario"));
                u.setNombreUsuario(rs.getString("nombre_usuario"));
                u.setContrasenia(rs.getString("contrasenia"));
                u.setToken(rs.getString("token"));
                u.setRol(rs.getString("rol"));
                System.out.println("este es el token: " + cl.bytesToHex(tokenBytes));

                pstmtSelect.execute();
                cstmtToken.executeUpdate();
            } else {
                System.out.println("Usuario o contraseña incorrectos.");
            }

            rs.close();
            pstmtSelect.close();
            conn.close();
                 return u;

        } catch (Exception ex) {
            ex.printStackTrace();
            return null;
        }

   
    }

    public Usuario traerUsuario(int id_usuario) throws SQLException {
        ConexionMysql conexionMysql = new ConexionMysql();
        Connection conn = conexionMysql.open();
        Usuario u = new Usuario();
        String query = "SELECT * FROM usuario WHERE id_usuario = ?";

        PreparedStatement pstmt = conn.prepareStatement(query);

        pstmt.setInt(1, id_usuario);

        ResultSet rs = pstmt.executeQuery();

        if (rs.next()) {
            u.setIdUusario(rs.getInt("id_usuario"));
            u.setNombreUsuario(rs.getString("nombre_usuario"));
            u.setContrasenia(rs.getString("contrasenia"));
            u.setToken(rs.getString("token"));
            u.setRol(rs.getString("rol"));
        }
        rs.close();
        pstmt.close();
        conn.close();

        return u;
    }
}
