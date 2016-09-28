/**This JavaScript file contains the controller for the application
 * 
 * @author Natalie McDonnell
 * @date 11-09-2016
 * 
 */

/**This method sets the width and height of the canvas
 * It also add the listeners to the canvas
 * 
 */
function canvasSettings(){
	
	//Gets canvas from HTML document and sets rendering to 2D
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");
	
	//Setting width, height and background colour
	canvas.width = window.innerWidth-30;
	canvas.height = window.innerHeight-150;
	canvas.style.backgroundColor = "#FFFFFF";
	
	//Adding listeners
	canvas.addEventListener("touchstart", mousePressed, false);
	canvas.addEventListener("touchend", mouseReleased, false);
	canvas.addEventListener("touchcancel", mouseReleased, false);
	canvas.addEventListener("touchmove", mouseDragged, false);
}

/**Function that happens when event listener touchstart is called
 * It updates the position of the point
 * @param evt is the event that has called this method
 */
function mousePressed(evt){

	//Gets information about the first touch event
	var touch = evt.targetTouches[0];
	//Sets x and y to be the position of the touch on the canvas
	var x = touch.pageX - rect.left;
	var y = touch.pageY - rect.top;
	
	//Method to find which move-able point has been selected
	selectedElement = selectPoint(x, y);
	
	//If a moveable point has been selected the position of that element is updated to the touch position
	if(selectedElement !== true){
		//Prevents default events happening like page scrolling
		evt.preventDefault();
		position(x, y, selectedElement);
    }
}
	

/**Function that happens when event listener touchmove is called
 * It updates the position of the point
 * @param evt is the event that has called this method
 */
function mouseDragged(evt) {

	//Gets information about the first touch event
	var touch = evt.targetTouches[0];
	//Sets x and y to be the position of the touch on the canvas
	var x = touch.pageX - rect.left;
	var y = touch.pageY - rect.top;

	//As long as the touch is inside the canvas and a move-able point is selected its position is updated
	if(x>0 && x<rect.width && y>0 && y<rect.height){
		if (selectedElement !== true){
			//Prevents default events happening like page scrolling
			evt.preventDefault();
			position(x, y, selectedElement);
			drawConic();
		}
	}
	
}

/**Function that happens when event listener touchend or touchcancel is called
 * It released the point from being updated
 * @param evt is the event that has called this method
 */
function mouseReleased(evt) {
	
	//Prevents default events happening like page scrolling
	evt.preventDefault();
	//Deselects the selected point
	selectedElement = true;
	
}

/** This method updates the x and y coordinates of a point an paints the canvas
 * 
 * @param x a double is the position of the x coordinate on the canvas
 * @param y a double is the position of the y coordinate on the canvas
 * @param selectedElement an object which is to be updated
 */
function position(x, y, selectedElement){
	
	selectedElement.setXY(x, y, true);
	
	paint();
}