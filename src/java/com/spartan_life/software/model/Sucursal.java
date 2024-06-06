
package com.spartan_life.software.model;


public class Sucursal {
    
    private int idSucursal;
    private String nombreSucursal;
    private String direccion_sucursal;
    
    public  Sucursal(){
        
    }

    public Sucursal(int idSucursal, String nombreSucursal, String direccion_sucursal) {
        this.idSucursal = idSucursal;
        this.nombreSucursal = nombreSucursal;
        this.direccion_sucursal = direccion_sucursal;
    }

    public String getDireccion_sucursal() {
        return direccion_sucursal;
    }

    public void setDireccion_sucursal(String direccion_sucursal) {
        this.direccion_sucursal = direccion_sucursal;
    }

    public int getIdSucursal() {
        return idSucursal;
    }

    public void setIdSucursal(int idSucursal) {
        this.idSucursal = idSucursal;
    }

    public String getNombreSucursal() {
        return nombreSucursal;
    }

    public void setNombreSucursal(String nombreSucursal) {
        this.nombreSucursal = nombreSucursal;
    }
    
}
