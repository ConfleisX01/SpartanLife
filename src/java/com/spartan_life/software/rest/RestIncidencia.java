package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerIncidencia;
import com.spartan_life.software.model.Incidencia;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;

@Path("incidencia")

public class RestIncidencia {

    @Path("insertIncidencia")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertIncidencia(@FormParam("incidencia") @DefaultValue("") String i) {
        String out = "";

        ControllerIncidencia ci = new ControllerIncidencia();
        Gson gson = new Gson();
        try {
            Incidencia incidencia = gson.fromJson(i, Incidencia.class);
            Incidencia local = ci.insertarIncidencia(incidencia);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, i);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, i);
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.ok(out).build();
    }

    // modificar
    @Path("modificarIncidencia")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarIncidencia(@FormParam("incidencia") @DefaultValue("") String i) {
        String out = "";

        ControllerIncidencia ci = new ControllerIncidencia();
        Gson gson = new Gson();

        try {
            Incidencia incidencia = gson.fromJson(i, Incidencia.class);
            Incidencia local = ci.modificarIncidencia(incidencia);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, i);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, i);
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.ok(out).build();
    }

    // getAll
    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll(@QueryParam("idEmpleado") @DefaultValue("0") int idEmpleado) {
        String out = "";
        List<Incidencia> incidencias = null;
        ControllerIncidencia ci = new ControllerIncidencia();
        try {
            incidencias = ci.getAll(idEmpleado);
            out = new Gson().toJson(incidencias);
            
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"error" : "Ocurrió un error, intente más tarde."}
              """;
        }
        return Response.ok(out).build();
    }
}
