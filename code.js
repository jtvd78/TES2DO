//START SETTINGS
//Does it need an explaination?
var fontSize = 20;

//The font
var font = "Arial";

//The hours of the edge of the schedule. Values of 0-24. 6.5 would be 6:30AM, 13.5 would 1:30 PM
var startHour = 8;
var endHour = 7 + 12;

//The number of days to display in the week. 
var daysOfWeek = 5;			

//Color settings
var gridColor = "#FFFFFF";
var timeLineColor = "#FF0000";
var backgroundColor = "#000000";
//END SETTINGS

//Current X and Y position of the mouse on the canvas
var mouseX;
var mouseY;

//Width, in pixels, of each day
var dayWidth;

//The number of minutes per pixel in the Y direction
var minPerPixelY;	

//Width and height of the canvas
var width, height;

//Displays the timeline when true. This gets toggled when the mouse enters and exits the canvas
var displayTimeLine = true;

//List of ClassTimes being displayed
var classTimeList = [];

//Kind of like a main method
$( document ).ready(function() {
	start();	
});	

//First method called when the page is ready
function start(){
	$("#scheduleCanvas").mousemove(mouseMoved);
	$("#scheduleCanvas").mouseenter(function() {
		setDisplayTimeLine(true);
	}).mouseleave(function() {
		setDisplayTimeLine(false);
	});

	repaint();
}

//Sets whether or not to display the timeline
function setDisplayTimeLine(display){
	displayTimeLine = display;
	repaint();
}

//Called when the mouse is moved on the canvas
function mouseMoved(event){
	var offset = $("#scheduleCanvas").offset();

	mouseX = event.clientX - offset.left;
	mouseY = event.clientY - offset.top;

	repaint();
}

//Updates global variables. Called when repaint() is called
function updateVariables(){
	var canvas=document.getElementById("scheduleCanvas");
	width = canvas.width;
	height = canvas.height;
	dayWidth = width / daysOfWeek;
	minPerPixelY = (endHour - startHour)*60/height;
}

//Repaints the canvas
function repaint(){
	updateVariables();

	var canvas=document.getElementById("scheduleCanvas");
	var context=canvas.getContext("2d");

	//Sets font to above setting
	context.font= fontSize + "px " + font;

	//Centers font
	context.textAlign="center"; 
	context.textBaseline="middle";

	//Draws background and grid
	drawBackground(context);
	drawGrid(context);

	//Draws each classtime in the list of classtimes
	for(c = 0; c < classTimeList.length; c++){
		ct = classTimeList[c];
		drawClassTime(ct, context);				
	}

	//Draws the timeline if its corrosponding boolean is true
	if(displayTimeLine){
		drawTimeLine(context);
	}	
}

//Draws backgound
function drawBackground(context){
	context.fillStyle = backgroundColor;
	context.fillRect(0,0,width,height);
}

//Draws grid
function drawGrid(context){
	context.strokeStyle = gridColor;

	//Vertical
	for(i = 1; i < daysOfWeek;  i++){
		context.beginPath();
		context.moveTo(dayWidth*i,0);
		context.lineTo(dayWidth*i,height);
		context.stroke();
	}

	//Horizontal
	var startingHour = Math.floor(startHour);
	for(h = startingHour; h < Math.ceil(endHour); h++){
		var y = (h-startHour)*60/minPerPixelY;
		context.beginPath();
		context.moveTo(0,y);
		context.lineTo(width, y);
		context.stroke();
	}
}

//Draws a classtime
function drawClassTime(classTime, context){

	//Loops through the days
	for(dayCtr = 0; dayCtr < classTime.days.length; dayCtr++){

		//Day of the week being drawn
		var day = classTime.days[dayCtr];					
		
		//Info about classtime in minutes
		var startMin = classTime.startTime.toMinutes();
		var endMin = classTime.endTime.toMinutes();
		var lengthMin = (endMin-startMin);

		//Info about classtime in pixels
		var ctX = day*dayWidth;
		var ctY = (startMin - startHour*60)/minPerPixelY;
		var ctWidth = dayWidth;
		var ctHeight = lengthMin/minPerPixelY;

		//Draws classtime box
		context.fillStyle = classTime.color;
		context.fillRect(ctX, ctY, ctWidth, ctHeight);

		//Draws classtime text
		context.fillStyle = "#000000";
		context.drawText(classTime.section.course.id + "\n" + classTime.section.id, ctX + ctWidth/2,ctY + ctHeight/2);
	}
}

//Prototype function to allow multiline text drawing through a context object
CanvasRenderingContext2D.prototype.drawText = function(text, x, y){
	var lines = text.split("\n");
	var lineHeight = fontSize;

	for(i = 0; i < lines.length; i++){
		var adj = i - (lines.length - 1)/2
		var lineOffset = adj*lineHeight;
		this.fillText(lines[i], x, y + lineOffset);
	}
}

//Draws the timeline at the mouse
function drawTimeLine(context){
	
	//Sets proper colors
	context.fillStyle = timeLineColor;
	context.strokeStyle = timeLineColor;
	

	//Gets the time string, and draws it
	var timeString = minToString(pxToMin(mouseY));
	context.fillText(timeString, mouseX,mouseY - fontSize/2);

	//Draws the horizonal line
	context.beginPath();
	context.moveTo(0,mouseY);
	context.lineTo(width, mouseY);
	context.stroke();
}

