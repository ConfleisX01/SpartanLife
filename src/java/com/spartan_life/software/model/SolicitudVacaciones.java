
package com.spartan_life.software.model;


public class SolicitudVacaciones {
    private int idVacaciones;
    private Empleado empleado;
    private String fechaSolicitud;
    private String fechaInicio;
    private String fechaFin;
    private int diasSolicitados;
    private String estatus;
    private String nombreCreador;
    private String fechaRespondido;
    private String nombreAprobador;
    private String comentariosCreador;
    private int vacacionesRestantes;
    private String comentariosEmpleado;
    private String documentoSoporte;

    public SolicitudVacaciones() {
        
    }

    public SolicitudVacaciones(int idVacaciones, Empleado empleado, String fechaSolicitud, String fechaInicio, String fechaFin, int diasSolicitados, String estatus, String nombreCreador, String fechaRespondido, String nombreAprobador, String comentariosCreador, int vacacionesRestantes, String comentariosEmpleado, String documentoSoporte) {
        this.idVacaciones = idVacaciones;
        this.empleado = empleado;
        this.fechaSolicitud = fechaSolicitud;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.diasSolicitados = diasSolicitados;
        this.estatus = estatus;
        this.nombreCreador = nombreCreador;
        this.fechaRespondido = fechaRespondido;
        this.nombreAprobador = nombreAprobador;
        this.comentariosCreador = comentariosCreador;
        this.vacacionesRestantes = vacacionesRestantes;
        this.comentariosEmpleado = comentariosEmpleado;
        this.documentoSoporte = documentoSoporte;
    }

    public int getIdVacaciones() {
        return idVacaciones;
    }

    public void setIdVacaciones(int idVacaciones) {
        this.idVacaciones = idVacaciones;
    }

    public Empleado getEmpleado() {
        return empleado;
    }

    public void setEmpleado(Empleado empleado) {
        this.empleado = empleado;
    }

    public String getFechaSolicitud() {
        return fechaSolicitud;
    }

    public void setFechaSolicitud(String fechaSolicitud) {
        this.fechaSolicitud = fechaSolicitud;
    }

    public String getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(String fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public String getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(String fechaFin) {
        this.fechaFin = fechaFin;
    }

    public int getDiasSolicitados() {
        return diasSolicitados;
    }

    public void setDiasSolicitados(int diasSolicitados) {
        this.diasSolicitados = diasSolicitados;
    }

    public String getEstatus() {
        return estatus;
    }

    public void setEstatus(String estatus) {
        this.estatus = estatus;
    }

    public String getNombreCreador() {
        return nombreCreador;
    }

    public void setNombreCreador(String nombreCreador) {
        this.nombreCreador = nombreCreador;
    }

    public String getFechaRespondido() {
        return fechaRespondido;
    }

    public void setFechaRespondido(String fechaRespondido) {
        this.fechaRespondido = fechaRespondido;
    }

    public String getNombreAprobador() {
        return nombreAprobador;
    }

    public void setNombreAprobador(String nombreAprobador) {
        this.nombreAprobador = nombreAprobador;
    }

    public String getComentariosCreador() {
        return comentariosCreador;
    }

    public void setComentariosCreador(String comentariosCreador) {
        this.comentariosCreador = comentariosCreador;
    }

    public int getVacacionesRestantes() {
        return vacacionesRestantes;
    }

    public void setVacacionesRestantes(int vacacionesRestantes) {
        this.vacacionesRestantes = vacacionesRestantes;
    }

    public String getComentariosEmpleado() {
        return comentariosEmpleado;
    }

    public void setComentariosEmpleado(String comentariosEmpleado) {
        this.comentariosEmpleado = comentariosEmpleado;
    }

    public String getDocumentoSoporte() {
        return documentoSoporte;
    }

    public void setDocumentoSoporte(String documentoSoporte) {
        this.documentoSoporte = documentoSoporte;
    }
    
    
}
