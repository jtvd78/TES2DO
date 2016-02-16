package com.tes2do.schedule;

import org.jsoup.nodes.Element;
/**
 * ClassTime. Can be a lecture or not, but has a start time, end time, and a set of days on which it occurs on. 
 * @author Justin
 *
 */
public class ClassTime{
	
	private Time startTime;
	private Time endTime;
	private int[] days;
	private boolean lecture;
	
	/**
	 * Constructor that makes a ClassTime from an HTML Element e
	 * @param e HTML Element
	 * @param section parentSection
	 * @param lecture boolean if lecture or not
	 */
	public ClassTime(Element e, boolean lecture){
		days = Time.getDays(e.select(".section-days").text());		
		startTime = new Time(e.select(".class-start-time").text());
		endTime = new Time(e.select(".class-end-time").text());
		this.lecture = lecture;
	}
	
	/**
	 * Creates a ClassTime starting and ending at the given times. 
	 * The classtime is not a lecture,
	 * and takes place on M, Tu, W, Th, and F
	 * @param startTime - Time that the ClassTime starts at
	 * @param endTime - Time that the ClassTime ends at
	 */
	public ClassTime(Time startTime, Time endTime){
		this.startTime = startTime;
		this.endTime = endTime;
		this.days = new int[]{0,1,2,3,4};
		this.lecture = false;
	}
	
	/**
	 * Returns a description of the ClassTime
	 */
	public String getDescription(){
		return (lecture ? "Lecture: " : "Discussion: ") + days + "\nStart Time: " +
				startTime.toString() + "\nEndTime: " +
				endTime.toString();
				
	}
	
	/**
	 * Whether or not this ClassTime is a lecture
	 * @return If the ClassTime is a lecture
	 */
	public boolean isLecture(){
		return lecture;
	}
	
	/**
	 * When the ClassTime starts
	 * @return The starting time
	 */
	public Time getStartTime(){
		return startTime;
	}
	
	/**
	 * When the ClassTime ends
	 * @return The ending time
	 */
	public Time getEndTime(){
		return endTime;
	}

	public String toString(){
		return (lecture ? "Lecture " : "Discussion ") + "(" + startTime + " - " + endTime + " : " + days + ")";
	}
}