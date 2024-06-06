
package com.spartan_life.software.model;


public class Puesto {
    
    private int idPuesto;
    private String nombrePuesto;
    
    public Puesto(){
        
    }

    public Puesto(int idPuesto, String nombrePuesto) {
        this.idPuesto = idPuesto;
        this.nombrePuesto = nombrePuesto;
    }

    public String getNombrePuesto() {
        return nombrePuesto;
    }

    public void setNombrePuesto(String nombrePuesto) {
        this.nombrePuesto = nombrePuesto;
    }

    public int getIdPuesto() {
        return idPuesto;
    }

    public void setIdPuesto(int idPuesto) {
        this.idPuesto = idPuesto;
    }
    
    
}
