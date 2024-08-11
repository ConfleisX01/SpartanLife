package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerVacacion;
import com.spartan_life.software.model.Empleado;
import com.spartan_life.software.model.SolicitudVacaciones;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

@Path("vacacion")
public class RestVacaciones {

    @Path("insertSolicitud")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertSolicitud(@FormParam("vacacion") @DefaultValue("") String sv) {
        String out = "";

        ControllerVacacion cv = new ControllerVacacion();
        Gson gson = new Gson();

        try {
            // formao json
            SolicitudVacaciones solicitud = gson.fromJson(sv, SolicitudVacaciones.class);
            System.out.println(solicitud.toString());
            SolicitudVacaciones local = cv.insertSolicitud(solicitud);

            if (local != null) {
                out = """
                 {"response" : "OK"}
                 """;
                out = String.format(out, sv);
            } else {
                out = """
                  {"response" : "ERROR"}
                  """;
                out = String.format(out, sv);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "SERVER_ERROR"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("actualizarEstatus")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response actualizarEstatus(@FormParam("vacacion") @DefaultValue("") String sv) {
        String out = "";
        ControllerVacacion cv = new ControllerVacacion();
        Gson gson = new Gson();

        try {
            SolicitudVacaciones solicitud = gson.fromJson(sv, SolicitudVacaciones.class);
            SolicitudVacaciones local = cv.actualizarSolicitud(solicitud);

            if (local != null) {

            }

        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "SERVER_ERROR"}
                  """;
        }
        return Response.ok(out).build();
    }

    @Path("modificarSolicitud")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarSolicitud(@FormParam("vacacion") @DefaultValue("") String sv) {
        String out = "";

        ControllerVacacion cv = new ControllerVacacion();
        Gson gson = new Gson();
        try {
            // se formatea el objeto en json
            SolicitudVacaciones solicitud = gson.fromJson(sv, SolicitudVacaciones.class);
            SolicitudVacaciones sResponse = cv.modificarSolicitud(solicitud);

            if (sResponse != null) {
                out = """
                  {"response" : "OK"}
                  """;
            } else {
                out = """
                  {"response" : "ERROR"}
                  """;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("getAllSolicitudes")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllSolicitudes() {
        String out = "";

        ControllerVacacion cv = new ControllerVacacion();

        try {
            Gson gson = new Gson();
            List<SolicitudVacaciones> solicitudes = new ArrayList<>();
            solicitudes = cv.getAllVacaciones();

            if (solicitudes.isEmpty()) {
                out = """
                      {"response" : "No hay solicitudes de vacaciones"}
                      """;
            } else {
                out = gson.toJson(solicitudes);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"error" : "Error al obtener los datos"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("actualizarLimiteVacaciones")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response updateVacationsLimit(@FormParam("empleado") @DefaultValue("") String emp) {
        String out = "";
        ControllerVacacion cv = new ControllerVacacion();
        Gson gson = new Gson();

        try {
            Empleado e = gson.fromJson(emp, Empleado.class);
            Empleado eResponse = cv.updateVacationsLimit(e);
            System.out.println(e.getIdEmpleado() + " " + e.getLimiteVacaciones());

            if (eResponse != null) {
                out = """
                  {"response" : "OK"}
                  """;
            } else {
                out = """
                  {"response" : "ERROR"}
                  """;
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "SERVER_ERROR"}
                  """;
        }
        return Response.ok(out).build();
    }

    @Path("actualizarCantidadVacaciones")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response updateRemaningVacations(@FormParam("empleado") @DefaultValue("") String emp) {
        String out = "";
        ControllerVacacion cv = new ControllerVacacion();
        Gson gson = new Gson();

        try {
            Empleado e = gson.fromJson(emp, Empleado.class);
            Empleado eResponse = cv.updateRemainingVacations(e);

            if (eResponse != null) {
                out = """
                      {"response" : "OK"}
                      """;
            } else {
                out = """
                      {"response" : "ERROR"}
                      """;
            }

        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "SERVER_ERROR"}
                  """;
        }

        return Response.ok(out).build();
    }
}
