
package com.spartan_life.software.model;


public class Empleado {
    
    private int idEmpleado;
    private Persona persona;
    private Sucursal sucursal;
    private Documento documento;
    private Puesto puesto;
    private String antiguedad;
    private int limiteVacaciones;
    private int vacacionesRestantes;
    private String foto;
    
    public Empleado() {
        
    }

    public Empleado(int idEmpleado, Persona persona, Sucursal sucursal, Documento documento, Puesto puesto, String antiguedad, int limiteVacaciones, String foto, int vacacionesRestantes) {
        this.idEmpleado = idEmpleado;
        this.persona = persona;
        this.sucursal = sucursal;
        this.documento = documento;
        this.puesto = puesto;
        this.antiguedad = antiguedad;
        this.limiteVacaciones = limiteVacaciones;
        this.foto = foto;
        this.vacacionesRestantes = vacacionesRestantes;
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

    public Documento getDocumento() {
        return documento;
    }

    public void setDocumento(Documento documento) {
        this.documento = documento;
    }

    public Puesto getPuesto() {
        return puesto;
    }

    public void setPuesto(Puesto puesto) {
        this.puesto = puesto;
    }

    public String getAntiguedad() {
        return antiguedad;
    }

    public void setAntiguedad(String antiguedad) {
        this.antiguedad = antiguedad;
    }

    public int getLimiteVacaciones() {
        return limiteVacaciones;
    }

    public void setLimiteVacaciones(int limiteVacaciones) {
        this.limiteVacaciones = limiteVacaciones;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public int getVacacionesRestantes() {
        return vacacionesRestantes;
    }

    public void setVacacionesRestantes(int vacacionesRestantes) {
        this.vacacionesRestantes = vacacionesRestantes;
    }

    
}
