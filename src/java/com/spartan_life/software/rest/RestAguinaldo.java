package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerAguinaldo;
import com.spartan_life.software.model.Aguinaldo;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("aguinaldo")
public class RestAguinaldo {

    @Path("calcularAguinaldo")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response calcularAguinaldo(@FormParam("aguinaldo") @DefaultValue("") String a) {

        String out = "";
        try {
            ControllerAguinaldo ca = new ControllerAguinaldo();
            Gson gson = new Gson();

            Aguinaldo aguinaldo = gson.fromJson(a, Aguinaldo.class);
            Aguinaldo objetoLocal = ca.calcularAguinaldo(aguinaldo);

            if (objetoLocal != null) {
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
        
        return Response.ok(out).build();

    }
}
