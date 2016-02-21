package main.java.com.tes2do.server;

import java.util.Set;

import javax.servlet.ServletContainerInitializer;
import javax.servlet.ServletContext;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.ServletException;
import javax.servlet.ServletRegistration;

public class JSONWebAppInitializer implements ServletContainerInitializer, ServletContextListener{

	boolean initialized = false;
	
	@Override
	public void onStartup(Set<Class<?>> c, ServletContext ctx) throws ServletException {
		System.out.println("onStartup");
		
		if(!initialized){
			ServletRegistration reg = ctx.addServlet("json", "main.java.tes2do.server.Server");
			reg.addMapping("/json");
			initialized = true;
		}
	}

	@Override
	public void contextDestroyed(ServletContextEvent arg0) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void contextInitialized(ServletContextEvent e) {
		System.out.println("contextInitialized");
		
		if(!initialized){
			ServletRegistration reg = e.getServletContext().addServlet("json", "main.java.tes2do.server.Server");
			reg.addMapping("/json");
			initialized = true;
		}
	}
 }