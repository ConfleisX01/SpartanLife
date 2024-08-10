
package com.spartan_life.software.model;


public class Permiso {
    
    private int id_permiso;
    private Empleado empleado;
    private String motivoPermiso;
    private String explicacionPermiso;
    private String fechaPermiso;
    private String fechaInicio;
    private String fechaFin;
    
    // para las vistas    
    private Persona persona;
    
    public Permiso(){
        
    }

    public Permiso(int id_permiso, Empleado empleado, String motivoPermiso, String explicacionPermiso, String fechaPermiso, String fechaInicio, String fechaFin, Persona persona) {
        this.id_permiso = id_permiso;
        this.empleado = empleado;
        this.motivoPermiso = motivoPermiso;
        this.explicacionPermiso = explicacionPermiso;
        this.fechaPermiso = fechaPermiso;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.persona = persona;
    }

    public int getId_permiso() {
        return id_permiso;
    }

    public void setId_permiso(int id_permiso) {
        this.id_permiso = id_permiso;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public String getMotivoPermiso() {
        return motivoPermiso;
    }

    public void setMotivoPermiso(String motivoPermiso) {
        this.motivoPermiso = motivoPermiso;
    }

    public String getExplicacionPermiso() {
        return explicacionPermiso;
    }

    public void setExplicacionPermiso(String explicacionPermiso) {
        this.explicacionPermiso = explicacionPermiso;
    }

    public String getFechaPermiso() {
        return fechaPermiso;
    }

    public void setFechaPermiso(String fechaPermiso) {
        this.fechaPermiso = fechaPermiso;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

     @Override
    public String toString() {
        return "Permiso{" +
                "id_permiso=" + id_permiso +
                ", empleado=" + (empleado != null ? empleado.getIdEmpleado() : "null") +
                ", motivoPermiso='" + motivoPermiso + '\'' +
                ", explicacionPermiso='" + explicacionPermiso + '\'' +
                ", fechaPermiso='" + fechaPermiso + '\'' +
                ", fechaInicio='" + fechaInicio + '\'' +
                ", fechaFin='" + fechaFin + '\'' +
                ", persona=" + (persona != null ? persona.toString() : "null") +
                '}';
    }
    
}
