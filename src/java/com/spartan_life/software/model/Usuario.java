
package com.spartan_life.software.model;


public class Usuario {
    
    private int idUusario;
    private Persona persona;
    private String nombreUsuario;
    private String contrasenia;
    private String rol;
    
    public Usuario(){
        
    }

    public Usuario(int idUusario, Persona persona, String nombreUsuario, String contrasenia, String rol) {
        this.idUusario = idUusario;
        this.persona = persona;
        this.nombreUsuario = nombreUsuario;
        this.contrasenia = contrasenia;
        this.rol = rol;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public int getIdUusario() {
        return idUusario;
    }

    public void setIdUusario(int idUusario) {
        this.idUusario = idUusario;
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
    
}
