package com.tes2do.schedule;

import java.util.ArrayList;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Prefix {
	
	String title;
	ArrayList<Course> courses = new ArrayList<Course>();
	
	public Prefix(Element e){
		
		title = e.select(".course-prefix-info").text();
		Elements courseElements = e.select(".course");
		
		for(int i = 0; i < courseElements.size(); i++){
			courses.add(new Course(courseElements.get(i)));
		}
	}
	
	public boolean removeCourse(Course c){
		return courses.remove(c);
	}
}
