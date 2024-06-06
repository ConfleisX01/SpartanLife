
package com.spartan_life.software.model;


public class HoraExtra {
    
    private int idHoraExtra;
    private Empleado empleado;
    private Asistencia asistencia;
    private int cantidadHora;

    public HoraExtra(){
        
    }

    public HoraExtra(int idHoraExtra, Empleado empleado, Asistencia asistencia, int cantidadHora) {
        this.idHoraExtra = idHoraExtra;
        this.empleado = empleado;
        this.asistencia = asistencia;
        this.cantidadHora = cantidadHora;
    }

    public int getCantidadHora() {
        return cantidadHora;
    }

    public void setCantidadHora(int cantidadHora) {
        this.cantidadHora = cantidadHora;
    }

    public int getIdHoraExtra() {
        return idHoraExtra;
    }

    public void setIdHoraExtra(int idHoraExtra) {
        this.idHoraExtra = idHoraExtra;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Asistencia getAsistencia() {
        return asistencia;
    }

    public void setAsistencia(Asistencia asistencia) {
        this.asistencia = asistencia;
    }
    
}
