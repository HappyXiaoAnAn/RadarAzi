
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

img = new Image;
img.src = "https://www.cwb.gov.tw/Data/radar/CV1_TW_1000_forPreview.png"
img.onload = function(){
    draw();
}

function draw() {

    if (!canvas.getContext) {
        return;
    }
    ctx.clearRect(0,0,400,400);

    ctx.drawImage(img, 0, 0, 400, 400);

    // ctx.drawImage(img, 0, 0, 400, 400);
    // set line stroke and line width
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    // draw a out-line
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(400, 0);
    ctx.stroke();
    // ctx.beginPath();
    ctx.moveTo(400, 0);
    ctx.lineTo(400, 400);
    ctx.stroke();
    // ctx.beginPath();
    ctx.moveTo(400, 400);
    ctx.lineTo(0, 400);
    ctx.stroke();
    // ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(0, 0);
    ctx.stroke();


    ctx.strokeStyle = 'red';
    x0 = 118
    y0 = 20.5
    dx = 400/6
    dy = 400/6
    lat = document.getElementById("radar_lat").value;
    lon = document.getElementById("radar_lon").value;

    px = (lon-x0)*dx
    py = 400-(lat-y0)*dy
    dd = 1/(6378.1370*Math.cos(24.5*Math.PI/180)*2*Math.PI/360)
    // point
    ctx.fillStyle = 'red'
    ctx.beginPath();
    ctx.arc(px, py, 5, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
    // circle
    ctx.beginPath();
    ctx.arc(px, py, 150*dd*dx, 0, 2*Math.PI);
    ctx.closePath();
    ctx.stroke();

    // line
    draw_azi();
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