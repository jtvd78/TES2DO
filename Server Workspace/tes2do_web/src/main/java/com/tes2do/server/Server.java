package main.java.com.tes2do.server;

//Import required java libraries
import java.io.*;
import java.util.Enumeration;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;

import main.java.com.tes2do.schedule.Schedule;

import com.google.gson.Gson;

//Extend HttpServlet class
@WebServlet(value="/json", loadOnStartup=1)
public class Server extends HttpServlet {
	
	@Override
	public void init() throws ServletException{
	   System.out.println("Servlet Init init");
	}
	
	@Override
	public void doGet(HttpServletRequest request,HttpServletResponse response) throws ServletException, IOException{
		
	   response.setContentType("text/html");
	   PrintWriter out = response.getWriter();
	   
	   String requestedClass = request.getParameter("class");
	   requestedClass = requestedClass.toUpperCase();
	   
	   Schedule s = new Schedule();
	   s.addCourseById(requestedClass);
   		
	   String json = new Gson().toJson(s);
	   out.println(json);
	}
	
	@Override
	public void destroy(){
	   // do nothing.
	}
}