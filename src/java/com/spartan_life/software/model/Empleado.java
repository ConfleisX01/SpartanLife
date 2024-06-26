
package com.spartan_life.software.model;


public class Empleado {
    
    private int idEmpleado;
    private Persona persona;
    private Sucursal sucursal;
    private Puesto puesto;
    private Float salarioDia;
    private Float pagoExtra;
    private String antiguedad;
    private String foto;
    
    public Empleado(){
        
    }

    public Empleado(int idEmpleado, Persona persona, Sucursal sucursal, Puesto puesto, Float salarioDia, Float pagoExtra, String antiguedad, String foto) {
        this.idEmpleado = idEmpleado;
        this.persona = persona;
        this.sucursal = sucursal;
        this.puesto = puesto;
        this.salarioDia = salarioDia;
        this.pagoExtra = pagoExtra;
        this.antiguedad = antiguedad;
        this.foto = foto;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public int getIdEmpleado() {
        return idEmpleado;
    }

    public void setIdEmpleado(int idEmpleado) {
        this.idEmpleado = idEmpleado;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Sucursal getSucursal() {
        return sucursal;
    }

    public void setSucursal(Sucursal sucursal) {
        this.sucursal = sucursal;
    }

    public Puesto getPuesto() {
        return puesto;
    }

    public void setPuesto(Puesto puesto) {
        this.puesto = puesto;
    }

    public Float getSalarioDia() {
        return salarioDia;
    }

    public void setSalarioDia(Float salarioDia) {
        this.salarioDia = salarioDia;
    }

    public Float getPagoExtra() {
        return pagoExtra;
    }

    public void setPagoExtra(Float pagoExtra) {
        this.pagoExtra = pagoExtra;
    }

    public String getAntiguedad() {
        return antiguedad;
    }

    public void setAntiguedad(String antiguedad) {
        this.antiguedad = antiguedad;
    }
}
