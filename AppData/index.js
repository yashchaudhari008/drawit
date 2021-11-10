let sFactor = 0.85;
let timer = null;
let current_status; //1 for pen, 0 for eraser.
function setup() {
    background_colour = 'white';
    stroke_colour = 'black';
    stroke_weight = 3;
    current_status = 1;

    canvas = createCanvas(windowWidth * (sFactor + 0.1), windowHeight * sFactor);
    canvas.parent('#canvasHolder');
    canvas.elt.onmouseover = () => canvas.isMouseOver = true;
    canvas.elt.onmouseout = () => canvas.isMouseOver = false;
    setBackground(background_colour);

    background_colour_picker = createColorPicker(background_colour);
    background_colour_picker.parent('#background-control')

    pen_colour_picker = createColorPicker(stroke_colour);
    pen_colour_picker.parent('#pen-control')

    pen_size_display = createP('Pen Size: ' + stroke_weight);
    pen_size_display.parent('#variables');

}

function changeStrokeWeight(value) {
    // stroke weight can not be < 1
    if (stroke_weight === 1 && value < 0)
        return;
    
    //stroke weight can not be > 90
    if (stroke_weight === 90 && value > 0) 
        return;

    stroke_weight += value;
    let root = document.querySelector(':root');
    root.style.setProperty('--pen-strokeColour', stroke_colour);
    root.style.setProperty('--pen-stroke', `${stroke_weight}px`);
    pen_size_display.html('Pen Size: ' + stroke_weight);

    // show stroke weight on screen
    document.getElementById("pen_preview").className = "show";

    // timer to hide stroke weight
    if (timer !== null)
        window.clearTimeout(timer);

    timer = setTimeout(function () {
        document.getElementById("pen_preview").className = "hide";
    }, 1000);
}

function mouseOnCanvas(){
    let canvasWidth = windowWidth * (sFactor + 0.1);
    let canvasHeight = windowHeight * sFactor;
    const brushTip = document.querySelector('#brushTip');
    if((mouseX < canvasWidth && mouseX > 0) && (mouseY < canvasHeight && mouseY > 0) ){
        if(brushTip.classList.contains('hide')){brushTip.classList.remove('hide')}
        return true;
    }
    if(!brushTip.classList.contains('hide')){brushTip.classList.add('hide')}
    return false;
}


function draw() {

    const brushTip = document.querySelector('#brushTip');
    if(mouseOnCanvas()){
        brushTip.setAttribute("style", "top: "+ (mouseY-(stroke_weight/2.0) - 0.4)  + "px; left: " + (mouseX-(stroke_weight/2.0)-0.4) +"px;");
        brushTip.style.setProperty('background-color', stroke_colour);
    }
    
    if (mouseIsPressed && mouseOnCanvas()) {
        stroke(stroke_colour);
        strokeWeight(stroke_weight);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }

    if (background_colour_picker.value() != background_colour) {
        setBackground(background_colour_picker.value());
    }

    if (current_status) {
        //Dealing with Pen
        stroke_colour = pen_colour_picker.value();
    } else {
        //Dealing with Eraser
        stroke_colour = background_colour_picker.value();
    }

    // change pen stroke on long pressing keys Q/A
    if (keyIsDown(81)) {
        changeStrokeWeight(value = 1);
    }
    else if (keyIsDown(65)) {
        changeStrokeWeight(value = -1);
    }
}

function keyTyped() {
    const pressed_key = key.toUpperCase();

    if (pressed_key == 'Z') {
        //switch between pen and eraser
        current_status ^= 1;

        if (current_status) {
            document.getElementById("switch").textContent = "Press Z to toggle to Eraser";
            noErase();
        }
        else {
            document.getElementById("switch").textContent = "Press Z to toggle to Pen";
            erase();
        }
    }
}

let clearCanvas = () => clear();

function setBackground(colour) {
    background_colour = colour;
    canvas.style("backgroundColor", colour);
}

function windowResized() {
    resizeCanvas(windowWidth * (sFactor + 0.1), windowHeight * sFactor, true);
}

function fullScreen() {
    let fs = fullscreen();
    fullscreen(!fs);
}

function backToHome() {
    if (confirm("Are you sure you want to exit?")) {
        location.href = "../index.html";
    }
    else { }
}

function saveAsImage(fileName) {
    /**
     * The p5 lib applies background as a Fill rectangle. To have more flexibility 
     * the code was refactor to use background color as the canvas background
     * color (CSS).
     * 
     * To save the image with the background, the code:
     *  1 - Takes a backup of the current drawings.
     *  2 - Uses the drawingContext's globalCompositeOperation as 'destination-over'. (New
     *      shapes are drawn behind the existing canvas content)
     *  3 - Applies the background color as a Fill rectangle operation.
     *  4 - Call p5js's saveCanvas. (To download/save current canvas)
     *  5 - Using the backup from step 1 canvas' state is restored (overwrite current 
     *      canvas' state with the backup) and canvas' background.
     * 
     * @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
     */

    // Steps 1 to 3
    const { originalDrawings, originalCompositeOperation } = mergeBgAndDrawings(canvas);
    
    // Step 4
    saveCanvas(fileName);
    
    // Step 5
    separateBgAndDrawings(canvas, originalCompositeOperation, originalDrawings);
}

function mergeBgAndDrawings(canvas) {
    /**
     * Using the drawingContext's globalCompositeOperation it merges the background, which is 
     * applied as a Fill rectangle operation, into the current drawings and set the canvas'
     * background color to transparent.
     * 
     * @param   {HTMLCanvasElement} canvas The canvas element to merge the background color.
     * @return  {Object} An object with 2 properties: originalDrawings, originalCompositeOperation.
     * 
     * @link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
     */
    const originalDrawings = drawingContext.getImageData(0, 0, canvas.width, canvas.height);
    const originalCompositeOperation = drawingContext.globalCompositeOperation;

    canvas.style("backgroundColor", "transparent");
    drawingContext.globalCompositeOperation = 'destination-over';
    drawingContext.fillStyle = background_colour;
    drawingContext.fillRect(0, 0, canvas.width, canvas.height);

    return { originalDrawings, originalCompositeOperation };
}


function separateBgAndDrawings(canvas, originalCompositeOperation, originalDrawings) {
    /**
     * Overwrite the given canvas content with the provided originalDrawings and set the canvas'
     * background color to the global background_colour
     * @param {HTMLCanvasElement} canvas The canvas element to overwrite content by the provided state
     * @param {String} originalCompositeOperation The canvas element to overwrite content by the provided state
     * @param {ImageData} originalDrawings The canvas element to overwrite content by the provided state
     */
    drawingContext.globalCompositeOperation = originalCompositeOperation;
    drawingContext.putImageData(originalDrawings, 0, 0);
    canvas.style("backgroundColor", background_colour);
}
