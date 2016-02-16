package com.tes2do.schedule;

import java.io.IOException;
import java.util.ArrayList;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

import com.tes2do.helper.Tools;
import com.tes2do.helper.URLMaker;

public class Course{
	
	int credits;
	String courseID;
	String courseName;
	String description;
	GenEdSubcat[] subCats;
	ArrayList<Section> sections = new ArrayList<Section>();
	
	public Course(Element e){
		courseID = e.attr("id");
		subCats = getSubCats(e);
		initSections();
		courseName = e.select(".course-title").text();
		description = e.select(".approved-course-text").text();
		credits = Integer.parseInt(e.select(".course-min-credits").text());		
	}
	
	public String getDescription(){
		return courseID + ": " + courseName + "\nGen Ed Subcategories: " +
				Tools.arrToString(subCats, ",") + "\nCredits: " +
				credits + "\nDescription: " + description;
	}
	
	public String getName(){
		return courseName;
	}
	
	public boolean equalsCourse(Course course){		
		//Two courses are equal if they have the same ID
		if(courseID.equals(course.getCourseID())){
			return true;
		}else{
			return false;
		}
	}
	
	private GenEdSubcat[] getSubCats(Element e){
		Elements cats = e.select(".course-subcategory");
		GenEdSubcat[] out = new GenEdSubcat[cats.size()]; 
		for(int i = 0; i < cats.size(); i++){
			for(GenEdSubcat ges : GenEdSubcat.values()){
				if(cats.get(i).text().contains(ges.toString())){
					out[i] = ges;
				}
			}
		}
		
		//TODO this
		String str = e.select(".gen-ed-codes-group").text();
				
		
		return out;
	}
	
	public String toString(){
		return courseID + ": " + Tools.arrToString(subCats, ",") + " : " + courseName;
	}
	
	public GenEdSubcat[] getSubCats(){
		return subCats.clone();
	}
	
	/**
	 * @return String representing courseID
	 */
	public String getCourseID(){
		return courseID;
	}
	
	private void initSections(){		
		try {
			Document times = Jsoup.connect(URLMaker.getCourseTimeURL(courseID)).get();
			Elements sectionElements = times.select(".section");
			
			
			//Makes sure that a section's times include standard times.
			for(int i = 0; i < sectionElements.size(); i++){
				if(sectionElements.get(i).select(".section-day-time-group").text().contains("-")){
					sections.add(new Section(sectionElements.get(i)));
				}
			}
			
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}
}