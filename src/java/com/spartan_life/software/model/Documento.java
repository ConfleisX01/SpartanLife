package com.spartan_life.software.model;

public class Documento {

    private int idDocumento;
    private Empleado empleado;
    private String documentoIne;
    private String documentoDomicilio;
    private String documentoCurp;
    private String documentoContrato;

    public Documento() {
        
    }

    public Documento(int idDocumento, Empleado empleado, String documentoIne, String documentoDomicilio, String documentoCurp, String documentoContrato) {
        this.idDocumento = idDocumento;
        this.empleado = empleado;
        this.documentoIne = documentoIne;
        this.documentoDomicilio = documentoDomicilio;
        this.documentoCurp = documentoCurp;
        this.documentoContrato = documentoContrato;
    }

    public int getIdDocumento() {
        return idDocumento;
    }

    public void setIdDocumento(int idDocumento) {
        this.idDocumento = idDocumento;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public String getDocumentoIne() {
        return documentoIne;
    }

    public void setDocumentoIne(String documentoIne) {
        this.documentoIne = documentoIne;
    }

    public String getDocumentoDomicilio() {
        return documentoDomicilio;
    }

    public void setDocumentoDomicilio(String documentoDomicilio) {
        this.documentoDomicilio = documentoDomicilio;
    }

    public String getDocumentoCurp() {
        return documentoCurp;
    }

    public void setDocumentoCurp(String documentoCurp) {
        this.documentoCurp = documentoCurp;
    }

    public String getDocumentoContrato() {
        return documentoContrato;
    }

    public void setDocumentoContrato(String documentoContrato) {
        this.documentoContrato = documentoContrato;
    }

    
}
