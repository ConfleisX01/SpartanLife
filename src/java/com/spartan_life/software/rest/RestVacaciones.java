package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerVacacion;
import com.spartan_life.software.model.SolicitudVacaciones;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

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
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, sv);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, sv);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
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
            SolicitudVacaciones local = cv.modificarSolicitud(solicitud);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, sv);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, sv);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

}
