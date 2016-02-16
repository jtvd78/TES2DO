package com.tes2do.server;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import com.tes2do.schedule.Schedule;

public class MainServer {
	
	public static void main(String[] args) throws Exception {
        HttpServer server = HttpServer.create(new InetSocketAddress(8001), 0);
        server.createContext("/test", new MyHandler());
        server.setExecutor(null); // creates a default executor
        server.start();
    }

    static class MyHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t){
        	
            try {   
            	Schedule s = new Schedule();
	    		s.addCourseById("MATH141");
	    		s.addCourseById("CMSC132");
	    		s.addCourseById("ENEE101");
	    		String response = new Gson().toJson(s);
	    	//	System.out.println(response);
				
				OutputStream os = t.getResponseBody();	    		
	    		t.sendResponseHeaders(200, response.length());
	    		os.write(response.getBytes());
	    		os.close();
	    		
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
            
        }
    }
}