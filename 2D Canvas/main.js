
var FPS = 20;
var GRAVITY = 0.5;
var _canvas;
var _context;
var _cannon;
var _map;
 
function clear() {
    _context.clearRect(0, 0, _canvas.width, _canvas.height);
}
 
function init() {
    _canvas = document.getElementById("canvas");
    _context = _canvas.getContext("2d");
 
    _map = new Map(_canvas.width,_canvas.height);
    _cannon = new Cannon(_canvas.width,_canvas.height,20,20);
    draw();
}
function draw() {
    clear();
    _map.draw(_context);
    _cannon.draw(_context);
}
function update() {
    _cannon.update(_map);
    draw();
}
function canvas_mousemove(e){
    var x = e.pageX - _canvas.offsetLeft;
    var y = e.pageY - _canvas.offsetTop;
    _cannon.rotate(x,y);
}
function canvas_mousedown(e){
    var x = e.pageX - _canvas.offsetLeft;
    var y = e.pageY - _canvas.offsetTop;
    _cannon.fire(x,y);
}
 
// onload
window.onload = function(){
    init();
    _canvas.onmousemove = canvas_mousemove;
    _canvas.onmousedown = canvas_mousedown;
 
    window.setInterval(update,1000/FPS);
}
