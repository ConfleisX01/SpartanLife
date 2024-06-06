
package com.spartan_life.software.model;


public class SolicitudVacaciones {
    
    private int idVacaciones;
    private Empleado empleado;
    private String fechaSolicitud;
    private String fechaInicio;
    private String fechaFin;
    private String estatus;
    
    public SolicitudVacaciones(){
        
    }

    public SolicitudVacaciones(int idVacaciones, Empleado empleado, String fechaSolicitud, String fechaInicio, String fechaFin, String estatus) {
        this.idVacaciones = idVacaciones;
        this.empleado = empleado;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estatus = estatus;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public int getIdVacaciones() {
        return idVacaciones;
    }

    public void setIdVacaciones(int idVacaciones) {
        this.idVacaciones = idVacaciones;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public String getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(String fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
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
    
    
    
}
