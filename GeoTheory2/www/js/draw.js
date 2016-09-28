/**This JavaScript file contains the model specifically for the page draw.html
 * 
 * @author Natalie McDonnell
 * @date 11-09-2016
 * 
 */

/** Method that creates all the objects needed for the canvas
 * 
 */
function startup() {
	
	//sets up canvas - method in controller.js
	canvasSettings();
	
	//initialises global variables
	selectedElement = null;
	draw = true;
	hidden = false;
	var button = document.getElementById("hide");
	button.value = "Hide";
	
	//creates all the points and their positions based on the size of the canvas
	rect = canvas.getBoundingClientRect();
	point1 = new Point(50, (rect.height/2)-(rect.width/4));
	point2 = new Point(rect.width/2, 70);
	point3 = new Point(rect.width-50, (rect.height/2)-(rect.width/4));
	point4 = new Point(rect.width/2, rect.height-70);
	point5 = new Point(50, (rect.height/2)+(rect.width/4));
	
	//Creates all the lines based on the points
	line11 = new Line(point1, point4);
	line21 = new Line(point2, point5);
	line31 = new Line(point3, point5);
	line32 = new Line(point3, point4);
	
	//creates the first line intersection
	lineI1 = new LineIntersection(line11, line21);
	
	//creates the arbitrary point and the line from the first intersection to the arbitrary point
	arbitraryPoint = new Point(rect.width-20,lineI1.getIP().getY());
	lineA = new Line(lineI1.getIP(), arbitraryPoint);
	
	//creates the next line intersections
	lineI2 = new LineIntersection(lineA, line31);
	lineI3 = new LineIntersection(lineA, line32);
	
	//creates two lines based on the two previous line intersections
	line12 = new Line(point1, lineI2.getIP());
	line22 = new Line(point2, lineI3.getIP());
	
	//creates the final line intersection
	lineI4 = new LineIntersection(line12, line22);
	
	//adds points and lines to arrays
	points = [point1,point2,point3,point4,point5];
	lines = [line11, line21, line31, line32];
	dashedLines = [line12, line22];
	observable = [point1, point2, point3, point4, point5, arbitraryPoint, lineI1.getIP(), lineI2.getIP(), lineI3.getIP()];
	//initialises the drawn curve
	arc = [];
	
	//Adds observers to observable elements
	for(var i = 0; i<observable.length; i++){
		observable[i].addObserver(lineI1);
		observable[i].addObserver(lineI2);
		observable[i].addObserver(lineI3);
		observable[i].addObserver(lineI4);
	}
	
	//paints the canvas
	paint();
	
}


/** This method returns the point that has been selected, if no point has been selected the method returns true
 * 
 * @param x a double is the x coordinated of the touch position
 * @param y a double is the y coordinated of the touch position
 * @returns the point which has been selected, if no points have been selected it will return true
 */
function selectPoint(x, y){
		
	//Since it is unlikely that they will ever fall on exacty the same point I have given a margin of 20
	if (x < arbitraryPoint.getX()+20 && x > arbitraryPoint.getX()-20 && y < arbitraryPoint.getY()+20 && y > arbitraryPoint.getY()-20){
		return arbitraryPoint;
	} else if (x < point2.getX()+20 && x > point2.getX()-20 && y < point2.getY()+20 && y > point2.getY()-20){
		return point2;
	} else if (x < point3.getX()+20 && x > point3.getX()-20 && y < point3.getY()+20 && y > point3.getY()-20){
		return point3;
	} else if (x < point4.getX()+20 && x > point4.getX()-20 && y < point4.getY()+20 && y > point4.getY()-20){
		return point4;
	} else if (x < point5.getX()+20 && x > point5.getX()-20 && y < point5.getY()+20 && y > point5.getY()-20){
		return point5;
	} else if (x < point1.getX()+20 && x > point1.getX()-20 && y < point1.getY()+20 && y > point1.getY()-20){
		return point1;
	} else {
		return true;
	}
	
}


/**This method paints geometric elements on the canvas using the data stored in the model
 * 
 */
function paint(){

	//clears the canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	if(hidden){
		
		//If hidden is true then only the curve will be drawn drawn 
		buildPoints(ctx, arc, "#3B7B0F", 1.5);
	
	} else {
	
		//If hidden is false then everything will be drawn
		buildLine(ctx, lineA, "#269FFC", false);

		for(var i = 0; i<lines.length; i++){
			buildLine(ctx, lines[i], "#000000", false);
		}

		for(var i = 0; i<dashedLines.length; i++){
			buildFullLine(ctx, dashedLines[i], "#FC645F", true);
		}

		buildPoints(ctx, arc, "#3B7B0F", 1.5);
		buildPoints(ctx, points,"#269FFC", 4);
		buildPoints(ctx, [lineI1.getIP()], "#FC645F", 4);
		buildPoints(ctx, [arbitraryPoint], "#ACF679", 7);
		buildPoints(ctx, [lineI4.getIP()], "#FC645F", 7);
		buildPoints(ctx, [lineI2.getIP(), lineI3.getIP()], "#000000", 4);
	}

}	
