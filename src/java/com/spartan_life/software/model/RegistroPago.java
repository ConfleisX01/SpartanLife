package com.spartan_life.software.model;

public class RegistroPago {

    private int idPago;
    private Empleado empleado;
    private HoraExtra horaExtra;
    private String fechaPago;
    private Float cantidadPago;
    private int diaTrabajado;
    private Float salarioDia;
    private Float salarioExtra;

    public RegistroPago(){
        
    }   

    public RegistroPago(int idPago, Empleado empleado, HoraExtra horaExtra, String fechaPago, Float cantidadPago, int diaTrabajado, Float salarioDia, Float salarioExtra) {
        this.idPago = idPago;
        this.empleado = empleado;
        this.horaExtra = horaExtra;
        this.fechaPago = fechaPago;
        this.cantidadPago = cantidadPago;
        this.diaTrabajado = diaTrabajado;
        this.salarioDia = salarioDia;
        this.salarioExtra = salarioExtra;
    }

    public Float getSalarioExtra() {
        return salarioExtra;
    }

    public void setSalarioExtra(Float salarioExtra) {
        this.salarioExtra = salarioExtra;
    }

    public int getIdPago() {
        return idPago;
    }

    public void setIdPago(int idPago) {
        this.idPago = idPago;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public HoraExtra getHoraExtra() {
        return horaExtra;
    }

    public void setHoraExtra(HoraExtra horaExtra) {
        this.horaExtra = horaExtra;
    }

    public String getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(String fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Float getCantidadPago() {
        return cantidadPago;
    }

    public void setCantidadPago(Float cantidadPago) {
        this.cantidadPago = cantidadPago;
    }

    public int getDiaTrabajado() {
        return diaTrabajado;
    }

    public void setDiaTrabajado(int diaTrabajado) {
        this.diaTrabajado = diaTrabajado;
    }

    public Float getSalarioDia() {
        return salarioDia;
    }

    public void setSalarioDia(Float salarioDia) {
        this.salarioDia = salarioDia;
    }
    
}
