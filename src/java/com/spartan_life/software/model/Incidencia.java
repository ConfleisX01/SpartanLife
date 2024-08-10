
package com.spartan_life.software.model;


public class Incidencia {
    
    private int id_incidencia;
    private Empleado empleado;
    private Persona persona;
    private String gravedadIncidencia;
    private String motivoIncidencia;
    private String sancionIncidencia;
    private String explicacionIncidencia;
    private String fechaIncidencia;
    private String inicioCatigo;
    private String finCastigo;
    
    public Incidencia(){
        
    }

    public Incidencia(int id_incidencia, Empleado empleado, Persona persona, String gravedadIncidencia, String motivoIncidencia, String sancionIncidencia, String explicacionIncidencia, String fechaIncidencia, String inicioCatigo, String finCastigo) {
        this.id_incidencia = id_incidencia;
        this.empleado = empleado;
        this.persona = persona;
        this.gravedadIncidencia = gravedadIncidencia;
        this.motivoIncidencia = motivoIncidencia;
        this.sancionIncidencia = sancionIncidencia;
        this.explicacionIncidencia = explicacionIncidencia;
        this.fechaIncidencia = fechaIncidencia;
        this.inicioCatigo = inicioCatigo;
        this.finCastigo = finCastigo;
    }

    public String getSancionIncidencia() {
        return sancionIncidencia;
    }

    public void setSancionIncidencia(String sancionIncidencia) {
        this.sancionIncidencia = sancionIncidencia;
    }

    public int getId_incidencia() {
        return id_incidencia;
    }

    public void setId_incidencia(int id_incidencia) {
        this.id_incidencia = id_incidencia;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public String getGravedadIncidencia() {
        return gravedadIncidencia;
    }

    public void setGravedadIncidencia(String gravedadIncidencia) {
        this.gravedadIncidencia = gravedadIncidencia;
    }

    public String getMotivoIncidencia() {
        return motivoIncidencia;
    }

    public void setMotivoIncidencia(String motivoIncidencia) {
        this.motivoIncidencia = motivoIncidencia;
    }

    public String getExplicacionIncidencia() {
        return explicacionIncidencia;
    }

    public void setExplicacionIncidencia(String explicacionIncidencia) {
        this.explicacionIncidencia = explicacionIncidencia;
    }

    public String getFechaIncidencia() {
        return fechaIncidencia;
    }

    public void setFechaIncidencia(String fechaIncidencia) {
        this.fechaIncidencia = fechaIncidencia;
    }

    public String getInicioCatigo() {
        return inicioCatigo;
    }

    public void setInicioCatigo(String inicioCatigo) {
        this.inicioCatigo = inicioCatigo;
    }

    public String getFinCastigo() {
        return finCastigo;
    }

    public void setFinCastigo(String finCastigo) {
        this.finCastigo = finCastigo;
    }

   
    
}
