package com.tes2do.schedule;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Section{
	
	private int openSeats;
	private int totalSeats;	
	private int waitlistSize;
	
	private String sectionID;
	private String professor;
	
	private ClassTime lecture;
	private ClassTime[] discussions;
	
	public Section(Element e){
		
		sectionID = e.select(".section-id-container").text();
		professor = e.select(".section-instructor").text();
		
		openSeats = Integer.parseInt(e.select(".open-seats-count").text());
		totalSeats = Integer.parseInt(e.select(".total-seats-count").text());
		waitlistSize = Integer.parseInt(e.select(".waitlist-count").get(0).text());		
		
		//times
		Elements times = e.select(".class-days-container").select(".row");		
		
		//Make sure classes have a "-" in their times to make sure we can read them
		int size = 0;
		for(int i = 0; i < times.size(); i++){
			if(times.get(i).text().contains("-")){
				size++;
			}
		}
		
		//Class does not have standard timing
		if(size == 0){
			return;
		}		
		
		lecture = new ClassTime(times.get(0), true);
		
		discussions = new ClassTime[size-1];
		for(int i = 1; i < size; i++){
			discussions[i-1] = new ClassTime(times.get(i), false);
		}
	}
	
	public int getOpenSeats(){
		return openSeats;
	}
	
	public String toString(){
		return sectionID + " : " + professor + " : " + lecture + " - " + "Total: " + totalSeats + " Open: " + openSeats + " WL: " + waitlistSize;
	}
	
	public ClassTime getLecture(){
		return lecture;
	}
	
	public ClassTime[] getDiscussionTimes(){
		return (ClassTime[]) discussions.clone();
	}
	
	public String getSectionID(){
		return sectionID;
	}
}