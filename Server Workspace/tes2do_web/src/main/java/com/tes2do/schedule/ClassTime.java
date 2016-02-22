package main.java.com.tes2do.schedule;

import java.util.ArrayList;

import org.jsoup.nodes.Element;
/**
 * ClassTime. Can be a lecture or not, but has a start time, end time, and a set of days on which it occurs on. 
 * @author Justin
 *
 */
public class ClassTime{
	
	public enum Day{
		M, Tu, W, Th, F
	}
	
	private int startTime;
	private int endTime;
	private int[] days;
	private boolean lecture;
	
	String building;
	String room;
	
	
	/**
	 * Constructor that makes a ClassTime from an HTML Element e
	 * @param e HTML Element
	 * @param section parentSection
	 * @param lecture boolean if lecture or not
	 */
	public ClassTime(Element e, boolean lecture){
		
		this.lecture = lecture;		
		days = getDays(e.select(".section-days").text());		
		startTime = getTimeInMinutes(e.select(".class-start-time").text());
		endTime = getTimeInMinutes(e.select(".class-end-time").text());
		
		String buildingText = e.select(".class-building").text();
		String[] buildingParts = buildingText.split(" ");
		building = buildingParts[0];
		room = buildingParts[1];	
	}
	
	/**
	 * Creates a time from a string. The string must be in the specific format from the UMD Soc Website, or this will not work
	 * @param timeString - String to parse
	 */
	public static int getTimeInMinutes(String timeString){	
		int colanPos = timeString.indexOf(':');
		String first = timeString.substring(0, colanPos);
		String second = timeString.substring(colanPos+1, colanPos+1 + 2);
		String end = timeString.substring(timeString.length()-2, timeString.length());
		
		int hour = Integer.parseInt(first);
		int min = Integer.parseInt(second);
		boolean PM;
		if(end.toLowerCase().equals("am")){
			PM = false;
		}else{
			PM = true;
		}
		
		int result = 0;
		if(PM && hour != 12){
			result += 12 * 60;
		}else if(!PM && hour == 12){
			result -= hour*60;
		}
		result += hour * 60;
		result += min;
		return result;
	}	
	
	//I don't like this being here. That's why its not documented
	public static int[] getDays(String daysString){
		
		ArrayList<Integer> daysList = new ArrayList<Integer>();
		
		for(int i = 0; i < Day.values().length; i++){
			if(daysString.contains(Day.values()[i].toString())){
				daysList.add(i);
			}
		}
		
		int[] out = new int[daysList.size()];
		for(int i = 0; i < daysList.size(); i++){
			out[i] = daysList.get(i);
		}
		
		return out;
	}
	
	/**
	 * Returns a description of the ClassTime
	 */
	public String getDescription(){
		return (lecture ? "Lecture: " : "Discussion: ") + days + "\nStart Time: " +
				startTime + "\nEndTime: " +
				endTime;
				
	}
	
	/**
	 * Whether or not this ClassTime is a lecture
	 * @return If the ClassTime is a lecture
	 */
	public boolean isLecture(){
		return lecture;
	}

	public String toString(){
		return (lecture ? "Lecture " : "Discussion ") + "(" + startTime + " - " + endTime + " : " + days + ")";
	}
}