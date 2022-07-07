var canvas;
var ctx;
var widthCanvas;
var heightCanvas;
// View parameters
var xleftView = 0;
var ytopView = 0;
var widthViewOriginal = document.getElementById('canvas').width;           //actual width and height of zoomed and panned display
var heightViewOriginal = document.getElementById('canvas').height;
var widthView = widthViewOriginal;           //actual width and height of zoomed and panned display
var heightView = heightViewOriginal;

window.addEventListener("load",setup,false);

function setup() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    widthCanvas = canvas.width;
    heightCanvas = canvas.height;

    // canvas.addEventListener("dblclick", handleDblClick, false);  // dblclick to zoom in at point, shift dblclick to zoom out.
    canvas.addEventListener("mousedown", handleMouseDown, false); // click and hold to pan
    canvas.addEventListener("mousemove", handleMouseMove, false);
    canvas.addEventListener("mouseup", handleMouseUp, false);
    canvas.addEventListener("mousewheel", handleMouseWheel, false); // mousewheel duplicates dblclick function
    canvas.addEventListener("DOMMouseScroll", handleMouseWheel, false); // for Firefox

    draw();
}
var mouseDown = false;

function handleMouseDown(event) {
    mouseDown = true;
}

function handleMouseUp(event) {
    mouseDown = false;
}

var lastX = 0;
var lastY = 0;
function handleMouseMove(event) {

    var X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;
    var Y = event.clientY - this.offsetTop - this.clientTop + this.scrollTop;

    if (mouseDown) {
        var dx = (X - lastX) / widthCanvas * widthView;
        var dy = (Y - lastY)/ heightCanvas * heightView;
    xleftView -= dx;
    ytopView -= dy;
    xleftView = Math.max(xleftView, 0);
    ytopView = Math.max(ytopView, 0);
    xleftView = Math.min(xleftView, widthViewOriginal-widthView);
    ytopView = Math.min(ytopView, heightViewOriginal-heightView);
    }
    lastX = X;
    lastY = Y;

    draw();
}

function handleMouseWheel(event) {
    var x = widthView/2 + xleftView;  // View coordinates
    var y = heightView/2 + ytopView;

    var scale = (event.wheelDelta < 0 || event.detail > 0) ? 1.1 : 0.9;
    widthView *= scale;
    heightView *= scale;

    if (widthView > widthViewOriginal || heightView > heightViewOriginal) {
    widthView = widthViewOriginal;
    heightView = heightViewOriginal;
    x = widthView/2;
    y = heightView/2;
    }

    // scale about center of view, rather than mouse position. This is different than dblclick behavior.
    xleftView = x - widthView/2;
    ytopView = y - heightView/2;
    xleftView = Math.max(xleftView, 0);
    ytopView = Math.max(ytopView, 0);
    xleftView = Math.min(xleftView, widthViewOriginal-widthView);
    ytopView = Math.min(ytopView, heightViewOriginal-heightView);

    draw();
}

img = new Image;
img.src = "https://www.cwb.gov.tw/Data/radar/CV1_TW_1000_forPreview.png"

function draw() {

    if (!canvas.getContext) {
        return;
    }
    ctx.clearRect(0,0,widthViewOriginal,heightViewOriginal);
    
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(widthCanvas/widthView, heightCanvas/heightView);
    ctx.translate(-xleftView,-ytopView);

    ctx.drawImage(img, 0, 0, widthViewOriginal, heightViewOriginal);
    // set line stroke and line width
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 1;
    x0 = 118   // longitude
    y0 = 20.5  // latitude
    dx = widthViewOriginal/6    // px/degree
    dy = heightViewOriginal/6   // px/degree
    lat = document.getElementById("radar_lat").value;
    lon = document.getElementById("radar_lon").value;

    px = (lon-x0)*dx                        // position of radar on canvas
    py = heightViewOriginal-(lat-y0)*dy     // position of radar on canvas
    dd = 1/(6378.1370*Math.cos(24.5*Math.PI/180)*2*Math.PI/360) // degree/km
    // point (radar location)
    ctx.fillStyle = 'red'
    ctx.beginPath();
    ctx.arc(px, py, 3, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
    // circle (radar sweep range)
    ctx.beginPath();
    ctx.arc(px, py, 150*dd*dx, 0, 2*Math.PI); // radar range 150km
    ctx.closePath();
    ctx.stroke();

    // azi
    draw_azi();

    // draw canvas out-line
    ctx.strokeStyle = 'black';
    ctx.setTransform(1,0,0,1,0,0);
    ctx.scale(1, 1);
    ctx.translate(0,0);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(widthViewOriginal, 0);
    ctx.lineTo(widthViewOriginal, heightViewOriginal);
    ctx.lineTo(0, heightViewOriginal);
    ctx.lineTo(0, 0);
    ctx.stroke();

    ctx.restore();

}
function draw_azi() {
    azis = document.getElementById("azi").value.split(" ");
    azis.forEach(azi => {
        if(azi=="") return
        px_end = px+150*dd*dx*Math.sin(azi*Math.PI/180)
        py_end = py-150*dd*dx*Math.cos(azi*Math.PI/180)
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px_end, py_end);
        ctx.stroke();
    });
}