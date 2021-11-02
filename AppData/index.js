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

    createP('Background Colour: ').parent('#controls');
    background_colour_picker = createColorPicker(background_colour);
    background_colour_picker.parent('#controls')

    createP('Pen Colour: ').parent('#controls');
    pen_colour_picker = createColorPicker(stroke_colour);
    pen_colour_picker.parent('#controls')

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

    if (pressed_key != 'Z')
        return;

    //switch between pen and eraser
    current_status ^= 1;

    if (current_status) {
        document.getElementById("switch").textContent = "Press Z to toggle to Eraser"
        noErase();
        return;
    }
    
    document.getElementById("switch").textContent = "Press Z to toggle to Pen"
    erase();
}

function clearCanvas() {
    clear();
}

function setBackground(colour) {
    background_colour = colour;
    document.querySelector('canvas').style.backgroundColor = colour;
}

function windowResized() {
    resizeCanvas(windowWidth * (sFactor + 0.1), windowHeight * sFactor, true);
    clearCanvas();

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

function saveCanvasInternal(fileName) {
    const canvas = document.querySelector('canvas');
    const width = windowWidth * (sFactor + 0.1);
    const height = windowHeight * sFactor;
    const originalDrawings = drawingContext.getImageData(0, 0, width, height);
    const originalCompositeOperation = drawingContext.globalCompositeOperation;
    
    mergeBgAndDrawings(canvas, width, height);
    
    saveCanvas(fileName);
    
    separateBgAndDrawings(canvas, width, height, originalCompositeOperation, originalDrawings, background_colour);
}

function mergeBgAndDrawings(canvas, width, height) {
    canvas.style.backgroundColor = 'transparent';
    drawingContext.globalCompositeOperation = 'destination-over';
    drawingContext.fillStyle = background_colour;
    drawingContext.fillRect(0, 0, width, height);
}

function separateBgAndDrawings(canvas, width, height, originalCompositeOperation, originalDrawings, bgColor) {
    drawingContext.globalCompositeOperation = originalCompositeOperation;
    drawingContext.putImageData(originalDrawings, 0, 0);
    canvas.style.backgroundColor = bgColor;
}