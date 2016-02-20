package main.java.com.tes2do.server;

import java.util.Set;

import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

public class JSONWebAppInitializer implements ServletContainerInitializer {
	@Override
	public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
		ServletRegistration reg = ctx.addServlet("json", "main.java.tes2do.server.Server");
		reg.addMapping("/json");
	}
 }