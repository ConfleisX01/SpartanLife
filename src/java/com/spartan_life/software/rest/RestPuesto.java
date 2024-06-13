
package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerPuesto;
import com.spartan_life.software.model.Puesto;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;


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
            cp.insertarPuesto(puesto);
            
            out = """
                  {"response" : "operacion Exitosa"}
                  """;
            out = String.format(out, p);
            
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
            cp.eliminarPuesto(puesto);
            
            out = """
                  {"response" : "operacion Exitosa"}
                  """;
            out = String.format(out, p);
            
        }catch (Exception e){
            e.printStackTrace();
                out = """
                  {"response" : "operacion Fallida"}
                  """;
        }
        
     return Response.status(Response.Status.CREATED).entity(out).build();
    }
}
