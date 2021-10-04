let sFactor = 0.85;

function setup() {
    background_colour = 'white';
    stroke_colour = 'black';
    stroke_weight = 3;


    canvas = createCanvas(windowWidth *(sFactor + 0.1), windowHeight *sFactor);
    canvas.parent('#canvasHolder');
    background(background_colour);

    createP('Background Colour: ').parent('#controls');
    background_colour_picker = createColorPicker(background_colour);
    background_colour_picker.parent('#controls')

    createP('Pen Colour: ').parent('#controls');
    pen_colour_picker = createColorPicker(stroke_colour);
    pen_colour_picker.parent('#controls')

    pen_size_display = createP('Pen Size: '+stroke_weight);
    pen_size_display.parent('#variables');

}

function keyTyped() {
    let tempKey = key.toUpperCase();
    if (tempKey == 'Q') {
        stroke_weight += 1;
    }
    else if (tempKey == 'A' && stroke_weight > 1) {
        stroke_weight -= 1;
    }
    pen_size_display.html('Pen Size: '+stroke_weight);
}

function draw() {
    if (mouseIsPressed) {
        stroke(stroke_colour);
        strokeWeight(stroke_weight);
        line(mouseX, mouseY, pmouseX, pmouseY);
    }

    if(background_colour_picker.value() != background_colour) {
        clearCanvas();
    }

    if(pen_colour_picker.value() != stroke_colour) {
        stroke_colour = pen_colour_picker.value();
    }
}

function clearCanvas() {
    clear();
    background_colour = background_colour_picker.value();
    background(background_colour)
}

function windowResized() {

    resizeCanvas(windowWidth *(sFactor + 0.1), windowHeight *sFactor, true);
    clearCanvas();

}

function fullScreen() {
    let fs = fullscreen();
    fullscreen(!fs);
}

function backtohome()
{
    if(confirm("Are you sure you want to exit?"))
    {
        location.href="../index.html";
    }
    else{}
}