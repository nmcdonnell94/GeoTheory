/**This JavaScript file contains the model specifically for the page pascal.html
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
	selectedElement = true;
	draw = false;
	
	//creates all the points and their positions based on the size of the canvas
	rect = canvas.getBoundingClientRect();
	point1 = new Point(0, (rect.height/2)-(rect.width/2));
	point2 = new Point(rect.width/2, 0);
	point3 = new Point(rect.width, (rect.height/2)-(rect.width/2));
	point4 = new Point(rect.width, (rect.height/2)+(rect.width/2));
	point5 = new Point(rect.width/2, rect.height);
	point6 = new Point(0, (rect.height/2)+(rect.width/2));
	
	//creates all the lines using the points
	line11 = new Line(point1, point5);
	line12 = new Line(point1, point4);
	line21 = new Line(point2, point6);
	line22 = new Line(point2, point4);
	line31 = new Line(point3, point6);
	line32 = new Line(point3, point5);
	
	//creates the lineIntersections using the lines
	lineI1 = new LineIntersection(line11, line21);
	lineI2 = new LineIntersection(line12, line31);
	lineI3 = new LineIntersection(line22, line32);
	
	//Puts all the points in an array
	points = [point1, point2, point3, point4, point5, point6];
	//creates circle based on cnavas size
	circle = new Circle(new Point(rect.width/2, rect.height/2), (rect.width-40)/2);
	
	//creates PointsOnCircle
	theorem = new PointOnCircle(points, circle);
	//creates Pascal's line
	theoremLine = new Line(lineI1.getIP(), lineI3.getIP());
	
	//Adds observers for each point
	for(var i=0; i<points.length; i++){
		points[i].addObserver(theorem);
		
		if(i===0||i===1||i===4||i===5){
			points[i].addObserver(lineI1);
		}
		if(i===0||i===3||i===2||i===5){
			points[i].addObserver(lineI2);	
		}
		if(i===1||i===3||i===2||i===4){
			points[i].addObserver(lineI3);
		}
	}
	
	//notify each observer to make sure all the constraints on the points hold
	for(var i=0; i<points.length; i++){
		points[i].notify();
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
function selectPoint (x, y){
	
	//Since it is unlikely that they will ever fall on exacty the same point I have given a margin of 20
	if (x < point1.getX()+20 && x > point1.getX()-20 && y < point1.getY()+20 && y > point1.getY()-20){
		return point1;
	} else if (x < point2.getX()+20 && x > point2.getX()-20 && y < point2.getY()+20 && y > point2.getY()-20){
		return point2;
	} else if (x < point3.getX()+20 && x > point3.getX()-20 && y < point3.getY()+20 && y > point3.getY()-20){
		return point3;
	} else if (x < point4.getX()+20 && x > point4.getX()-20 && y < point4.getY()+20 && y > point4.getY()-20){
		return point4;
	} else if (x < point5.getX()+20 && x > point5.getX()-20 && y < point5.getY()+20 && y > point5.getY()-20){
		return point5;
	} else if (x < point6.getX()+20 && x > point6.getX()-20 && y < point6.getY()+20 && y > point6.getY()-20){
		return point6;
	} else {
		return true;
	}
	
}

/**This method paints geometric elements on the canvas using the data stored in the model
 * 
 */
function paint(){
	
	//clears original drawing on the canvas
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	buildFullLine(ctx, theoremLine, "#3B7B0F", true);
	buildLineInt(ctx, lineI1);
	buildLineInt(ctx, lineI2);
	buildLineInt(ctx, lineI3);
	buildCircle(ctx, circle);
	buildPoints(ctx, points, "#269FFC", 4);
	
}