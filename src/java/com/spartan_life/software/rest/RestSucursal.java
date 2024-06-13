package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerSucursal;
import com.spartan_life.software.model.Sucursal;
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

@Path("sucursal")
public class RestSucursal {

    @Path("insertarSucursal")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertarSucursal(@FormParam("sucursal") @DefaultValue("") String s) {
        ControllerSucursal cs = new ControllerSucursal();
        String out = "";
        Gson gson = new Gson();

        try {
            Sucursal sucursal = gson.fromJson(s, Sucursal.class);
            cs.insertarSucursal(sucursal);
            out = """
                  {"response" : "operacion exitosa"}
                  """;
            out = String.format(out, s);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }

        return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    
    @Path("modificarSucursal")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarSucursal(@FormParam("sucursal") @DefaultValue("") String s) {
        ControllerSucursal cs = new ControllerSucursal();
        String out = "";
        Gson gson = new Gson();

        try {
            Sucursal sucursal = gson.fromJson(s, Sucursal.class);
            cs.modificarSucursal(sucursal);
            out = """
                  {"response" : "operacion exitosa"}
                  """;
            out = String.format(out, s);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }

        return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    @Path("eliminarSucursal")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
  public Response eliminarSucursal(@FormParam("sucursal") @DefaultValue("") String s) {
        ControllerSucursal cs = new ControllerSucursal();
        String out;
        Gson gson = new Gson();

        try {
            Sucursal sucursal = gson.fromJson(s, Sucursal.class);
            cs.eliminarSucursal(sucursal);
            out = """
                  {"response" : "operacion exitosa"}
                  """;
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }

        return Response.status(Response.Status.CREATED).entity(out).build();
    }
  
    @Path("getAll")
@Produces(MediaType.APPLICATION_JSON)
@GET
public Response getAll(@QueryParam("idPersona") int idPersona) {
    String out = null;
    List<Sucursal> sucursales = null;
    ControllerSucursal cs = new ControllerSucursal();
    try {
        sucursales = cs.getAllSucursales();
        out = new Gson().toJson(sucursales);
    } catch (Exception e) {
        e.printStackTrace();
        out = """
                  {"error" : "Ocurrió un error, intente más tarde."}
                  """;
    }
    return Response.status(Response.Status.OK).entity(out).build();
}
  
}