//Returns a random color
function getRandomColor(){
	var letters = '0123456789ABCDEF'.split('');
	var color = '#';
	for (var i = 0; i < 6; i++ ) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

//Converts a pixel's Y coordinate to minutes
function pxToMin(px){
	return startHour*60 + (px/height)*((endHour - startHour)*60)
}

//Converts minutes to a time string
function minToString(min){

	var newMin = min % 60;
	var hour = (min - newMin) / 60;
	var pm = Math.floor(hour / 12);
	hour -= pm*12;

	if(hour == 0){
		hour = 12;
	}

	var out = hour + ":" 

	if(newMin < 10){
		out+="0";
	}

	out += Math.round(newMin);

	if(pm > 0){
		out += " PM";
	}else{
		out += " AM";
	}

	return out;
}

////
var tree;

$(document).ready(function(){

	
	$.getJSON("TestData.json", function(data){
		tree = new Tree(data);
		generateTree(tree);
	})
	
	/*
	$.getJSON("http://localhost:8001/test/", function(data){
		tree = new Tree(data);
		generateTree(tree);
	})
	*/
});		

function generateTree(tree){
	$("#treeDiv").append('<ol id ="treeOl" class="tree">');

	for(var p in tree.prefixes){

		var prefix = tree.prefixes[p];

		$("#treeOl").append(
			'<li id="prefix-' + prefix.code + '-li">' + 
			'<label for="prefix-' + prefix.code + '">' + prefix.title + '</label>' + 
			'<input type="checkbox" id="prefix-' + prefix.code +'">' + 
			'<ol id="prefix-' + prefix.code + '-ol">');

		for(var c in prefix.courses){

			var course = prefix.courses[c];
			$('#prefix-' + prefix.code + '-ol').append(
			'<li  id="course-' + course.id + '-li">' + 
			'<label for="course-' + course.id + '">' + course.id + " : " +course.name + '</label>' + 
			'<input type="checkbox" id="course-' + course.id +'">' + 
			'<ol id="course-' + course.id  + '-ol">');
			
			for (var s in course.sections){
				var section = course.sections[s];
				$('#course-' + course.id + '-ol').append(
				'<li  id="section-' + section.id + '-'+ course.id + '-li">' + 
				'<label for="section-' + section.id + '-'+ course.id + '">' + section.id + " : " + section.professor + '</label>' + 
				'<input type="checkbox" id="section-' + section.id + '-'+ course.id +'">' + 
				'<ol id="section-' + section.id + '-'+ course.id +'-ol">');

				//lecture
				$('#section-' + section.id + '-'+ course.id +'-ol').append(
					'<li id="courseTime-' + section.id + '-' + course.id + '-lecture-li" class="file classTime hidden">' +
					"Lecture</li>"

					);

				//discussions
				for(var d in section.discussions){
					var discussion = section.discussions[d];
					$('#section-' + section.id + '-'+ course.id +'-ol').append(
					'<li id="courseTime-' + section.id + '-' + course.id + '-dis' + d + '-li" class="file classTime hidden">' +
					"Dicussion" + d + "</li>"
					);
				}
			}
		}
	}

	$(".classTime").click(function(event){
		toggleDisplayed(event.target.id);
	});
}

function Tree(obj){

	this.prefixes = [];
	for(var p in obj.prefixes){
		this.prefixes.push(new Prefix(obj.prefixes[p]));
	}				
}

function Prefix(obj){

	this.title = obj.title;
	this.code = obj.code;
	this.courses = [];
	for(var c in obj.courses){
		this.courses.push(new Course(obj.courses[c]));
	}
}

function Course(obj){
	this.id = obj.id;
	this.name = obj.name;	
	this.credits = obj.credits;
	this.subcats = obj.subcats;
	this.desctiption - obj.desctiption;
	
	this.color = getRandomColor();	

	this.sections = [];
	for(var s in obj.sections){
		this.sections.push(new Section(obj.sections[s], this));
	}
}

function Section(obj, course){
	this.color = course.color;
	this.course = course;

	this.open = obj.open;
	this.total = obj.total;
	this.waitlist = obj.waitlist;

	this.id =  obj.id;
	this.professor = obj.professor;	

	this.lecture = new ClassTime(obj.lecture, this);

	if('discussions' in obj){
		this.discussions = [];
		for(var d in obj.discussions){
			this.discussions.push(new ClassTime(obj.discussions[d], this));
		}
	}
}

function ClassTime(obj, section){
	this.days = obj.days;
	this.startTime = new Time(obj.startTime);
	this.endTime = new Time(obj.endTime);
	this.color = section.color;
	this.section = section;
}

function Time(minutes){

	this.min = minutes % 60;
	this.hour = (minutes - this.min) / 60;

	this.toMinutes = function(){
		return this.hour*60 + this.min;
	};
}

function toggleDisplayed(idString){

	//Check if item is a classTime
	var classTime = getClassTimeByIdString(idString);

	if($('#'+idString).hasClass("displayed")){
		$('#'+idString).toggleClass("displayed hidden");
		classTimeList.splice(classTimeList.indexOf(classTime),1);
	}else{
		$('#'+idString).toggleClass("displayed hidden");
		classTimeList.push(classTime);
	}
	
	repaint();
}

function getClassTimeByIdString(idString){
	console.log(idString);

	var split = idString.split('-');
	var sectionID = split[1];
	var courseID = split[2];

	var lecture = false;
	var disNumber = 0;
	if(split[3] == 'lecture'){
		lecture = true;
	}else{
		disNumber = split[3].split("dis")[1];
	}

	for(var p in tree.prefixes){
		var prefix = tree.prefixes[p];
		for(var c in prefix.courses){

			var course = prefix.courses[c];
			if(course.id != courseID){
				continue;
			}
			
			for (var s in course.sections){
				var section = course.sections[s];
				if(section.id != sectionID){
					continue;
				}
				
				if(lecture){
					return section.lecture;
				}else{
					return section.discussions[disNumber];
				}
			}
		}
	}
}