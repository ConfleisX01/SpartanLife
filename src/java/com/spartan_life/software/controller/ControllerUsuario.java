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
import java.util.ArrayList;
import java.util.List;
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
        String query = "CALL insertarUsuario(?, ?, ?, ?)";

        try {
            ConexionMysql conexionMysql = new ConexionMysql();
            Connection conn = conexionMysql.open();
            CallableStatement csmt = (CallableStatement) conn.prepareCall(query);

            // encriptar la contraseña del usuario con SHA-256
            String contraseniaEncriptada = calcularHashSHA256(u.getContrasenia());


            // datos de entrada
            csmt.setString(1, u.getNombreUsuario());
            csmt.setString(2, contraseniaEncriptada);
            csmt.setString(3, u.getRol());
            //salida
            csmt.registerOutParameter(4, java.sql.Types.INTEGER);

            csmt.execute();
            // resultado de la peticion
            int resultado = csmt.getInt(4);

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
    
    
    private Usuario fill(ResultSet rs) throws SQLException {
        Usuario usuario = new Usuario();

        // Datos de la persona
        usuario.setIdUusario(rs.getInt("id_usuario"));
        usuario.setNombreUsuario(rs.getString("nombre_usuario"));
        usuario.setContrasenia(rs.getString("contrasenia"));
        usuario.setRol(rs.getString("rol"));



        return usuario;
    }

    public List<Usuario> traerUsuario() throws SQLException {
        String callGet = "SELECT * FROM usuario;";
        
        List<Usuario> usuarios = new ArrayList<>();
        
        try{
        ConexionMysql conexionMysql = new ConexionMysql();
        Connection conn = conexionMysql.open();
        PreparedStatement pstmt = conn.prepareCall(callGet);
        
        ResultSet rs=   pstmt.executeQuery();
        
         while (rs.next()) {
            usuarios.add(fill(rs));
        }
        
        rs.close();
        pstmt.close();
        conn.close();
    } catch (Exception ex) {
        ex.printStackTrace();
    }
    
    return usuarios;
    }
}
