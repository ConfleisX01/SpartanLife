package com.spartan_life.software.rest;

import com.google.gson.Gson;
import com.spartan_life.software.controller.ControllerUsuario;
import com.spartan_life.software.model.Usuario;
import jakarta.ws.rs.DefaultValue;
import jakarta.ws.rs.FormParam;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.QueryParam;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.sql.SQLException;
import java.util.List;

@Path("usuario")
public class RestUsario {

    @Path("insertarUsuario")
    @Produces(MediaType.APPLICATION_JSON)
    @POST
    public Response insertarUsuario(@FormParam("usuario") @DefaultValue("") String u) {
        String out = "";
        ControllerUsuario cu = new ControllerUsuario();
        Gson gson = new Gson();

        try {

            Usuario usuario = gson.fromJson(u, Usuario.class);
            //para poder compar datos
            Usuario usuarioLocal = cu.insertarUsuario(usuario);
            if (usuarioLocal != null) {
                out = """
                  {"response" : "operacion exitosa"}
                  """;
                out = String.format(out, u);

            } else {
                out = """
                  {"response" : "Error en la transacción"}
                  """;
                out = String.format(out, u);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
            out = """
                  {"response" : "Error en la transacción"}
                  """;
        }
        return Response.status(Response.Status.CREATED).entity(out).build();
    }

    @Path("loginUsuario")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response loginUser(@QueryParam("nombre") String nombre,
            @QueryParam("contrasenia") String contrasenia) {

        ControllerUsuario cu = new ControllerUsuario();
        Usuario u = cu.loginUser(nombre, contrasenia);
        Gson gson = new Gson();

        String out = "";
        out = gson.toJson(u);
        System.out.println("Hola desde Login : " + out);

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("traerUsuario")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response traerUsuario(@QueryParam("nombre") String nombre) throws SQLException {
        ControllerUsuario cu = new ControllerUsuario();
        List<Usuario> usuarios = cu.traerUsuario();
        Gson gson = new Gson();

        String out = gson.toJson(usuarios);
        System.out.println("Hola desde Login : " + out);

        return Response.status(Response.Status.OK).entity(out).build();
    }

    @Path("verificarSesion")
    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response verificarSesion(@QueryParam("token") @DefaultValue("") String token) {
        String out = "";
        ControllerUsuario cu = new ControllerUsuario();
        Gson gson = new Gson();

        try {
            Usuario user = cu.verificarSessionUsuario(token);
            if (user != null) {
                out = gson.toJson(user);
            } else {
                out = """
                      {"response" : false}
                      """;
            }
        } catch (Exception e) {
            e.printStackTrace();
            out = """
                  {"response" : "SERVER_ERROR"}
                  """;
        }
        return Response.ok(out).build();
    }
}
