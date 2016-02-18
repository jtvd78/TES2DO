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
var gridColor = "#888888";
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

//List of Sections being displayed
var sectionList = [];

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
	var canvas = document.getElementById("scheduleCanvas");

	var rect = canvas.getBoundingClientRect();
	mouseX = Math.round((event.clientX-rect.left)/(rect.right-rect.left)*canvas.width);
	mouseY = Math.round((event.clientY-rect.top)/(rect.bottom-rect.top)*canvas.height);

	repaint();
}

//Updates global variables. Called when repaint() is called
function updateVariables(){
	var canvas=document.getElementById("scheduleCanvas");
	width = canvas.width;
	height = canvas.height;
	dayWidth = width / daysOfWeek;
	

	var maxTime = 0;
	var minTime = 24*60;

	//Set bounds of schedule
	for(var s in sectionList){
		var section = sectionList[s];
		var classTimes = section.getClassTimes();


		for(ct in classTimes){
			var classTime = classTimes[ct];

			if(classTime.startTime.toMinutes() < minTime){
				minTime = classTime.startTime.toMinutes();
			}

			if(classTime.endTime.toMinutes() > maxTime){
				maxTime = classTime.endTime.toMinutes();
			}
		}
	}

	startHour = minTime/60-2;
	endHour = maxTime/60+2;

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

	//Draws each classtime in the list of courses
	for(var s in sectionList){
		var section = sectionList[s];
		var classTimes = section.getClassTimes();

		for(ct in classTimes){
			drawClassTime(classTimes[ct], context);		
		}
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
	context.lineWidth = 1;

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

	context.lineWidth = 2;

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

		//Draws discussion/lecture outline
		if(classTime.lecture){
			context.strokeStyle = "#00FF00";
		}else{
			context.strokeStyle = "#FF0000";
		}
		
		context.beginPath();
		context.rect(ctX + 1, ctY + 1, ctWidth - 2, ctHeight - 2);
		context.stroke();

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
	var timeString = new Time(pxToMin(mouseY)).toString();
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
				'<ol id="section-' + section.id + '-'+ course.id +'-ol" class="closed">');

				//lecture
				$('#section-' + section.id + '-'+ course.id +'-ol').append(
					'<li id="courseTime-' + section.id + '-' + course.id + '-lecture-li" class="file classTime hidden">' +
					"Lecture: (" + section.lecture.startTime.toString() +" - "+  section.lecture.endTime.toString()+")</li>"

					);

				//discussions
				for(var d in section.discussions){
					var discussion = section.discussions[d];
					$('#section-' + section.id + '-'+ course.id +'-ol').append(
					'<li id="courseTime-' + section.id + '-' + course.id + '-dis' + d + '-li" class="file classTime hidden">' +
					"Dicussion " + d + ": (" + discussion.startTime.toString() +" - "+   discussion.endTime.toString()+")</li>"
					);
				}
			}
		}
	}

	$(".classTime").click(function(event){
		toggleDisplayed(event.target);
	});
}

function toggleDisplayed(element){

	//Check if item is a classTime
	var idString = element.parentElement.id;
	var section = getSectionById(idString);
	var parentElement = $('#' + idString);
	var children = parentElement.children();
	
	if(parentElement.hasClass("open")){
		parentElement.toggleClass("open closed");

		$('#' + idString + '> li').each(function () {
			console.log(this);
			$(this).toggleClass("displayed hidden"); 

		});

		sectionList.splice(sectionList.indexOf(section),1);
	}else{		
		parentElement.toggleClass("open closed");


		$('#' + idString + '> li').each(function () {
			$(this).toggleClass("displayed hidden"); 

		});

		sectionList.push(section);
	}

	repaint();
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

	this.lecture = new ClassTime(obj.lecture, true, this);

	if('discussions' in obj){
		this.discussions = [];
		for(var d in obj.discussions){
			this.discussions.push(new ClassTime(obj.discussions[d], false, this));
		}
	}

	this.getClassTimes = function(){
		var dup = [this.lecture];
		for(var d in this.discussions){
			dup.push(this.discussions[d]);
		}

		return dup;
	}
}

function ClassTime(obj, lecture, section){
	this.days = obj.days;
	this.startTime = new Time(obj.startTime);
	this.endTime = new Time(obj.endTime);
	this.color = section.color;
	this.section = section;
	this.lecture = lecture;
}

function Time(minutes){

	this.minutes = minutes;

	this.toMinutes = function(){
		return minutes;
	};

	this.toString = function(){

		var min = this.toMinutes();
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

		out += Math.floor(newMin);

		if(pm > 0){
			out += " PM";
		}else{
			out += " AM";
		}

		return out;
	}
}

function getSectionById(idString){
	var split = idString.split('-');
	var sectionID = split[1];
	var courseID = split[2];

	for(var p in tree.prefixes){
		var prefix = tree.prefixes[p];
		for(var c in prefix.courses){

			var course = prefix.courses[c];
			if(course.id != courseID){
				continue;
			}
			
			for (var s in course.sections){
				var section = course.sections[s];
				if(section.id == sectionID){
					return section;
				}
			}
		}
	}
}