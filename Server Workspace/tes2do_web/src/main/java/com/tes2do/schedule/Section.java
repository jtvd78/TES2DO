package main.java.com.tes2do.schedule;

import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

public class Section{
	
	private int open;
	private int total;	
	private int waitlist;
	
	private String id;
	private String professor;
	
	private ClassTime lecture;
	private ClassTime[] discussions;
	
	public Section(Element e){
		
		id = e.select(".section-id-container").text();
		professor = e.select(".section-instructor").text();
		
		open = Integer.parseInt(e.select(".open-seats-count").text());
		total = Integer.parseInt(e.select(".total-seats-count").text());
		waitlist = Integer.parseInt(e.select(".waitlist-count").get(0).text());		
		
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
		return open;
	}
	
	public String toString(){
		return id + " : " + professor + " : " + lecture + " - " + "Total: " + total + " Open: " + open + " WL: " + waitlist;
	}
	
	public ClassTime getLecture(){
		return lecture;
	}
	
	public ClassTime[] getDiscussionTimes(){
		return (ClassTime[]) discussions.clone();
	}
	
	public String getSectionID(){
		return id;
	}
}