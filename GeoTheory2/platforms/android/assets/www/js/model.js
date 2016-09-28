/**This JavaScript file contains the model for the application
 * 
 * @author Natalie McDonnell
 * @date 11-09-2016
 * 
 */

/** Button method to show or hide the tool.
 * 
 */
function hide(){
	if (hidden){
		//changes the value of hidden, then changes the button to show 'Hide'
		hidden = false;
		var button = document.getElementById("hide");
		button.value = "Hide";
	} else {
		//changes the value of hidden, then changes the button to show 'Show'
		hidden = true;
		var button = document.getElementById("hide");
		button.value = "Show";
	}
	
	//repaints the canvas
	paint();
}

function drawConic(){
	
	if(draw){
		if(selectedElement === arbitraryPoint){
			arc.push(new Point(lineI4.getIP().getX(), lineI4.getIP().getY()));
		}
	}
}

/** Method to draw multiple points on a canvas
 * 
 * @param ctx is the canvas context to be drawn on
 * @param points an array of Point objects to be drawn
 * @param colour a string of a HTML colour code that will be the colour of the point
 * @param radius an integer that will be the radius of the point
 */
function buildPoints(ctx, points, colour, radius){
	for(var i = 0; i<points.length; i++){
		//lets the canvas know to start drawing
		ctx.beginPath();
		//draws an arc
		ctx.arc(points[i].getX(), points[i].getY(), radius, 0, 2*Math.PI);
		//sets the fill colour
		ctx.fillStyle = colour;
		//fills the circle
		ctx.fill();
		//let the canvas know we have finished drawing 
		ctx.closePath();
	}	
}

/** This method draws a line on the canvas
 * 
 * @param ctx is the canvas context to be drawn on
 * @param line a Line object to be drawn
 * @param colour a string of a HTML colour code that will be the colour of the point
 * @param dashed a boolean to say whether the line should be dashed
 */
function buildLine(ctx, line, colour, dashed){
	
	//if dashed is true then sets the line to be dashed
	if(dashed){
		ctx.setLineDash([5]);
	} else {
		ctx.setLineDash([]);
	}
	
	ctx.beginPath();
	//Sets line colour and width
	ctx.strokeStyle = colour;
	ctx.lineWidth=2;
	//draws line from first point to second point
	ctx.moveTo(line.getP1().getX(), line.getP1().getY());
	ctx.lineTo(line.getP2().getX(), line.getP2().getY());
	//makes the line visible
	ctx.stroke();
	ctx.closePath();

}

/** This method will draw a line which passes through the two points given by creating a new Line object
 * and setting its end points to the edge of the canvas
 * 
 * @param ctx is the canvas context to be drawn on
 * @param colour a string of a HTML colour code that will be the colour of the point
 * @param dashed a boolean to say whether the line should be dashed
 */
function buildFullLine(ctx, line, colour, dashed){
	
	//build new Line object
	var fullLine = new Line(new Point(0,0), new Point(0,0));
	
	if(line.m() === Number.POSITIVE_INFINITY || line.m() === Number.NEGATIVE_INFINITY ){
		//If the gradient id +/- infinity then the new points are based on the canvas and one points x value
		fullLine.setP1(new Point(line.getP1.getX(), 0));
		fullLine.setP2(new Point(line.getP1.getX(), canvas.height));
	} else {
		//else the new points are calculated using the general formula of a line 
		fullLine.setP1(new Point(0, (-line.m()*line.getP1().getX())+line.getP1().getY()));
		fullLine.setP2(new Point(canvas.width, (line.m()*(canvas.width-line.getP1().getX()))+line.getP1().getY()));
	}
	
	//draws the line on the canvas
	buildLine(ctx, fullLine, colour, dashed);
	
}

/** This method draws a circle on the canvas
 * 
 * @param ctx is the canvas context to be drawn on
 * @param circle a Circle object that is to be drawn
 */
