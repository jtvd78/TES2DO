package main.java.tes2do.server;

//Import required java libraries
import java.io.*;
import java.util.Enumeration;

import javax.servlet.*;
import javax.servlet.http.*;

import main.java.com.tes2do.schedule.Schedule;

import com.google.gson.Gson;

//Extend HttpServlet class
public class Server extends HttpServlet {

	private String message;
	
	@Override
	public void init() throws ServletException{
	   // Do required initialization
	   message = "Hello World";
	}
	
	@Override
	public void doGet(HttpServletRequest request,HttpServletResponse response)
	         throws ServletException, IOException{
	   // Set response content type
	   response.setContentType("text/html");
	
	   // Actual logic goes here.
	   PrintWriter out = response.getWriter();
	   
	   String requestedClass = request.getParameter("class");	
		
		
	   
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