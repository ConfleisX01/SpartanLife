package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerAsistencia;
import com.spartan_life.software.model.Asistencia;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("asistencia")
public class RestAsistencia {

    @Path("registrarAsistencia")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response registrarAsistencia(@FormParam("asistencia") @DefaultValue("") String a) {
        String out = "";

        ControllerAsistencia ca = new ControllerAsistencia();
        Gson gson = new Gson();

        try {
            Asistencia asistencia = gson.fromJson(a, Asistencia.class);
            Asistencia local = ca.insertarAsistencia(asistencia);
            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, a);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, a);
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    @Path("modificarAsistencia")
    @Produces(MediaType.APPLICATION_JSON)
    @POST 
    public Response modificarAsistencia(@FormParam("asistencia") @DefaultValue("") String a){
        String out = "";
        
        ControllerAsistencia ca = new ControllerAsistencia();
        Gson gson = new Gson();
        
        try {
            Asistencia asistencia = gson.fromJson(a, Asistencia.class);
            Asistencia local = ca.modificarAsistencia(asistencia);
            
                 if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, a);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, a);
            }
            
        } catch (Exception e) {
              e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }
}
