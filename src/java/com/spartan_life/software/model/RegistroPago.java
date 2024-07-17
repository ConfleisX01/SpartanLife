package com.spartan_life.software.model;

public class RegistroPago {

    private int idPago;
    private Empleado empleado;
    private HoraExtra horaExtra;
    private String fechaPago;
    private Float cantidadPago;
    private int diaTrabajado;
    private int horaTrabajada;
    private Float salarioDia;
    private Float salarioExtra;
    
    // solo se usa en la vista
    private Float total;

    public RegistroPago(){
        
    }   

    public RegistroPago(int idPago, Empleado empleado, HoraExtra horaExtra, String fechaPago, Float cantidadPago, int diaTrabajado, int horaTrabajada, Float salarioDia, Float salarioExtra, Float total) {
        this.idPago = idPago;
        this.empleado = empleado;
        this.horaExtra = horaExtra;
        this.fechaPago = fechaPago;
        this.cantidadPago = cantidadPago;
        this.diaTrabajado = diaTrabajado;
        this.horaTrabajada = horaTrabajada;
        this.salarioDia = salarioDia;
        this.salarioExtra = salarioExtra;
        this.total = total;
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

    public int getHoraTrabajada() {
        return horaTrabajada;
    }

    public void setHoraTrabajada(int horaTrabajada) {
        this.horaTrabajada = horaTrabajada;
    }

    public Float getSalarioDia() {
        return salarioDia;
    }

    public void setSalarioDia(Float salarioDia) {
        this.salarioDia = salarioDia;
    }

    public Float getSalarioExtra() {
        return salarioExtra;
    }

    public void setSalarioExtra(Float salarioExtra) {
        this.salarioExtra = salarioExtra;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }

 
    
}
