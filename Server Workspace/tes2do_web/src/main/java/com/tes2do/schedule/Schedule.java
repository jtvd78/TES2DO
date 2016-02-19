package main.java.com.tes2do.schedule;

import java.io.IOException;
import java.util.ArrayList;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;

import main.java.com.tes2do.helper.URLMaker;

public class Schedule{
	
	ArrayList<Prefix> prefixes = new ArrayList<Prefix>();
	
	/**
	 * Merges this schedule with a given schedule
	 * Essentially appends the content of the given schedule to the current one. 
	 * @param s - Schedule to merge with
	 */
	public void merge(Schedule s){
		for(Prefix p : s.prefixes){
			prefixes.add(p);
		}
	}
	
	/**
	 * Reads a document, and scans for each course. 
	 * @param doc
	 */
	private void readDocument(Document doc){	
		
		Elements prefixElements = doc.select(".course-prefix-container");
		
		for(int i = 0; i < prefixElements.size(); i++){
			prefixes.add(new Prefix(prefixElements.get(i)));
		}
	}
	
	/**
	 * Adds a given gen ed subcat to the schedule
	 * @param ges - GenEdSubcat to add to Schedule
	 */
	public void addGenEdSubcat(GenEdSubcat ges){
		String url = URLMaker.getGenEdURL(ges);
		try {
			Document doc = (Document) Jsoup.connect(url).get();
			readDocument(doc);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	/**
	 * Adds a course, with a given ID, to the schedule, with the give color 
	 * @param course - Course ID String to add
	 * @param color - Color to add the course as
	 */
	public void addCourseById(String course){
		String url = URLMaker.getCourseURL(course);
		try {
			Document doc = (Document) Jsoup.connect(url).get();
			readDocument(doc);
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
}