function buildCircle(ctx, circle){
	ctx.beginPath();
	ctx.linewidth = 2;
	ctx.arc(circle.getP().getX(), circle.getP().getY(), circle.getR(), 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
}

/** This method draws a line intersecting a line on the canvas
 * 
 * @param ctx is the canvas context to be drawn on
 * @param lines a LineIntersection object that is to be drawn
 */
function buildLineInt(ctx, lines){
	buildLine(ctx, lines.getL1(), "#000000", false);
	buildLine(ctx, lines.getL2(), "#000000", false);
	buildPoints(ctx, [lines.getIP()], "#FC645F", 4);
}


/**Method to draw a line intersecting a circle
 * 
 * @param ctx is the canvas context to be drawn on
 * @param circle is a IntersectCircle object that will be drawn
 */
function buildCircleLine(ctx, circle){
	//Draws circle and line
	buildCircle(ctx, circle.getC());
	buildLine(ctx, circle.getL(), "#000000", false);
	
	//Draws intersection points if they exist
	if(intersection1){
		buildPoints(ctx, [circle.getIP1()], "#269FFC", 4);
	}
	if(intersection2){
		buildPoints(ctx, [circle.getIP2()], "#269FFC", 4);
	}
}

/** This method returns a case as to which quadrant the point1 and point2 are in
 * 
 * @param line a Line object 
 * @returns {Number}
 */
function quarter(line){
	//calculates the gradient of the line
	var grad = line.m();
	
	if(grad > 0){
		if(line.getP1().getY() < line.getP2().getY()){
			//if point 2 is to the left of and below point 1 then we return 1
			return 1;
		} else {
			//if point 2 is to the right of and above point 1 then we return 3
			return 3;
		}
	} else {
		if(line.getP1().getX() > line.getP2().getX()){
			//If point 2 is to the left of and above point 1 then we return 2
			return 2;
		} else {
			//If point 2 is to the right of and below point 1 then we return 4
			return 4;
		}
	}
	
}

//---------------Point---------------//

/** This is a class Point which stores an x and y coordinate and also an array of observers
 * The implementation for an observable object has been adapted using the source referenced in the report.
 * 
 * @param x a double which contains the x coordinate of the point
 * @param y a double which contains the y coordinate of the point
 */
function Point(x, y){
	
	this.observers = [];
	this.x = x;
	this.y = y;

};

/** Getter method for x
 * 
 * @returns x
 */
Point.prototype.getX = function () {
	return this.x;
};

/** Getter method for y
 * 
 * @returns y
 */
Point.prototype.getY = function () {
	return this.y;
};

/** Class method that adds an object to observers array
 * 
 * @param observer an object that contains an update() method
 */
Point.prototype.addObserver = function(observer) {
  this.observers.push(observer)
};

/** Class method that calls the update method for each object in observers array
 * 
 */
Point.prototype.notify = function(){
	for(var i = 0; i<this.observers.length; i++){
		this.observers[i].update();
	}
};

/** Class method that sets x and y value of the point and notifys observers
 * 
 * @param x a double 
 * @param y a double
 * @param update a boolean to say whether observers need to be notified
 */
Point.prototype.setXY = function(x, y, update){
	this.x = x;
	this.y = y;
	
	if (update){
		this.notify();
	}
};


//---------------Line---------------//

/** This is a class Line which stores two Points
 * 
 * @param p1 a Point object
 * @param p2 a Point object
 */
function Line(p1, p2){
	
	this.point1 = p1;
	this.point2 = p2;	
};

/** Getter for point 1
 * 
 * @returns point1
 */
Line.prototype.getP1 = function(){
	return this.point1;
};

/** Getter for point 2
 * 
 * @returns point2
 */
Line.prototype.getP2 = function(){
	return this.point2;
};

/** Setter method for point1
 * 
 * @param point a Point object
 */
Line.prototype.setP1 = function(point){
	this.getP1().setXY(point.getX(), point.getY(), false);
};

/** Setter method for point2
 * 
 * @param point a Point object
 */
Line.prototype.setP2 = function(point){
	this.getP2().setXY(point.getX(), point.getY(), false);
};

/** Class method to calculate the gradient of the line
 * 
 * @returns {Number}
 */
Line.prototype.m = function() {
	//If the change in x coordinates and the change in y coordinate are both zero then the gradient is zero
	if (this.point2.getY()-this.point1.getY() === 0 && this.point2.getX()-this.point1.getX() === 0){
		return 0;
	} else {
		return (this.point2.getY()-this.point1.getY())/(this.point2.getX()-this.point1.getX());
	}
};

//---------------Circle---------------//

/** This is a class Circle which stores a Point and a double
 * 
 * @param point a Point object which is the centre of the circle
 * @param radius a double which is the radius of the circle
 */
function Circle(point, radius){
	this.point = point;
	this.r = radius;
};

/** Getter method for point
 * 
 * @returns point
 */
Circle.prototype.getP = function(){
	return this.point;
}

/** Getter method for radius
 * 
 * @returns radius
 */
Circle.prototype.getR = function(){
	return this.r;
}

/** Setter method for point
 * 
 * @param x a double which is the new x coordinate
 * @param y a double which is the new y coordinate
 */
Circle.prototype.setP = function(x, y){
	this.point.setXY(x, y, false);
}

/** Setter method for radius
 * 
 * @param r new radius
 */
Circle.prototype.setR = function(r){
	this.r = r;
}


//---------------Point on a line---------------//

function PointOnLine(point, line){
	
	this.line = line;
	this.gradient = this.line.m();
	this.point = point;

	this.setP();

};

PointOnLine.prototype.update = function(){
	this.setP();
	
}

PointOnLine.prototype.getP = function(){
	return this.point;
}

PointOnLine.prototype.getL = function(){
	return this.line;
}

PointOnLine.prototype.setP = function(){
	this.gradient = this.line.m();
	
	if(this.gradient === Number.POSITIVE_INFINITY || this.gradient === Number.NEGATIVE_INFINITY ){
		
		var x = this.getL().getP1().getX();
		var y = this.point.getY();
		
	} else {
		
		var x = (this.point.getX() + this.gradient*((this.gradient*this.getL().getP1().getX()) - this.getL().getP1().getY() + this.point.getY()))
		/(Math.pow(this.gradient, 2)+1);
		var y = this.gradient*(x - this.getL().getP1().getX())+ this.getL().getP1().getY();
	}
	
	this.getP().setXY(x, y, false);
	
	var q = quarter(this.line);
	
	switch(q){
		case 1:
			if (this.point.getY() > this.line.getP2().getY()){
				this.getP().setXY(this.line.getP2().getX(), this.line.getP2().getY(), false);
			} else if (this.point.getY() < this.line.getP1().getY()){
				this.getP().setXY(this.line.getP1().getX(), this.line.getP1().getY(), false);
			}
			break;
		case 2:
			if (this.point.getX() < this.line.getP2().getX()){
				this.getP().setXY(this.line.getP2().getX(), this.line.getP2().getY(), false);
			} else if (this.point.getX() > this.line.getP1().getX()){
				this.getP().setXY(this.line.getP1().getX(), this.line.getP1().getY(), false);
			}
			break;
		case 3:
			if (this.point.getY() < this.line.getP2().getY()){
				this.getP().setXY(this.line.getP2().getX(), this.line.getP2().getY(), false);
			} else if (this.point.getY() > this.line.getP1().getY()){
				this.getP().setXY(this.line.getP1().getX(), this.line.getP1().getY(), false);
			}
			break;
		case 4:
			if (this.point.getX() > this.line.getP2().getX()){
				this.getP().setXY(this.line.getP2().getX(), this.line.getP2().getY(), false);
			} else if (this.point.getX() < this.line.getP1().getX()){
				this.getP().setXY(this.line.getP1().getX(), this.line.getP1().getY(), false);
			}
			break;
	}
}


//------------------------Points on a Circle---------------------------//

function PointOnCircle(points, circle){
	this.circle = circle;
	this.points = points;
	
	this.setCP();
	
};

PointOnCircle.prototype.getPS = function(){
	return this.points;
};

PointOnCircle.prototype.getC = function(){
	return this.circle;
};

PointOnCircle.prototype.setCP = function(){
	
	var cx = this.circle.getP().getX();
	var cy = this.circle.getP().getY();
	
	for(var i = 0; i<this.points.length; i++){
		
		//build line between point and circle's centre
		var line = new Line(this.points[i], this.circle.getP());
		var gradient = line.m();
		
		/*As the line will intersect at two points on the circle
		if the points x value is to the left of the centre points x value then point 
		we want to obtain is the smaller x value else we want the bigger x value
		*/
		if (this.points[i].getX() <= cx){
			var x = cx - (this.circle.getR() / Math.pow(1 + Math.pow(gradient, 2), 0.5));
		} else {
			var x = cx + (this.circle.getR() / Math.pow(1 + Math.pow(gradient, 2), 0.5));
		}
		
		
		if (gradient === Number.POSITIVE_INFINITY || gradient === Number.NEGATIVE_INFINITY){
			
			if (cy <= this.points[i].getY()){
				var y = cy + this.circle.getR();
			} else {
				var y = cy - this.circle.getR();
			}	
			
		} else {
			var y = gradient*(x - cx) + cy;
		}
		
		this.points[i].setXY(x, y, false);
		
	}
};

PointOnCircle.prototype.update = function(){
	this.setCP();
}

//---------------------------Line intersect Line---------------------//

function LineIntersection(l1, l2){
	
	this.line1 = l1;
	this.line2 = l2;
	this.point = new Point(0, 0);
	
	this.setLI();

};

LineIntersection.prototype.getIP = function(){
	return this.point;
}

LineIntersection.prototype.getL1 = function(){
	return this.line1;
}

LineIntersection.prototype.getL2 = function(){
	return this.line2;
}

LineIntersection.prototype.setLI = function(){
	
	var grad1 = this.line1.m();
	var grad2 = this.line2.m();
	
	var x = (grad1*this.line1.getP1().getX() - grad2*this.line2.getP1().getX()
			+ this.line2.getP1().getY() - this.line1.getP1().getY())/(grad1-grad2);
	var y = grad1*(x - this.line1.getP1().getX())+this.line1.getP1().getY();
	
	this.point.setXY(x, y, false);
}

LineIntersection.prototype.update = function(){
	this.setLI();
}

//---------------------------Line intersect Circle---------------------//

function IntersectCircle(line, circle){
	this.line = line;
	this.circle = circle;
	this.point1 = new Point(0,0);
	this.point2 = new Point(0,0);
	
	this.setIC();
}

IntersectCircle.prototype.getL = function(){
	return this.line;
}

IntersectCircle.prototype.getC = function(){
	return this.circle;
}

IntersectCircle.prototype.getIP1 = function(){
	return this.point1;
}

IntersectCircle.prototype.getIP2 = function(){
	return this.point2;
}

IntersectCircle.prototype.setIC = function(){
	
	var m = this.line.m();
	
	if(m === 0){
		
		y1 = this.line.getP1().getY();
		y2 = this.line.getP1().getY();
		x1 = Math.pow(Math.pow(y1-this.circle.getP().getY(), 2) + Math.pow(this.circle.getR(), 2), 0.5) + this.circle.getP().getX();
		x2 = -Math.pow(Math.pow(y1-this.circle.getP().getY(), 2) + Math.pow(this.circle.getR(), 2), 0.5) + this.circle.getP().getX();
		
	} else if(m === Number.POSITIVE_INFINITY || m === Number.NEGATIVE_INFINITY){
		
		x1 = this.line.getP1().getX();
		x2 = this.line.getP1().getX();
		y1 = Math.pow(Math.pow(x1-this.circle.getP().getX(), 2) - Math.pow(this.circle.getR(), 2), 0.5) + this.circle.getP().getY();
		y2 = -Math.pow(Math.pow(x1-this.circle.getP().getX(), 2) - Math.pow(this.circle.getR(), 2), 0.5) + this.circle.getP().getY();	
		
	} else {
		
		var c = this.line.getP1().getY() - this.line.getP1().getX()*m;
		var A = Math.pow(m, 2) + 1;
		var B = (2*m*c) - (2*this.circle.getP().getX()) - (2*this.circle.getP().getY()*m);
		var C = Math.pow(this.circle.getP().getX(), 2) + Math.pow(c, 2) - (2*this.circle.getP().getY()*c) + Math.pow(this.circle.getP().getY(), 2) - Math.pow(this.circle.getR(), 2);
		
		if(Math.pow(B, 2) - (4*A*C) >= 0) {
		
			var x1 = (-B + Math.pow(Math.pow(B, 2) - (4*A*C), 0.5))/(2*A);
			var x2 = (-B - Math.pow(Math.pow(B, 2) - (4*A*C), 0.5))/(2*A);
		
			var y1 = m*(x1-this.line.getP1().getX())+this.line.getP1().getY();
			var y2 = m*(x2-this.line.getP1().getX())+this.line.getP1().getY();
			
			this.point1.setXY(x1, y1, false);
			this.point2.setXY(x2, y2, false);
		} else {
			intsection1 = false;
			intsection2 = false;
		}
	}
	
	var q = quarter(this.line);
	
	switch(q){
		case 1:
			if (this.point2.getY() < this.line.getP1().getY() || this.point2.getY() > this.line.getP2().getY()){
				intersection2 = false;
			} else {
				intersection2 = true;
			}
			if (this.point1.getY() > this.line.getP2().getY() || this.point1.getY() < this.line.getP1().getY()){
				intersection1 = false;
			} else {
				intersection1 = true;
			}
			break;
		case 2:
			if (this.point1.getX() > this.line.getP1().getX() || this.point1.getX() < this.line.getP2().getX()){
				intersection1 = false;
			} else {
				intersection1 = true;
			}
			if (this.point2.getX() < this.line.getP2().getX() || this.point2.getX() > this.line.getP1().getX()){
				intersection2 = false;
			} else {
				intersection2 = true;
			}
			break;
		case 3:
			if (this.point1.getY() > this.line.getP1().getY() || this.point1.getY() < this.line.getP2().getY()){
				intersection1 = false;
			} else {
				intersection1 = true;
			}
			if (this.point2.getY() < this.line.getP2().getY() || this.point2.getY() > this.line.getP1().getY()){
				intersection2 = false;
			} else {
				intersection2 = true;
			}
			break;
		case 4:
			if (this.point2.getX() < this.line.getP1().getX() || this.point2.getX() > this.line.getP2().getX()){
				intersection2 = false;
			} else {
				intersection2 = true;
			}
			if (this.point1.getX() > this.line.getP2().getX() || this.point1.getX() < this.line.getP1().getX()){
				intersection1 = false;
			} else {
				intersection1 = true;
			}
			break;
	}

}

IntersectCircle.prototype.update = function(){
	this.setIC();
}