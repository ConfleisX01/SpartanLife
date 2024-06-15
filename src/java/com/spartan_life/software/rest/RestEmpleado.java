package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerEmpleado;
import com.spartan_life.software.model.Empleado;
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

@Path("empleado")
public class RestEmpleado {

    @Path("insertEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertEmpleado(@FormParam("empleado") @DefaultValue("") String e) {
        String out = "";

        ControllerEmpleado ce = new ControllerEmpleado();
        Gson gson = new Gson();

        try {
            // formao json
            Empleado empleado = gson.fromJson(e, Empleado.class);
            Empleado local = ce.insertEmpleado(empleado);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, e);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, e);
            }

        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("modificarEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarEmpleado(@FormParam("empleado") @DefaultValue("") String e) {
        String out = "";

        ControllerEmpleado ce = new ControllerEmpleado();
        Gson gson = new Gson();
        try {
            // se formatea el objeto en json
            Empleado empleado = gson.fromJson(e, Empleado.class);
            Empleado local = ce.modificarEmpleado(empleado);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, e);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, e);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("eliminarEmpleado")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response eliminarEmpleado(@FormParam("empleado") @DefaultValue("") String e) {
        String out = "";

        ControllerEmpleado ce = new ControllerEmpleado();
        Gson gson = new Gson();
        try {
            // se formatea el objeto en json
            Empleado empleado = gson.fromJson(e, Empleado.class);
            Empleado local = ce.eliminarEmpleado(empleado);

            if (local != null) {
                out = """
                 {"response" : "operacion exitosa"}
                 """;
                out = String.format(out, e);
            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, e);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("getAllEdad")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllEdad(@QueryParam("idPersona") int idPersona) {
        String out = null;
        List<Empleado> empleados = null;
        ControllerEmpleado cs = new ControllerEmpleado();
        try {
            // Llamada al método getAll(int idPersona) pasando el idPersona recibido como parámetro
            empleados = cs.getAllEdad(idPersona);
            out = new Gson().toJson(empleados);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"error" : "Ocurrió un error, intente más tarde."}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll(@QueryParam("idPersona") int idPersona) {
        String out = null;
        List<Empleado> empleados = null;
        ControllerEmpleado cs = new ControllerEmpleado();
        try {
            // Llamada al método getAll(int idPersona) pasando el idPersona recibido como parámetro
            empleados = cs.getAll();
            out = new Gson().toJson(empleados);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"error" : "Ocurrió un error, intente más tarde."}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }

}
