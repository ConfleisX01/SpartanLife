
package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerPuesto;
import com.spartan_life.software.model.Puesto;
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


@Path ("puesto")
public class RestPuesto {
    
    @Path ("insertarPuesto")
    @Produces (MediaType.APPLICATION_JSON)
    @POST
    public Response insertarSucursal(@FormParam("puesto") @DefaultValue("") String p){
        
        ControllerPuesto cp = new ControllerPuesto();
        String out = "";
        Gson gson = new Gson();
        
        try{
            Puesto puesto = gson.fromJson(p, Puesto.class);
            Puesto local =  cp.insertarPuesto(puesto);
            
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
        }catch (Exception e){
            e.printStackTrace();
                out = """
                  {"response" : "operacion Fallida"}
                  """;
        }
        
     return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    @Path ("eliminarPuesto")
    @Produces (MediaType.APPLICATION_JSON)
    @POST
    public Response eliminarPuesto(@FormParam("puesto") @DefaultValue("") String p){
        
        ControllerPuesto cp = new ControllerPuesto();
        String out = "";
        Gson gson = new Gson();
        
        try{
            Puesto puesto = gson.fromJson(p, Puesto.class);
           Puesto local =  cp.eliminarPuesto(puesto);
            
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
        }catch (Exception e){
            e.printStackTrace();
                out = """
                  {"response" : "operacion Fallida"}
                  """;
        }
        
     return Response.status(Response.Status.CREATED).entity(out).build();
    }
    
    @Path ("getAll")
    @Produces (MediaType.APPLICATION_JSON)
    @GET
    public Response getAllPuestos() {
        ControllerPuesto cp = new ControllerPuesto();
        List<Puesto> puestos = null;
        String out = "";
        
        try {
            puestos = cp.getAll();
            out = new Gson().toJson(puestos);
        } catch(Exception ex) {
            ex.printStackTrace();
            out = """
                  {"error" : "Ocurrio un error al obtener los datos"}
                  """;
        }
        return Response.status(Response.Status.OK).entity(out).build();
    }
}
