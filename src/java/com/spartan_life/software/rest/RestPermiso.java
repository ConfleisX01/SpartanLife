
package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerPermiso;
import com.spartan_life.software.model.Permiso;
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

@Path("permiso")

public class RestPermiso {
    
      @Path("insertPermiso")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertarPermiso(@FormParam("permiso") @DefaultValue("") String p) {
        String out = "";

        ControllerPermiso cp = new ControllerPermiso();
        Gson gson = new Gson();
        try {
           Permiso permiso = gson.fromJson(p, Permiso.class);
        System.out.println("Permiso deserializado: " + permiso);

        Permiso local = cp.insertarPermiso(permiso);
        System.out.println("Resultado de la inserción: " + local);

            
            
            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, p);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, p);
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
    @Path("modificarPermiso")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarPermiso(@FormParam("permiso") @DefaultValue("") String p) {
        String out = "";

        ControllerPermiso cp = new ControllerPermiso();
        Gson gson = new Gson();

        try {
            Permiso permiso = gson.fromJson(p, Permiso.class);
            Permiso local = cp.modificarPermiso(permiso);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, p);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, p);
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
        List<Permiso> permisos = null;
        ControllerPermiso cp = new ControllerPermiso();
        try {
            permisos = cp.getAll(idEmpleado);
            out = new Gson().toJson(permisos);
            
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"error" : "Ocurrió un error, intente más tarde."}
              """;
        }
        return Response.ok(out).build();
    }
    
}
