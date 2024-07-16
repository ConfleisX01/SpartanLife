package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerSalario;
import com.spartan_life.software.model.RegistroPago;
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

@Path("salario")

public class RestSalario {

    @Path("calcularSalario")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response calcularSalario(@FormParam("pago") String p) {
        String out = "";

        try {

            ControllerSalario cs = new ControllerSalario();
            Gson gson = new Gson();

            RegistroPago rp = gson.fromJson(p, RegistroPago.class);
            RegistroPago objetoLocal = cs.calcularSalario(rp);

            if (objetoLocal != null) {
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

    @Path("modificarSalario")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response modificarSalario(@FormParam("pago") String p) {
        String out = "";

        try {

            ControllerSalario cs = new ControllerSalario();
            Gson gson = new Gson();

            RegistroPago rp = gson.fromJson(p, RegistroPago.class);
            RegistroPago objetoLocal = cs.modificarSalario(rp);

            if (objetoLocal != null) {
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

    @Path("getAllTotal")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAllTotal() {
        String out = null;
        List<RegistroPago> pagos = null;
        ControllerSalario cs = new ControllerSalario();
        try {
            pagos = cs.getAllTotal();
            out = new Gson().toJson(pagos);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"error" : "Ocurrió un error, intente más tarde."}
                  """;
        }
        return Response.ok(out).build();
    }

    @Path("getAll")
    @Produces(MediaType.APPLICATION_JSON)
    @GET
    public Response getAll(@QueryParam("idEmpleado") @DefaultValue("0") int idEmpleado) {
        String out = null;
        List<RegistroPago> pagos = null;
        ControllerSalario cs = new ControllerSalario();
        try {
            pagos = cs.getAllUltimosPagos(idEmpleado);
            out = new Gson().toJson(pagos);
        } catch (Exception e) {
            e.printStackTrace();
            out = """
              {"error" : "Ocurrió un error, intente más tarde."}
              """;
        }
        return Response.ok(out).build();
    }
    
}
