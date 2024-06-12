
package com.spartan_life.software.model;


public class Asistencia {
    
    private int idAsistencia;
    private Empleado empleado;
    private String inicioSemana;
    private String finSemana;
    private int diasAsistidos;
    
    public Asistencia(){
        
    }

    public Asistencia(int idAsistencia, Empleado empleado, String inicioSemana, String finSemana, int diasAsistidos) {
        this.idAsistencia = idAsistencia;
        this.empleado = empleado;
        this.inicioSemana = inicioSemana;
        this.finSemana = finSemana;
        this.diasAsistidos = diasAsistidos;
    }

    public int getIdAsistencia() {
        return idAsistencia;
    }

    public void setIdAsistencia(int idAsistencia) {
        this.idAsistencia = idAsistencia;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public String getInicioSemana() {
        return inicioSemana;
    }

    public void setInicioSemana(String inicioSemana) {
        this.inicioSemana = inicioSemana;
    }

    public String getFinSemana() {
        return finSemana;
    }

    public void setFinSemana(String finSemana) {
        this.finSemana = finSemana;
    }

    public int getDiasAsistidos() {
        return diasAsistidos;
    }

    public void setDiasAsistidos(int diasAsistidos) {
        this.diasAsistidos = diasAsistidos;
    }

}
