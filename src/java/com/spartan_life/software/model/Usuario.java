
package com.spartan_life.software.model;


public class Usuario {
    
    private int idUsuario;
    private Persona persona;
    private String nombreUsuario;
    private String contrasenia;
    private String token;
    private String rol;
    
    public Usuario(){
        
    }

    public Usuario(int idUusario, Persona persona, String nombreUsuario, String contrasenia, String token, String rol) {
        this.idUsuario = idUusario;
        this.persona = persona;
        this.nombreUsuario = nombreUsuario;
        this.contrasenia = contrasenia;
        this.token = token;
        this.rol = rol;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public int getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(int idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContrasenia() {
        return contrasenia;
    }

    public void setContrasenia(String contrasenia) {
        this.contrasenia = contrasenia;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    
}
