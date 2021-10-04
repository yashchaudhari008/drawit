let sFactor = 0.85;
let timer = null;
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
    stroke_colour = pen_colour_picker.value();
    let r = document.querySelector(':root');
    
    let tempKey = key.toUpperCase();
    if (tempKey == 'Q') {
        stroke_weight += 1;
    }
    else if (tempKey == 'A' && stroke_weight > 1) {
        stroke_weight -= 1;
    }
    
    stroke_colour = pen_colour_picker.value();
    r.style.setProperty('--pen-strokeColour',stroke_colour);
    r.style.setProperty('--pen-stroke',`${stroke_weight}px`);
    pen_size_display.html('Pen Size: '+stroke_weight);

    document.getElementById("pen_preview").className="show";
    if(timer!=null)
    {
        window.clearTimeout(timer); 
    }
    timer = setTimeout(function () {
        document.getElementById("pen_preview").className="hide";
    },2500);
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

function backToHome()
{
    if(confirm("Are you sure you want to exit?"))
    {
        location.href="../index.html";
    }
    else{}
}