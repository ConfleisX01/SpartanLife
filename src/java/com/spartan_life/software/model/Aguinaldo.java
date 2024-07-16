
package com.spartan_life.software.model;


public class Aguinaldo {
    
    private int idAguinaldo;
    private Empleado empleado;
    private Float cantidadAguinaldo;
    private String fechaPago;

   // solo sirve para las vistas
    private Float total;
   
   public Aguinaldo(){
       
   }

    public Aguinaldo(int idAguinaldo, Empleado empleado, Float cantidadAguinaldo, String fechaPago, Float total) {
        this.idAguinaldo = idAguinaldo;
        this.empleado = empleado;
        this.cantidadAguinaldo = cantidadAguinaldo;
        this.fechaPago = fechaPago;
        this.total = total;
    }

    public int getIdAguinaldo() {
        return idAguinaldo;
    }

    public void setIdAguinaldo(int idAguinaldo) {
        this.idAguinaldo = idAguinaldo;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public Float getCantidadAguinaldo() {
        return cantidadAguinaldo;
    }

    public void setCantidadAguinaldo(Float cantidadAguinaldo) {
        this.cantidadAguinaldo = cantidadAguinaldo;
    }

    public String getFechaPago() {
        return fechaPago;
    }

    public void setFechaPago(String fechaPago) {
        this.fechaPago = fechaPago;
    }

    public Float getTotal() {
        return total;
    }

    public void setTotal(Float total) {
        this.total = total;
    }
   
   
}
